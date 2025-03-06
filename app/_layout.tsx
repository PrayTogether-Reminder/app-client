import { Slot } from "expo-router";
import { PaperProvider, MD3LightTheme } from "react-native-paper";
import CustomQueryClientProvider from "../src/common/hooks/queries/customQueryClientProvider";
import { useFonts } from "expo-font";
import { View, ActivityIndicator } from "react-native";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../src/common/components/ErrorFallback";

SplashScreen.preventAutoHideAsync().catch(() => {});

// Paper 테마 커스터마이징
const theme = {
  ...MD3LightTheme,
  // 기존 앱의 테마 색상과 일치하도록 커스터마이징
  colors: {
    ...MD3LightTheme.colors,
    primary: '#000000', // 기존 앱의 주요 색상으로 변경하세요
    accent: '#f1c40f',  // 액센트 색상
  },
  fonts: {
    ...MD3LightTheme.fonts,
    // 폰트 설정을 원한다면 여기에 추가
  }
};

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
    <PaperProvider theme={theme}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <CustomQueryClientProvider>
          <Slot />
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