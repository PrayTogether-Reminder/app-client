import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Linking, Platform, AppState } from "react-native";
import { useRouter } from "expo-router";
import { backgroundColor } from "@/common/styles/color";

import Top4Body10 from "@/common/layout/Top4Body10";
import ProfileSection from "../../my-page/index/_components/ProfileSection";
import ListSection from "../../my-page/index/_components/ListSection";
import path from "@/common/constants/path";
import { useLogoutMutation } from "@/domain/auth/hooks/mutations/useAuthMutation";
import { useAuthStore } from "@/domain/auth/stores/useAuthStore";
import FcmManager from "@/common/services/fcm/fcmManager";
import { checkNotificationPermission } from "@/common/services/fcm/fcmUtils";
import { useRegisterFcmTokenMutation } from "@/domain/fcmToken/hooks/useFcmTokenMutation";
import { useDeleteFcmTokenMutation } from "@/domain/fcmToken/hooks/useDeleteFcmTokenMutation";

type MyPageScreenProps = {};

export default function MyPageScreen(props: MyPageScreenProps) {
  const router = useRouter();
  const { mutate: logoutRequest } = useLogoutMutation();
  const { getRefreshToken, logout: setLogoutState } = useAuthStore();
  const fcmManager = FcmManager.getInstance();
  const prevPermissionStatus = useRef<boolean | null>(null);
  const { mutate: registerFcmTokenRequest } = useRegisterFcmTokenMutation();
  const { mutate: deleteFcmTokenRequest } = useDeleteFcmTokenMutation();

  // 알림 권한 확인 및 변경 처리 함수
  const checkAndUpdatePermission = async () => {
    try {
      // 현재 권한 상태 확인
      const currentPermissionStatus = await checkNotificationPermission();
      console.log("현재 알림 권한 상태:", currentPermissionStatus);

      // 이전 상태가 있고, 상태가 변경된 경우에만 처리
      if (
        prevPermissionStatus.current !== null &&
        prevPermissionStatus.current !== currentPermissionStatus
      ) {
        console.log(
          "알림 권한 상태 변경됨:",
          prevPermissionStatus.current,
          "->",
          currentPermissionStatus
        );

        // 알림 권한이 활성화된 경우 FCM 토큰 저장 및 등록
        if (currentPermissionStatus) {
          console.log("알림 권한 활성화 - FCM 토큰 처리 시작");
          const token = (await fcmManager.getFCMTokenByFB()) ?? "";
          await fcmManager.saveFCMToken(token);
          registerFcmTokenRequest({ fcmToken: token });
        }
      }

      // 현재 상태를 이전 상태로 업데이트
      prevPermissionStatus.current = currentPermissionStatus;
    } catch (error) {
      console.error("권한 확인 중 오류 발생:", error);
    }
  };

  // 컴포넌트 마운트 시 초기 권한 상태만 저장
  useEffect(() => {
    const initPermissionStatus = async () => {
      try {
        const status = await checkNotificationPermission();
        prevPermissionStatus.current = status;
        console.log("초기 알림 권한 상태:", status);
      } catch (error) {
        console.error("초기 권한 확인 중 오류:", error);
      }
    };

    initPermissionStatus();
  }, []);

  // AppState 리스너 - 앱이 활성화될 때만 권한 변경 확인
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      console.log("앱 상태 변경:", AppState.currentState, "->", nextAppState);

      // 앱이 활성 상태로 전환될 때 권한 확인
      if (nextAppState === "active") {
        console.log("앱이 활성 상태로 돌아옴 - 권한 확인");

        // 약간의 지연 후 권한 확인 (설정 반영 시간 고려)
        setTimeout(() => {
          checkAndUpdatePermission();
        }, 500);
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => subscription.remove();
  }, []);

  function handleGoToInvitations() {
    console.log("초대 목록 화면으로 이동");
    router.push(path.showInvitations());
  }

  async function handleGoToNotifications() {
    console.log("시스템 알림 설정으로 직접 이동");

    // 현재 권한 상태 저장 (설정으로 이동 전 참조 기준점)
    const currentStatus = await checkNotificationPermission();
    prevPermissionStatus.current = currentStatus;
    console.log("설정으로 이동하기 전 알림 권한 상태:", currentStatus);

    // 설정 열기
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      Linking.openSettings();
    }
  }

  async function handleLogout() {
    console.log("로그아웃 처리");
    try {
      const refreshToken = await getRefreshToken();
      
      // FCM 토큰 가져오기
      const fcmToken = await fcmManager.getFCMTokenByStorage();
      
      // FCM 토큰이 있으면 서버에서 삭제 (동기적으로 처리)
      if (fcmToken) {
        await new Promise<void>((resolve, reject) => {
          deleteFcmTokenRequest(fcmToken, {
            onSuccess: () => {
              console.log("FCM 토큰 삭제 완료");
              resolve();
            },
            onError: (error) => {
              console.error("FCM 토큰 삭제 실패:", error);
              // 토큰 삭제 실패해도 로그아웃은 진행
              resolve();
            },
          });
        });
      }
      
      // FCM 토큰 삭제 후 로그아웃 진행
      logoutRequest(
        { refreshToken },
        {
          onSuccess: () => {
            setLogoutState();
            router.replace(path.showWelcome());
          },
        }
      );
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    }
  }

  return (
    <View style={styles.container}>
      <Top4Body10
        tops={[<ProfileSection />]}
        bodies={[
          <ListSection
            onGoToInvitations={handleGoToInvitations}
            onGoToNotifications={handleGoToNotifications}
            onLogout={handleLogout}
          />,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor.default,
  },
});
