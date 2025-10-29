import AuthStateListener from "@/common/global/authStateListener";
import LoadingScreen from "@/common/components/loading/LoadingScreen";
import { color } from "@/common/styles/color";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useFonts } from "expo-font";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { DefaultTheme, PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ErrorFallback from "../src/common/components/error/ErrorFallback";
import CustomQueryClientProvider from "../src/common/hooks/queries/customQueryClientProvider";
import AuthEventListener from "./../src/domain/auth/events/authEventListener";
import { GlobalAlertModal } from "@/common/components/modal/GlobalAlertModal";
import UpdateModalsManager from "@/common/components/UpdateModalsManager";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/common/components/toast/ToastConfig";
import * as Notifications from "expo-notifications";
import { useAuthStore } from "@/domain/auth/stores/useAuthStore";

SplashScreen.preventAutoHideAsync().catch(() => {});

// Expo Router 공식 방법: 알림 처리 hook
function useNotificationObserver() {
  console.log("🚀 useNotificationObserver hook called!");
  const { isAuthenticated, isLoading } = useAuthStore();
  const pendingNotificationRef = useRef<Notifications.Notification | null>(null);

  useEffect(() => {
    console.log("🚀 useNotificationObserver useEffect running!");
    let isMounted = true;

    function redirect(notification: Notifications.Notification) {
      if (!isMounted) return;

      const data = notification.request.content.data;

      console.log("========================================");
      console.log("📱 Notification observer - redirect called");
      console.log("Full data:", JSON.stringify(data, null, 2));
      console.log("roomId:", data?.roomId);
      console.log("prayerTitleId:", data?.prayerTitleId);
      console.log("prayerTitle:", data?.prayerTitle);
      console.log("========================================");

      if (data && data.roomId && data.prayerTitleId) {
        // 기도방 -> 기도 제목 순서로 이동
        const roomId = data.roomId as string;
        const prayerTitleId = data.prayerTitleId as string;
        const prayerTitle = data.prayerTitle as string | undefined;

        console.log(`✅ Both IDs present - Navigating to room ${roomId} then prayer title ${prayerTitleId}`);
        console.log(`Step 1: Navigating to /rooms/${roomId}`);

        router.push(`/rooms/${roomId}`);

        setTimeout(() => {
          // prayerTitle이 있으면 URL에 포함
          const titleParam = prayerTitle ? `&title=${encodeURIComponent(prayerTitle)}` : '';
          console.log(`Step 2: Navigating to /prayers/${prayerTitleId}?roomId=${roomId}${titleParam}`);
          router.push(`/prayers/${prayerTitleId}?roomId=${roomId}${titleParam}`);
        }, 300);
      } else if (data && data.prayerTitleId) {
        // prayerTitleId만 있는 경우
        const prayerTitleId = data.prayerTitleId as string;
        const prayerTitle = data.prayerTitle as string | undefined;
        const titleParam = prayerTitle ? `?title=${encodeURIComponent(prayerTitle)}` : '';
        console.log(`⚠️ Only prayerTitleId present - Navigating directly to /prayers/${prayerTitleId}${titleParam}`);
        router.push(`/prayers/${prayerTitleId}${titleParam}`);
      } else {
        console.log("❌ No valid navigation data found");
      }
    }

    // 초기 알림 처리 (앱이 종료 상태에서 알림으로 열린 경우)
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response?.notification) {
        console.log("🔔 Initial notification detected - storing for later");
        pendingNotificationRef.current = response.notification;
      }
    });

    // 런타임 알림 처리 (앱이 실행 중일 때 알림 탭)
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("🔔 Runtime notification tapped");

      // 인증 확인 후 처리
      if (isAuthenticated && !isLoading) {
        redirect(response.notification);
      } else {
        console.log("⏳ Auth not ready - storing notification for later");
        pendingNotificationRef.current = response.notification;
      }
    });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, [isAuthenticated, isLoading]);

  // 인증 완료 후 대기 중인 알림 처리
  useEffect(() => {
    if (isAuthenticated && !isLoading && pendingNotificationRef.current) {
      console.log("✅ Auth ready - processing pending notification");
      const notification = pendingNotificationRef.current;
      pendingNotificationRef.current = null;

      const data = notification.request.content.data;

      if (data && data.roomId && data.prayerTitleId) {
        const roomId = data.roomId as string;
        const prayerTitleId = data.prayerTitleId as string;
        const prayerTitle = data.prayerTitle as string | undefined;

        console.log(`✅ Both IDs present - Navigating to room ${roomId} then prayer title ${prayerTitleId}`);
        router.push(`/rooms/${roomId}`);

        setTimeout(() => {
          const titleParam = prayerTitle ? `&title=${encodeURIComponent(prayerTitle)}` : '';
          router.push(`/prayers/${prayerTitleId}?roomId=${roomId}${titleParam}`);
        }, 300);
      } else if (data && data.prayerTitleId) {
        const prayerTitleId = data.prayerTitleId as string;
        const prayerTitle = data.prayerTitle as string | undefined;
        const titleParam = prayerTitle ? `?title=${encodeURIComponent(prayerTitle)}` : '';
        console.log(`⚠️ Only prayerTitleId present - Navigating directly to /prayers/${prayerTitleId}${titleParam}`);
        router.push(`/prayers/${prayerTitleId}${titleParam}`);
      } else {
        console.log("❌ No valid navigation data found");
      }
    }
  }, [isAuthenticated, isLoading]);
}

export default function RootLayout() {
  // 알림 처리 hook 호출
  useNotificationObserver();
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
      </SafeAreaProvider>
      <Toast config={toastConfig} />
    </>
  );
}