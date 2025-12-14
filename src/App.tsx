import { StatusBar } from "expo-status-bar";
import NavigationWrapper from "./presentation/components/navigation/NavigationWrapper";
import Toast from "react-native-toast-message";
import { AuthProvider } from "./presentation/context/AuthContext";

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <AuthProvider>
        <NavigationWrapper />
      </AuthProvider>
      <Toast />
    </>
  );
}
