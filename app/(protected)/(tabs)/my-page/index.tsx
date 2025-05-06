import React from "react";
import { StyleSheet, View, Linking, Platform } from "react-native";
import { useRouter } from "expo-router";
import { backgroundColor } from "@/common/styles/color";

import Top4Body10 from "@/common/layout/Top4Body10";
import ProfileSection from "../../my-page/index/_components/ProfileSection";
import ListSection from "../../my-page/index/_components/ListSection";
import path from "@/common/constants/path";
import { useLogoutMutation } from "@/domain/auth/hooks/mutations/useAuthMutation";
import { useAuthStore } from "@/domain/auth/stores/useAuthStore";

type MyPageScreenProps = {};

export default function MyPageScreen(props: MyPageScreenProps) {
  const router = useRouter();
  const { mutate: logoutRequest } = useLogoutMutation();
  const { getRefreshToken, logout: setLogoutState } = useAuthStore();

  function handleGoToInvitations() {
    console.log("초대 목록 화면으로 이동");
    router.push(path.showInvitations());
  }

  // 알림 설정 함수 수정 - 바로 OS 설정으로 이동
  function handleGoToNotifications() {
    console.log("시스템 알림 설정으로 직접 이동");
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
