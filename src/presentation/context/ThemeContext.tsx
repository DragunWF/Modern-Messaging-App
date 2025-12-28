import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  lightTheme,
  darkTheme,
  ThemeColors,
} from "../../shared/constants/colors";

// Define the shape of our theme context
interface ThemeContextType {
  currentTheme: "light" | "dark";
  colors: ThemeColors;
  toggleTheme: () => void;
}

// Create the context with a default undefined value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Key for AsyncStorage
const THEME_STORAGE_KEY = "@user_theme";

// Theme provider component
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light"); // Default to light

  // Load theme from AsyncStorage on app start
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme === "light" || storedTheme === "dark") {
          setCurrentTheme(storedTheme);
        }
      } catch (e) {
        console.error("Failed to load theme from AsyncStorage", e);
      }
    };
    loadTheme();
  }, []);

  // Memoize the colors based on the current theme
  const colors = useMemo(() => {
    return currentTheme === "light" ? lightTheme : darkTheme;
  }, [currentTheme]);

  // Function to toggle theme and save to AsyncStorage
  const toggleTheme = async () => {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    setCurrentTheme(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (e) {
      console.error("Failed to save theme to AsyncStorage", e);
    }
  };

  const value = useMemo(
    () => ({
      currentTheme,
      colors,
      toggleTheme,
    }),
    [currentTheme, colors, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
