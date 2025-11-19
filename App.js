import React, { useEffect, useState } from "react";
import AppNavigator from "./src/Navigations/AppNavigator";
import { Splash } from "./src/Screens/splash";
import { StatusBar, StyleSheet } from "react-native";
import { ToastProvider } from "react-native-toast-notifications";

export default function App() {
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoader(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ToastProvider
      placement="bottom"
      duration={4000}
      animationType="slide-in"
      offset={30}
      swipeEnabled={true}
    >
      <StatusBar barStyle='dark-content' hidden={false} backgroundColor='#fff'/>
      {loader ? <Splash /> : <AppNavigator />}
    </ToastProvider>
  );
}


