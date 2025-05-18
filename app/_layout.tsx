import AuthStateListener from "@/common/global/authStateListener";
import LoadingScreen from "@/common/components/loading/LoadingScreen";
import { color } from "@/common/styles/color";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { DefaultTheme, PaperProvider } from "react-native-paper";
import ErrorFallback from "../src/common/components/error/ErrorFallback";
import CustomQueryClientProvider from "../src/common/hooks/queries/customQueryClientProvider";
import { backgroundColor } from "../src/common/styles/color";
import AuthEventListener from "./../src/domain/auth/events/authEventListener";
import FcmInitializer from "@/common/services/fcm/fcmInitializer";

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
          <FcmInitializer />
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
