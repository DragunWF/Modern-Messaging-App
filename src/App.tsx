import { StatusBar } from "expo-status-bar";
import NavigationWrapper from "./presentation/components/navigation/NavigationWrapper";
import Toast from "react-native-toast-message";
import { AuthProvider } from "./presentation/context/AuthContext";
import { ThemeProvider, useTheme } from "./presentation/context/ThemeContext";

// Create a component to wrap StatusBar so we can use the useTheme hook
function ThemedStatusBar() {
  const { colors } = useTheme();
  return <StatusBar style={colors.statusBar} />;
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ThemedStatusBar />
        <NavigationWrapper />
      </ThemeProvider>
      <Toast />
    </AuthProvider>
  );
}
