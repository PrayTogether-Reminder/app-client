import { Stack, useRouter, useSegments } from "expo-router";
import { PaperProvider, DefaultTheme, MD3LightTheme } from "react-native-paper";
import { useFonts } from "expo-font";
import { View, ActivityIndicator } from "react-native";
import { useEffect, useRef, ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { backgroundColor } from "../src/common/styles/color";
import { StatusBar } from "expo-status-bar";
import { color } from "@/common/styles/color";
import ErrorFallback from "../src/common/components/error/ErrorFallback";
import CustomQueryClientProvider from "../src/common/hooks/queries/customQueryClientProvider";
import * as SplashScreen from "expo-splash-screen";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useAuthStore } from "@/domain/auth/stores/useAuthStore";
import path from "@/common/constants/path";
import AuthEventListener from "./../src/domain/auth/events/authEventListener";
import AuthStateListener from "@/common/global/authStateListener";
import LoadingScreen from "@/common/global/LoadingScreen";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontsError] = useFonts({
    CookieRun_Bold: require("../assets/CookieRunFont_TTF/CookieRun_Black.ttf"),
    ...FontAwesome.font,
    ...FontAwesome6.font,
  });

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: color.secondary, // TextInput 활성화 색상 등에 영향
    },
  };

  useEffect(() => {
    if (fontsLoaded || fontsError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontsError]);

  if (!fontsLoaded && !fontsError) {
    return <LoadingScreen />;
  }

  return (
    <PaperProvider theme={theme}>
      {/* catch rendering error */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <CustomQueryClientProvider>
          <StatusBar backgroundColor={backgroundColor.white} />
          <AuthEventListener />
          <AuthStateListener>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />

              <Stack.Screen
                name="(protected)/prayers/creation/index"
                options={{
                  animation: "slide_from_bottom",
                  presentation: "modal",
                }}
              />
            </Stack>
          </AuthStateListener>
        </CustomQueryClientProvider>
      </ErrorBoundary>
    </PaperProvider>
  );
}
