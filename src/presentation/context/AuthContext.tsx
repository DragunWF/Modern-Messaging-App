import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { UserUseCases } from "../../application/useCases/userUseCases";
import UserRepository from "../../infrastructure/repositories/userRepository";
import { FirebaseAuthService } from "../../infrastructure/auth/authService";
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize dependencies
  // We use useMemo to avoid re-instantiating on every render, although these are lightweight.
  // In a more complex app, we might use dependency injection.
  const authService = new FirebaseAuthService();
  const userRepository = new UserRepository();
  const userUseCases = new UserUseCases(authService, userRepository);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch user profile from DB
          const userProfile = await userRepository.getUserById(
            firebaseUser.uid
          );
          if (userProfile) {
            setUser(userProfile);
            setIsAuthenticated(true);
          } else {
            console.warn(
              "User authenticated in Firebase but profile not found in DB"
            );
            // In a production app, you might redirect to a profile creation screen
            setIsAuthenticated(false);
            setUser(null);
          }
        } catch (e) {
          console.error("Error fetching user profile", e);
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const loggedInUser = await userUseCases.loginUser(email, password);
      if (loggedInUser) {
        setUser(loggedInUser);
        setIsAuthenticated(true);
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
