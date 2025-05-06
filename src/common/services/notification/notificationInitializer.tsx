import React, { useEffect } from "react";
import { Alert } from "react-native";
import { isFirstLaunch, setLaunched } from "./notificationUtils";
import PushNotificationService from "./pushNotificationService";

const NotificationInitializer: React.FC = () => {
  useEffect(() => {
    const initializePushNotifications = async () => {
      try {
        // FCM 서비스 인스턴스 획득
        const pushService = PushNotificationService.getInstance();

        const firstLaunch = await isFirstLaunch();
        if (firstLaunch) {
          await setLaunched();

          // 사용자에게 알림 권한 허용 여부 묻기
          Alert.alert(
            "알림 허용",
            "공동체의 기도 완료 알림을 받으시겠습니까?",
            [
              {
                text: "나중에",
                style: "cancel",
                onPress: () => console.log("Permission denied"),
              },
              {
                text: "네",
                onPress: async () => {
                  const granted = await pushService.requestPermission();
                  if (granted) {
                    console.log("Notification permission granted");
                  }
                },
              },
            ],
            { cancelable: false }
          );
        }

        // 알림 리스너 설정 (항상 필요)
        const unsubscribe = pushService.setupNotificationListeners();

        return () => {
          // 컴포넌트 언마운트 시 클린업
          unsubscribe();
        };
      } catch (error) {
        console.error("Error initializing push notifications:", error);
      }
    };

    initializePushNotifications();
  }, [isFirstLaunch, setLaunched]);

  return null;
};

export default NotificationInitializer;
