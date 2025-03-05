import { Slot } from "expo-router";
import { createTamagui, TamaguiProvider, Theme } from "tamagui";
import CustomQueryClientProvider from "../src/common/hooks/queries/customQueryClientProvider";
import { useFonts } from "expo-font";
import { View, ActivityIndicator } from "react-native";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../src/common/components/ErrorFallback";
import { defaultConfig } from "@tamagui/config/v4";

SplashScreen.preventAutoHideAsync().catch(() => {});

const tamaguiConfig = createTamagui(defaultConfig);

export default function RootLayout() {
  const [fontsLoaded, fontsError] = useFonts({
    CookieRun_Bold: require("../assets/CookieRunFont_TTF/CookieRun_Black.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontsError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontsError]);

  if (!fontsLoaded && !fontsError) {
    return <LoadingScreen />;
  }

  return (
    <TamaguiProvider config={tamaguiConfig}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <CustomQueryClientProvider>
          <Slot />
        </CustomQueryClientProvider>
      </ErrorBoundary>
    </TamaguiProvider>
  );
}

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#000" />
    </View>
  );
}
