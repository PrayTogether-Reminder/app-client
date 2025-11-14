import { getApp } from "@react-native-firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  subscribeToTopic,
  unsubscribeFromTopic,
  requestPermission,
  AuthorizationStatus,
} from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import { checkNotificationPermission } from "./fcmUtils";

const FCM_TOKEN_KEY = "fcm_token";

class FcmManager {
  private static instance: FcmManager;

  private constructor() {}

  static getInstance(): FcmManager {
    if (!FcmManager.instance) {
      FcmManager.instance = new FcmManager();
    }
    return FcmManager.instance;
  }

  async requestPermission(): Promise<boolean> {
    console.log("알림 권한 요청");
    try {
      // 1. Expo 권한 요청 (시스템 레벨 권한 - 사용자에게 다이얼로그 표시)
      console.log("Requesting Expo notification permissions...");
      const { status: expoStatus } =
        await Notifications.requestPermissionsAsync();

      console.log("Expo permission result:", expoStatus);

      if (expoStatus === "granted") {
        // 2. Expo 권한 허용된 경우에만 Firebase 권한 처리
        console.log("Expo permission granted - proceeding with Firebase...");

        const app = getApp();
        const messaging = getMessaging(app);
        const authStatus = await requestPermission(messaging);

        const firebaseGranted =
          authStatus === AuthorizationStatus.AUTHORIZED ||
          authStatus === AuthorizationStatus.PROVISIONAL;

        console.log(
          "Firebase permission status:",
          authStatus,
          "Granted:",
          firebaseGranted
        );
        return firebaseGranted;
      } else {
        // 3. Expo 권한 거부된 경우 Firebase도 처리하지 않음
        console.log("Expo permission denied - skipping Firebase");
        return false;
      }
    } catch (error) {
      console.error("Error requesting permission:", error);
      return false;
    }
  }

  // 유틸리티 함수를 재사용하여 코드 중복 방지
  async hasPermission(): Promise<boolean> {
    console.log("알림 권한 확인");
    return await checkNotificationPermission();
  }

  async getFCMTokenByFB(): Promise<string | null> {
    console.log("FCM 토큰 요청 By Firebase");
    try {
      const app = getApp();
      const messaging = getMessaging(app);
      return await getToken(messaging);
    } catch (error) {
      console.error("Error getting FCM token:", error);
      return null;
    }
  }

  async saveFCMToken(token: string | null): Promise<boolean> {
    console.log("FCM 토큰 저장");
    try {
      if (token) {
        await SecureStore.setItemAsync(FCM_TOKEN_KEY, token);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error saving FCM token:", error);
      return false;
    }
  }

  async getFCMTokenByStorage(): Promise<string | null> {
    console.log("FCM 토큰 가져오기 By SecureStore");
    try {
      return await SecureStore.getItemAsync(FCM_TOKEN_KEY);
    } catch (error) {
      console.error("Error loading FCM token:", error);
      return null;
    }
  }

  async deleteFCMToken(): Promise<boolean> {
    console.log("FCM 토큰 삭제 By SecureStore");
    try {
      await SecureStore.deleteItemAsync(FCM_TOKEN_KEY);
      return true;
    } catch (error) {
      console.error("Error deleting FCM token:", error);
      return false;
    }
  }

  // 추후 사용을 위해 남겨둡니다
  async subscribeTopic(topic: string): Promise<boolean> {
    try {
      const app = getApp();
      const messaging = getMessaging(app);
      await subscribeToTopic(messaging, topic);
      return true;
    } catch (error) {
      console.error(`Error subscribing to topic ${topic}:`, error);
      return false;
    }
  }

  // 추후 사용을 위해 남겨둡니다
  async unsubscribeFromTopic(topic: string): Promise<boolean> {
    try {
      const app = getApp();
      const messaging = getMessaging(app);
      await unsubscribeFromTopic(messaging, topic);
      return true;
    } catch (error) {
      console.error(`Error unsubscribing from topic ${topic}:`, error);
      return false;
    }
  }

  setupNotificationListeners() {
    const app = getApp();
    const messagingInstance = getMessaging(app);

    // 포그라운드 메시지 핸들러 - FCM 메시지를 expo-notifications로 전달
    const unsubscribeForeground = onMessage(
      messagingInstance,
      async (remoteMessage) => {
        console.log("========================================");
        console.log("📬 FCM Foreground message received");
        console.log("Data:", JSON.stringify(remoteMessage.data, null, 2));
        console.log("========================================");

        // FCM 메시지를 expo-notifications로 전달
        // 백엔드에서 Title, Body를 대문자로 보냄
        await Notifications.scheduleNotificationAsync({
          content: {
            title: (remoteMessage.data?.Title as string) || "새 알림",
            body: (remoteMessage.data?.Body as string) || "메시지 오류",
            data: remoteMessage.data || {},
          },
          trigger: null, // null = 즉시 표시
        });
      }
    );

    // cleanup 함수 반환
    return unsubscribeForeground;
  }

  setupTokenRefreshListener(
    onTokenRefreshed: (token: string) => void | Promise<void>
  ): () => void {
    console.log("FCM 토큰 갱신 리스너 설정");
    try {
      const app = getApp();
      const messaging = getMessaging(app);

      // Firebase가 토큰을 갱신할 때 호출되는 리스너
      // 앱이 실행 중일 때만 동작 (포그라운드/백그라운드)
      const unsubscribe = messaging.onTokenRefresh(async () => {
        console.log("========================================");
        console.log("🔄 FCM 토큰이 자동 갱신되었습니다");
        console.log("========================================");

        try {
          // 새로 생성된 토큰 가져오기
          const newToken = await getToken(messaging);
          if (newToken) {
            console.log("새 토큰:", newToken.substring(0, 20) + "...");
            await onTokenRefreshed(newToken);
          } else {
            console.error("토큰 갱신 후 새 토큰을 가져오지 못했습니다");
          }
        } catch (error) {
          console.error("토큰 갱신 처리 중 오류:", error);
        }
      });

      return unsubscribe;
    } catch (error) {
      console.error("토큰 갱신 리스너 설정 실패:", error);
      // 에러가 발생해도 빈 cleanup 함수 반환
      return () => {};
    }
  }
}

export default FcmManager;
