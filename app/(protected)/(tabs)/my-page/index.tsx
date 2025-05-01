import React from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { backgroundColor } from "@/common/styles/color";

import Top4Body10 from "@/common/layout/Top4Body10"; // Adjust path as needed
import ProfileSection from "../../my-page/index/_components/ProfileSection";
import ListSection from "../../my-page/index/_components/ListSection";
import path from "@/common/constants/path";

type MyPageScreenProps = {};

export default function MyPageScreen(props: MyPageScreenProps) {
  const router = useRouter();

  function handleGoToInvitations() {
    console.log("초대 목록 화면으로 이동");
    router.push(path.showInvitations()); // 초대 목록 화면 경로 (예시)
  }

  function handleLogout() {
    console.log("로그아웃 처리");
    // 로그아웃 로직 후 로그인 화면 등으로 이동
    // router.replace('/login'); // 예시: 스택에서 현재 화면 제거하고 이동
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
