import React, { useEffect } from "react";
import { Alert } from "react-native";
import { isFirstLaunch, setLaunched } from "./fcmUtils";
import FcmManager from "./fcmManager";
import { useRegisterFcmTokenMutation } from "@/domain/notifications/hooks/useNotificationMutation";

const FcmInitializer: React.FC = () => {
  const { mutate: registerFcmTokenRequest } = useRegisterFcmTokenMutation();
  useEffect(() => {
    const initializePushNotifications = async () => {
      try {
        // FCM 서비스 인스턴스 획득
        const fcmManager = FcmManager.getInstance();

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
                  const granted = await fcmManager.hasPermission();
                  if (granted) {
                    const token = (await fcmManager.getFCMTokenByFB()) ?? "";
                    await fcmManager.saveFCMToken(token);
                    registerFcmTokenRequest({ fcmToken: token });
                    console.log("Get FCM Token:", token);
                  }
                },
              },
            ],
            { cancelable: false }
          );
        }

        // 알림 리스너 설정 (항상 필요)
        const unsubscribe = fcmManager.setupNotificationListeners();

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

export default FcmInitializer;
