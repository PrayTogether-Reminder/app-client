import React, { useEffect, useState } from "react";
import { isFirstLaunch, setLaunched } from "./fcmUtils";
import FcmManager from "./fcmManager";
import { useRegisterFcmTokenMutation } from "@/domain/fcmToken/hooks/useFcmTokenMutation";
import * as Notifications from "expo-notifications";
import ConfirmationModal from "@/common/components/modal/ConfirmationModal";

const FcmInitializer: React.FC = () => {
  const { mutate: registerFcmTokenRequest } = useRegisterFcmTokenMutation();

  // ConfirmationModal 상태 관리
  const [showPermissionModal, setShowPermissionModal] = useState(false);

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

          // ConfirmationModal 표시
          setShowPermissionModal(true);
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

  // 알림 권한 허용 처리
  const handlePermissionConfirm = async () => {
    try {
      const fcmManager = FcmManager.getInstance();
      const granted = await fcmManager.hasPermission();

      if (granted) {
        const token = (await fcmManager.getFCMTokenByFB()) ?? "";
        await fcmManager.saveFCMToken(token);
        registerFcmTokenRequest({ fcmToken: token });
        console.log("Get FCM Token:", token);
      }
    } catch (error) {
      console.error("Error handling permission:", error);
    }

    setShowPermissionModal(false);
  };

  // 알림 권한 거부 처리
  const handlePermissionDismiss = () => {
    console.log("Permission denied");
    setShowPermissionModal(false);
  };

  return (
    <ConfirmationModal
      visible={showPermissionModal}
      onConfirm={handlePermissionConfirm}
      onDismiss={handlePermissionDismiss}
      icon="bell-ring"
      title="알림 허용"
      content="공동체의 기도 완료 알림을 받으시겠습니까?"
      confirmText="네"
      cancelText="나중에"
    />
  );
};

export default FcmInitializer;
