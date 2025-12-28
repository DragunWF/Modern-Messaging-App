import { StatusBar } from "expo-status-bar";
import NavigationWrapper from "./presentation/components/navigation/NavigationWrapper";
import Toast from "react-native-toast-message";
import { AuthProvider } from "./presentation/context/AuthContext";
import { ThemeProvider } from "./presentation/context/ThemeContext"; // Import ThemeProvider

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <AuthProvider>
        <ThemeProvider>
          <NavigationWrapper />
        </ThemeProvider>
      </AuthProvider>
      <Toast />
    </>
  );
}
