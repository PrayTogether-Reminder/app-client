import AuthStateListener from "@/common/global/authStateListener";
import LoadingScreen from "@/common/components/loading/LoadingScreen";
import { color } from "@/common/styles/color";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useFonts } from "expo-font";
import { Stack, router, Route, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { InteractionManager } from "react-native";
import { DefaultTheme, PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ErrorFallback from "../src/common/components/error/ErrorFallback";
import CustomQueryClientProvider from "../src/common/hooks/queries/customQueryClientProvider";
import AuthEventListener from "./../src/domain/auth/events/authEventListener";
import { GlobalAlertModal } from "@/common/components/modal/GlobalAlertModal";
import UpdateModalsManager from "@/common/components/UpdateModalsManager";
import { TutorialModal } from "@/common/components/tutorial";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/common/components/toast/ToastConfig";
import * as Notifications from "expo-notifications";
import { useAuthStore } from "@/domain/auth/stores/useAuthStore";
import { useScreenTracking } from "@/common/services/analytics";
import { configureGoogleSignIn } from "@/domain/auth/config/googleSignIn";
import path from "@/common/constants/path";

// Google Sign-In 초기화
configureGoogleSignIn();

SplashScreen.preventAutoHideAsync().catch(() => {});

// Expo Router 공식 방법: 알림 처리 hook
function useNotificationObserver() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const segments = useSegments();
  const [pendingNotification, setPendingNotification] =
    useState<Notifications.Notification | null>(null);

  function redirect(notification: Notifications.Notification) {
    const data = notification.request.content.data;

    if (data && data.roomId && data.prayerTitleId) {
      const roomId = Number(data.roomId);
      const prayerTitleId = Number(data.prayerTitleId);
      const prayerTitle = data.prayerTitle as string | undefined;

      console.log(`📱 Notification redirect: room ${roomId} → prayer ${prayerTitleId}`);

      router.push(path.showRoomById(roomId));

      InteractionManager.runAfterInteractions(() => {
        const prayerPath = `/(protected)/prayers/${prayerTitleId}?roomId=${roomId}${prayerTitle ? `&title=${encodeURIComponent(prayerTitle)}` : ''}` as Route;
        router.push(prayerPath);
      });
    } else if (data && data.prayerTitleId) {
      const prayerTitleId = Number(data.prayerTitleId);
      const prayerTitle = data.prayerTitle as string | undefined;
      const prayerPath = `/(protected)/prayers/${prayerTitleId}${prayerTitle ? `?title=${encodeURIComponent(prayerTitle)}` : ''}` as Route;

      console.log(`📱 Notification redirect: prayer ${prayerTitleId}`);
      router.push(prayerPath);
    }
  }

  // 1. 초기 알림 저장 (cold start)
  useEffect(() => {
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response?.notification) {
        setPendingNotification(response.notification);
      }
    });
  }, []);

  // 2. 런타임 알림 리스너
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const inProtectedRoute = segments[0] === "(protected)";
      if (isAuthenticated && !isLoading && inProtectedRoute) {
        redirect(response.notification);
      } else {
        setPendingNotification(response.notification);
      }
    });

    return () => subscription.remove();
  }, [isAuthenticated, isLoading, segments]);

  // 3. (protected) navigator 마운트 후 대기 중인 알림 처리
  useEffect(() => {
    if (segments[0] === "(protected)" && pendingNotification) {
      const notification = pendingNotification;
      setPendingNotification(null);
      InteractionManager.runAfterInteractions(() => {
        redirect(notification);
      });
    }
  }, [segments, pendingNotification]);
}

export default function RootLayout() {
  // 알림 처리 hook 호출
  useNotificationObserver();
  // 화면 추적
  useScreenTracking();
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
    <>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          {/* catch rendering error */}
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <CustomQueryClientProvider>
              <StatusBar style="light" />
              <AuthEventListener />
              <AuthStateListener>
                <GlobalAlertModal />
                <UpdateModalsManager />
                <TutorialModal />
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="index" />
                </Stack>
              </AuthStateListener>
            </CustomQueryClientProvider>
          </ErrorBoundary>
        </PaperProvider>
      </SafeAreaProvider>
      <Toast config={toastConfig} />
    </>
  );
}