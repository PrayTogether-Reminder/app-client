import messaging from "@react-native-firebase/messaging";
import { Platform } from "react-native";

class PushNotificationService {
  private static instance: PushNotificationService;

  private constructor() {}

  public static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  async requestPermission(): Promise<boolean> {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("FCM Authorization status:", authStatus);
    }

    return enabled;
  }

  async getFCMToken(): Promise<string | null> {
    try {
      // iOS에서는 APNs 토큰을 먼저 등록해야 함
      if (Platform.OS === "ios") {
        const apnsToken = await messaging().getAPNSToken();
        if (!apnsToken) {
          console.log("Failed to get APNs token");
          return null;
        }
      }

      const token = await messaging().getToken();
      console.log("FCM Token:", token);
      return token;
    } catch (error) {
      console.error("Error getting FCM token:", error);
      return null;
    }
  }

  setupNotificationListeners() {
    // Foreground 메시지 수신
    const unsubscribeOnMessage = messaging().onMessage(
      async (remoteMessage) => {
        console.log(
          "Foreground message received:",
          JSON.stringify(remoteMessage)
        );

        alert(
          `${remoteMessage.notification?.title}\n${remoteMessage.notification?.body}`
        );
      }
    );

    // Background에서 앱이 열렸을 때
    const unsubscribeOnNotificationOpenedApp =
      messaging().onNotificationOpenedApp((remoteMessage) => {
        console.log(
          "Notification caused app to open from background:",
          JSON.stringify(remoteMessage)
        );
        this.handleNotificationOpen(remoteMessage);
      });

    // 앱이 종료된 상태에서 열렸을 때
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state:",
            JSON.stringify(remoteMessage)
          );
          this.handleNotificationOpen(remoteMessage);
        }
      });

    // cleanup 함수 반환
    return () => {
      unsubscribeOnMessage();
      unsubscribeOnNotificationOpenedApp();
    };
  }

  private handleNotificationOpen(remoteMessage: any) {
    // 알림을 탭했을 때의 처리
    console.log("Notification opened:", remoteMessage);

    // 여기서 navigation 처리 등을 할 수 있습니다
    if (remoteMessage.data?.screen) {
      console.log("Navigate to screen:", remoteMessage.data.screen);
      // navigation.navigate(remoteMessage.data.screen);
    }
  }

  async subscribeTopic(topic: string) {
    try {
      await messaging().subscribeToTopic(topic);
      console.log(`Subscribed to topic: ${topic}`);
    } catch (error) {
      console.error("Error subscribing to topic:", error);
    }
  }

  async unsubscribeFromTopic(topic: string) {
    try {
      await messaging().unsubscribeFromTopic(topic);
      console.log(`Unsubscribed from topic: ${topic}`);
    } catch (error) {
      console.error("Error unsubscribing from topic:", error);
    }
  }

  // Background 메시지 핸들러 설정 (index.js에서 호출)
  static setBackgroundMessageHandler() {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log(
        "Background message received:",
        JSON.stringify(remoteMessage)
      );
      // 여기서는 UI 업데이트를 할 수 없으므로 데이터 처리만 가능
    });
  }
}

export default PushNotificationService;
