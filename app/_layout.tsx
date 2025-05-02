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
      console.log("Starting initial auth check");
      await initAuth();
      initialCheckRef.current = true;
      console.log("Initial auth check completed");
    };

    checkAuth();
  }, [isLoading, initAuth]);

  // (protected) 접근에 대한 리디렉션 처리
  useEffect(() => {
    if (isLoading || !initialCheckRef.current) return;
    const isProtectedRoute = segments[0] === ("(protected)" as string);
    if (!isAuthenticated && isProtectedRoute) {
      // 인증 X + (protected) 접근 시
      router.replace(path.showWelcome());
    }
  }, [isAuthenticated, isLoading, segments, router, initialCheckRef.current]);

  // 인증 O + (public) OR root(welcome) 접근에 대한 리디렉션 처리
  useEffect(() => {
    // 로딩 중이거나 초기 체크가 아직 완료되지 않았으면 무시
    if (isLoading || !initialCheckRef.current) return;
    const isPublicRoute = segments[0] === ("(public)" as string);
    const isRootRoute =
      segments.length === (0 as number) ||
      (segments.length === 1 && segments[0] === ("index" as string));

    // 인증 O + (public OR root 경로)에 있다면 리디렉션
    if (isAuthenticated && (isPublicRoute || isRootRoute)) {
      router.replace(path.showRoomList());
    }
  }, [isAuthenticated, isLoading, segments, router, initialCheckRef.current]);

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
