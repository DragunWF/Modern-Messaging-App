import { StatusBar } from "expo-status-bar";
import NavigationWrapper from "./presentation/components/navigation/NavigationWrapper";
import Toast from "react-native-toast-message";

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <NavigationWrapper />
      <Toast />
    </>
  );
}
