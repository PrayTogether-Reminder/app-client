import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { getApp } from "@react-native-firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification,
  subscribeToTopic,
  unsubscribeFromTopic,
} from "@react-native-firebase/messaging";
import API_BASE_URL from "@/common/apis/apiUrl";
import {
  checkNotificationPermission,
  requestNotificationPermission,
} from "./fcmUtils";

const FCM_TOKEN_KEY = "fcm_token";

class PushNotificationService {
  private static instance: PushNotificationService;

  private constructor() {}

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  // 유틸리티 함수를 재사용하여 코드 중복 방지
  async hasPermission(): Promise<boolean> {
    console.log("알림 권한 확인");
    return await checkNotificationPermission();
  }

  async requestPermission(): Promise<boolean> {
    console.log("알림 권한 요청");
    const enabled = await requestNotificationPermission();
    if (enabled) {
      // 권한 획득 시 토큰 저장
      await this.saveFCMToken();
    }
    return enabled;
  }

  async getFCMToken(): Promise<string | null> {
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

  async saveFCMToken(): Promise<boolean> {
    console.log("FCM 토큰 저장");
    try {
      const token = await this.getFCMToken();
      if (token) {
        await SecureStore.setItemAsync(FCM_TOKEN_KEY, token);
        // 서버에 토큰 등록
        await this.registerTokenWithServer(token);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error saving FCM token:", error);
      return false;
    }
  }

  async loadFCMToken(): Promise<string | null> {
    console.log("FCM 토큰 가져오기 By SecureStore");
    try {
      return await SecureStore.getItemAsync(FCM_TOKEN_KEY);
    } catch (error) {
      console.error("Error loading FCM token:", error);
      return null;
    }
  }

  // FCM 토큰 서버 등록
  async registerTokenWithServer(token: string): Promise<boolean> {
    console.log("FCM 토큰 등록 To API Server");
    try {
      const response = await fetch(`${API_BASE_URL}/users/fcm-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      return response.ok;
    } catch (error) {
      console.error("Error registering token with server:", error);
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

    // 포그라운드 메시지 핸들러
    const unsubscribeForeground = onMessage(
      messagingInstance,
      async (remoteMessage) => {
        console.log("Foreground Message received:", remoteMessage);
        // 여기서 로컬 알림을 표시하거나 앱 내 알림을 처리할 수 있습니다
      }
    );

    // 백그라운드 클릭 핸들러
    onNotificationOpenedApp(messagingInstance, (remoteMessage) => {
      console.log(
        "Notification caused app to open from background state:",
        remoteMessage
      );
      // 알림으로 앱이 열렸을 때의 처리 (예: 특정 화면으로 이동)
    });

    // 종료 상태에서 열림 체크
    getInitialNotification(messagingInstance).then((remoteMessage) => {
      if (remoteMessage) {
        console.log(
          "Notification caused app to open from quit state:",
          remoteMessage
        );
        // 알림으로 앱이 열렸을 때의 처리
      }
    });

    return unsubscribeForeground;
  }
}

export default PushNotificationService;
