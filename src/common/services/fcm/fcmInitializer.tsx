import React, { useEffect } from "react";
import { isFirstLaunch, setLaunched, checkAppVersionChanged } from "./fcmUtils";
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

        // 첫 실행 확인
        const firstLaunch = await isFirstLaunch();
        
        // 앱 버전 변경 확인 (업데이트/재설치)
        const versionChanged = await checkAppVersionChanged();
        
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
        } else if (versionChanged) {
          // 앱이 업데이트되었거나 재설치된 경우
          console.log("App version changed - re-registering FCM token");
          
          const hasPermission = await fcmManager.hasPermission();
          if (hasPermission) {
            const token = await fcmManager.getFCMTokenByFB();
            if (token) {
              await fcmManager.saveFCMToken(token);
              registerFcmTokenRequest({ fcmToken: token });
              console.log("FCM Token re-registered after version change:", token);
            }
          }
        } else {
          // 일반적인 로그인 시 토큰 체크
          console.log("Checking FCM token consistency");
          
          const hasPermission = await fcmManager.hasPermission();
          if (hasPermission) {
            const savedToken = await fcmManager.getFCMTokenByStorage();
            const currentToken = await fcmManager.getFCMTokenByFB();
            
            console.log("Saved token:", savedToken?.substring(0, 20) + "...");
            console.log("Current token:", currentToken?.substring(0, 20) + "...");
            
            // 토큰이 다르거나 저장된 토큰이 없는 경우
            if (currentToken && (!savedToken || savedToken !== currentToken)) {
              console.log("Token mismatch detected - updating token");
              await fcmManager.saveFCMToken(currentToken);
              registerFcmTokenRequest({ fcmToken: currentToken });
              console.log("FCM Token updated:", currentToken);
            }
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
