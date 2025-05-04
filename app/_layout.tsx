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
import { useAuthStore } from "@/domain/auth/stores/authStore";
import path from "@/common/constants/path";
import AuthEventListener from "./../src/domain/auth/events/authEventListener";

SplashScreen.preventAutoHideAsync().catch(() => {});

// 인증 상태에 따라 리디렉션하는 컴포넌트
function AuthStateListener({ children }: { children: ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const { initAuth, isAuthenticated, isLoading } = useAuthStore();
  const initialCheckRef = useRef(false);

  // 초기 인증 체크를 위한 useEffect
  useEffect(() => {
    if (isLoading || initialCheckRef.current) return;

    const checkAuth = async () => {
      await initAuth();
      initialCheckRef.current = true;
    };

    checkAuth();
  }, [isLoading, initAuth]);

  // 통합된 라우팅 처리
  useEffect(() => {
    if (isLoading || !initialCheckRef.current) return;

    const isProtectedRoute = segments[0] === ("(protected)" as string);
    const isPublicRoute = segments[0] === ("(public)" as string);
    const isRootRoute =
      segments.length === (0 as number) ||
      (segments.length === 1 && segments[0] === ("index" as string));

    // 인증되지 않은 상태에서 protected 라우트 접근
    if (!isAuthenticated && isProtectedRoute) {
      console.log("Redirecting to welcome page - not authenticated");
      router.replace(path.showWelcome());
    }
    // 인증된 상태에서 public 또는 root 라우트 접근
    else if (isAuthenticated && (isPublicRoute || isRootRoute)) {
      console.log("Redirecting to room list - authenticated");
      router.replace(path.showRoomList());
    }
  }, [isAuthenticated, isLoading, segments, router]);
  // 최초 로딩 중일 때만 로딩 화면 표시
  if (isLoading && !initialCheckRef.current) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}

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

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#000" />
    </View>
  );
}
