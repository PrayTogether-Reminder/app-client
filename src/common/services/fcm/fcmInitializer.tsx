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
          // 일반적인 로그인 시 토큰 전송
          console.log("Checking FCM token and sending to server");

          const hasPermission = await fcmManager.hasPermission();
          if (hasPermission) {
            const storedToken = await fcmManager.getFCMTokenByStorage();
            const currentToken = await fcmManager.getFCMTokenByFB();

            if (currentToken && currentToken !== storedToken) {
              // 토큰이 변경된 경우에만 서버에 전송
              console.log("FCM token changed - sending to server:", currentToken.substring(0, 20) + "...");
              await fcmManager.saveFCMToken(currentToken);
              registerFcmTokenRequest({ fcmToken: currentToken });
              console.log("FCM Token sent to server");
            } else {
              console.log("FCM token unchanged - skipping server registration");
            }
          }
        }

        // 4. 알림 메시지 리스너 설정
        const unsubscribeNotifications = fcmManager.setupNotificationListeners();

        // 5. 토큰 갱신 리스너 설정
        const unsubscribeTokenRefresh = fcmManager.setupTokenRefreshListener(
          async (newToken) => {
            console.log("토큰 갱신 콜백 실행");
            // 로컬 저장소에 새 토큰 저장
            await fcmManager.saveFCMToken(newToken);
            // 서버에 새 토큰 등록
            registerFcmTokenRequest({ fcmToken: newToken });
            console.log("새 토큰이 저장소와 서버에 업데이트되었습니다");
          }
        );

        // 6. 두 리스너를 모두 정리하는 cleanup 함수 반환
        return () => {
          unsubscribeNotifications();
          unsubscribeTokenRefresh();
        };
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
