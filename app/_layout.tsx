import { Stack } from "expo-router";
import { PaperProvider, DefaultTheme, MD3LightTheme } from "react-native-paper";
import { useFonts } from "expo-font";
import { View, ActivityIndicator } from "react-native";
import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { backgroundColor } from "../src/common/styles/color";
import { StatusBar } from "expo-status-bar";
import { color } from "@/common/styles/color";

import ErrorFallback from "../src/common/components/ErrorFallback";
import CustomQueryClientProvider from "../src/common/hooks/queries/customQueryClientProvider";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontsError] = useFonts({
    CookieRun_Bold: require("../assets/CookieRunFont_TTF/CookieRun_Black.ttf"),
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
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <CustomQueryClientProvider>
          <StatusBar backgroundColor={backgroundColor.white} />
          <Stack screenOptions={{ headerShown: false }}>
            {/* 기본 화면들은 일반적인 전환 효과 사용 */}
            <Stack.Screen name="index" />

            {/* prayer/creation 경로에 대한 특별한 전환 효과 설정 */}
            <Stack.Screen
              name="prayers/creation"
              options={{
                animation: "slide_from_bottom",
                presentation: "modal",
              }}
            />
          </Stack>
        </CustomQueryClientProvider>
      </ErrorBoundary>
    </PaperProvider>
  );
}

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#000" />
    </View>
  );
}
