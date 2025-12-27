import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Linking, Platform, AppState } from "react-native";
import { useRouter } from "expo-router";
import { backgroundColor } from "@/common/styles/color";

import Top4Body10 from "@/common/components/layout/Top4Body10";
import ProfileSection from "../../my-page/index/_components/ProfileSection";
import ListSection from "../../my-page/index/_components/ListSection";
import path from "@/common/constants/path";
import { useLogoutMutation, useDeleteAccountMutation } from "@/domain/auth/hooks/mutations/useAuthMutation";
import { useAuthStore } from "@/domain/auth/stores/useAuthStore";
import FcmManager from "@/common/services/fcm/fcmManager";
import { checkNotificationPermission } from "@/common/services/fcm/fcmUtils";
import { useRegisterFcmTokenMutation } from "@/domain/fcmToken/hooks/useFcmTokenMutation";
import { useDeleteFcmTokenMutation } from "@/domain/fcmToken/hooks/useDeleteFcmTokenMutation";
import ConfirmationModal from "@/common/components/modal/ConfirmationModal";
import { showAlert } from "@/common/components/modal/stores/useAlertStore";

type MyPageScreenProps = {};

export default function MyPageScreen(props: MyPageScreenProps) {
  const router = useRouter();
  const { mutate: logoutRequest } = useLogoutMutation();
  const { mutate: deleteAccountRequest } = useDeleteAccountMutation();
  const getRefreshToken = useAuthStore((state) => state.getRefreshToken);
  const setLogoutState = useAuthStore((state) => state.logout);
  const fcmManager = FcmManager.getInstance();
  const prevPermissionStatus = useRef<boolean | null>(null);
  const { mutate: registerFcmTokenRequest } = useRegisterFcmTokenMutation();
  const { mutate: deleteFcmTokenRequest } = useDeleteFcmTokenMutation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
        } else {
          // 알림 권한이 비활성화된 경우 서버와 로컬에서 FCM 토큰 삭제
          console.log("알림 권한 비활성화 - FCM 토큰 삭제 시작");
          const oldToken = await fcmManager.getFCMTokenByStorage();
          if (oldToken) {
            // 서버에서 토큰 삭제
            deleteFcmTokenRequest(oldToken, {
              onSuccess: async () => {
                console.log("서버에서 FCM 토큰 삭제 완료");
                // 로컬에서도 토큰 삭제
                await fcmManager.deleteFCMToken();
              },
              onError: async (error) => {
                console.error("서버에서 FCM 토큰 삭제 실패:", error);
                // 서버 삭제 실패해도 로컬 토큰은 삭제
                await fcmManager.deleteFCMToken();
              },
            });
          }
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

  // function handleGoToFriends() {
  //   console.log("친구 관리 화면으로 이동");
  //   router.push(path.showFriends());
  // }

  function handleChangePassword() {
    console.log("비밀번호 변경 화면으로 이동");
    router.push(path.showChangePassword());
  }

  async function handleGoToNotifications() {
    console.log("알림 설정 처리 시작");

    // 현재 권한 상태 확인
    const currentStatus = await checkNotificationPermission();
    console.log("현재 알림 권한 상태:", currentStatus);

    if (!currentStatus) {
      // 권한이 없으면 먼저 권한 요청 시도
      console.log("알림 권한 요청 시작");
      const granted = await fcmManager.requestPermission();
      console.log("알림 권한 요청 결과:", granted);
      
      if (granted) {
        // 권한이 허용되면 FCM 토큰 처리
        console.log("알림 권한 허용됨 - FCM 토큰 처리");
        const token = (await fcmManager.getFCMTokenByFB()) ?? "";
        await fcmManager.saveFCMToken(token);
        registerFcmTokenRequest({ fcmToken: token });
        prevPermissionStatus.current = granted;
      } else {
        // 권한이 거부되었거나 이미 요청했던 경우 설정으로 이동
        console.log("알림 권한 거부됨 또는 이미 요청됨 - 시스템 설정으로 이동");
        await openSystemSettings();
      }
    } else {
      // 이미 권한이 있으면 설정으로 이동
      console.log("이미 알림 권한이 있음 - 시스템 설정으로 이동");
      await openSystemSettings();
    }
  }

  // 시스템 설정 열기 함수
  async function openSystemSettings() {
    try {
      console.log("시스템 설정으로 이동");
      await Linking.openSettings();
    } catch (error) {
      console.error("설정 페이지 열기 실패:", error);
      
      // iOS에서만 대체 URL scheme 시도
      if (Platform.OS === "ios") {
        try {
          console.log("대안 URL scheme 시도");
          const canOpenAppSettings = await Linking.canOpenURL("app-settings:");
          if (canOpenAppSettings) {
            await Linking.openURL("app-settings:");
          } else {
            console.log("모든 설정 열기 방법 실패");
          }
        } catch (fallbackError) {
          console.error("대안 URL scheme도 실패:", fallbackError);
        }
      }
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
            onSuccess: async () => {
              console.log("FCM 토큰 삭제 완료");
              // 로컬에서도 토큰 삭제
              await fcmManager.deleteFCMToken();
              resolve();
            },
            onError: async (error) => {
              console.error("FCM 토큰 삭제 실패:", error);
              // 서버 삭제 실패해도 로컬 토큰은 삭제
              await fcmManager.deleteFCMToken();
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

  function handleDeleteAccount() {
    setShowDeleteModal(true);
  }

  async function confirmDeleteAccount() {
    try {
      // FCM 토큰 가져오기
      const fcmToken = await fcmManager.getFCMTokenByStorage();
      
      // FCM 토큰이 있으면 서버에서 삭제
      if (fcmToken) {
        await new Promise<void>((resolve) => {
          deleteFcmTokenRequest(fcmToken, {
            onSuccess: async () => {
              await fcmManager.deleteFCMToken();
              resolve();
            },
            onError: async () => {
              await fcmManager.deleteFCMToken();
              resolve();
            },
          });
        });
      }
      
      // 회원 탈퇴 요청
      deleteAccountRequest(undefined, {
        onSuccess: () => {
          setLogoutState();
          setShowDeleteModal(false);
          showAlert({
            title: "탈퇴 완료",
            message: "계정이 성공적으로 삭제되었습니다.",
            icon: "check-circle",
            onConfirm: () => router.replace(path.showWelcome())
          });
        },
      });
    } catch (error) {
      console.error("회원 탈퇴 중 오류 발생:", error);
    }
  }

  return (
    <View style={styles.container}>
      <Top4Body10
        tops={[<ProfileSection />]}
        bodies={[
          <ListSection
            onGoToInvitations={handleGoToInvitations}
            // onGoToFriends={handleGoToFriends}
            onGoToNotifications={handleGoToNotifications}
            onChangePassword={handleChangePassword}
            onLogout={handleLogout}
            onDeleteAccount={handleDeleteAccount}
          />,
        ]}
      />
      <ConfirmationModal
        visible={showDeleteModal}
        onDismiss={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteAccount}
        icon="account-remove"
        title="회원 탈퇴"
        content={"정말로 계정을 삭제하시겠습니까?\n모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다."}
        confirmText="탈퇴"
        cancelText="취소"
        iconColor="#FF4444"
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
