import React from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { backgroundColor } from "@/common/styles/color";

import Top4Body10 from "@/common/layout/Top4Body10"; // Adjust path as needed
import ProfileSection from "../../my-page/index/_components/ProfileSection";
import ListSection from "../../my-page/index/_components/ListSection";
import path from "@/common/constants/path";
import { useLogoutMutation } from "@/domain/auth/hooks/mutations/useAuthMutation";
import { useAuthStore } from "@/domain/auth/stores/authStore";

type MyPageScreenProps = {};

export default function MyPageScreen(props: MyPageScreenProps) {
  const router = useRouter();
  const { mutate: logoutRequest } = useLogoutMutation();
  const { getRefreshToken, logout: setLogoutState } = useAuthStore();
  function handleGoToInvitations() {
    console.log("초대 목록 화면으로 이동");
    router.push(path.showInvitations());
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
