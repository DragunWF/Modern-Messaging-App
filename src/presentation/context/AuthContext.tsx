import React, { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useService } from "./ServiceContext";
import User from "../../domain/entities/user";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../infrastructure/database/firebaseConfig";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    username: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = "@auth_user";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Use dependency injection from ServiceContext
  const { userUseCases } = useService();

  useEffect(() => {
    // Check storage first for immediate access
    const loadFromStorage = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.warn("Failed to load user from storage", e);
      }
    };
    loadFromStorage();

    // Listen for auth state changes
    // Ideally, this listener should also be abstracted in AuthService
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch user profile using Use Case
          const userProfile = await userUseCases.getUserById(firebaseUser.uid);
          if (userProfile) {
            setUser(userProfile);
            setIsAuthenticated(true);
            await AsyncStorage.setItem(
              USER_STORAGE_KEY,
              JSON.stringify(userProfile)
            );
            // Initialize Presence
            userUseCases.initializeUserPresence(firebaseUser.uid);
          } else {
            console.warn(
              "User authenticated in Firebase but profile not found in DB"
            );
            setIsAuthenticated(false);
            setUser(null);
            await AsyncStorage.removeItem(USER_STORAGE_KEY);
          }
        } catch (e) {
          console.error("Error fetching user profile", e);
          setIsAuthenticated(false);
          setUser(null);
          await AsyncStorage.removeItem(USER_STORAGE_KEY);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        await AsyncStorage.removeItem(USER_STORAGE_KEY);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [userUseCases]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const loggedInUser = await userUseCases.loginUser(email, password);
      if (loggedInUser) {
        setUser(loggedInUser);
        setIsAuthenticated(true);
        await AsyncStorage.setItem(
          USER_STORAGE_KEY,
          JSON.stringify(loggedInUser)
        );
      }
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    username: string
  ) => {
    setIsLoading(true);
    try {
      const newUser = await userUseCases.registerUser(
        email,
        password,
        username
      );
      setUser(newUser);
      setIsAuthenticated(true);
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    } catch (error) {
      console.error("Registration failed", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await userUseCases.logoutUser();
      setUser(null);
      setIsAuthenticated(false);
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
    } catch (error) {
      console.error("Logout failed", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
