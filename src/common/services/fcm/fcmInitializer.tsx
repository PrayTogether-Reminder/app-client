import React, { useEffect } from "react";
import { isFirstLaunch, setLaunched } from "./fcmUtils";
import FcmManager from "./fcmManager";
import { useRegisterFcmTokenMutation } from "@/domain/fcmToken/hooks/useFcmTokenMutation";
import * as Notifications from "expo-notifications";

const FcmInitializer: React.FC = () => {
  const { mutate: registerFcmTokenRequest } = useRegisterFcmTokenMutation();

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true, // 포그라운드에서도 알림 표시
        shouldPlaySound: true, // 소리 재생
        shouldSetBadge: true, // 앱 아이콘에 배지 표시
        shouldShowBanner: true, // iOS 16+ 배너 표시 여부
        shouldShowList: true, // 알림 목록에 표시 여부
      }),
    });

    const initializePushNotifications = async () => {
      try {
        // FCM 서비스 인스턴스 획득
        const fcmManager = FcmManager.getInstance();

        const firstLaunch = await isFirstLaunch();
        if (firstLaunch) {
          await setLaunched();

          // 바로 시스템 권한 요청 (사용자 모달 없음)
          console.log("First launch - requesting permissions directly");
          const granted = await fcmManager.requestPermission();

          if (granted) {
            // Expo 권한 허용 → FCM 토큰 발급 및 서버 등록
            const token = (await fcmManager.getFCMTokenByFB()) ?? "";
            if (token) {
              await fcmManager.saveFCMToken(token);
              registerFcmTokenRequest({ fcmToken: token });
              console.log("FCM Token registered:", token);
            }
          } else {
            // Expo 권한 거부 → FCM 토큰 생성하지 않음
            console.log("Permission denied - no FCM token generated");
          }
        }

        // 알림 리스너 설정 (항상 필요)
        const unsubscribe = fcmManager.setupNotificationListeners();

        return unsubscribe;
      } catch (error) {
        console.error("Error initializing push notifications:", error);
        return () => {};
      }
    };

    // async 함수 실행 및 클린업 설정
    let cleanup: (() => void) | undefined;

    initializePushNotifications().then((unsubscribe) => {
      cleanup = unsubscribe;
    });

    // useEffect 클린업
    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, []); // 의존성 배열 수정

  // 더 이상 모달을 렌더링하지 않음
  return null;
};

export default FcmInitializer;
