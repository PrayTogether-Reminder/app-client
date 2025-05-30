import React, { useEffect } from "react";
import { isFirstLaunch, setLaunched } from "./fcmUtils";
import FcmManager from "./fcmManager";
import { useRegisterFcmTokenMutation } from "@/domain/fcmToken/hooks/useFcmTokenMutation";
import * as Notifications from "expo-notifications";

const FcmInitializer: React.FC = () => {
  const { mutate: registerFcmTokenRequest } = useRegisterFcmTokenMutation();

  useEffect(() => {
    // 1. 알림 핸들러 설정 (동기적으로 실행)
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    // 2. cleanup 함수를 저장할 변수
    let cleanupFunction: (() => void) | undefined;

    // 3. 비동기 초기화 함수
    const initializePushNotifications = async () => {
      try {
        const fcmManager = FcmManager.getInstance();

        const firstLaunch = await isFirstLaunch();
        if (firstLaunch) {
          await setLaunched();

          console.log("First launch - requesting permissions directly");
          const granted = await fcmManager.requestPermission();

          if (granted) {
            const token = await fcmManager.getFCMTokenByFB();
            if (token) {
              await fcmManager.saveFCMToken(token);
              registerFcmTokenRequest({ fcmToken: token });
              console.log("FCM Token registered:", token);
            }
          } else {
            console.log("Permission denied - no FCM token generated");
          }
        }

        // 4. 리스너 설정하고 cleanup 함수 받기
        const unsubscribe = fcmManager.setupNotificationListeners();
        return unsubscribe;
      } catch (error) {
        console.error("Error initializing push notifications:", error);
        return undefined;
      }
    };

    // 5. 비동기 함수 실행하고 결과(cleanup 함수) 저장
    initializePushNotifications().then((unsubscribe) => {
      cleanupFunction = unsubscribe;
    });

    // 6. useEffect가 반환하는 cleanup 함수
    return () => {
      // 컴포넌트 언마운트 시 실행됨
      if (cleanupFunction) {
        cleanupFunction();
      }
    };
  }, []); // 빈 배열 = 컴포넌트 마운트 시 한 번만 실행

  // 더 이상 모달을 렌더링하지 않음
  return null;
};

export default FcmInitializer;
