// src/screens/invitations/_components/InvitationAppBar.tsx (경로는 예시입니다)
import React from "react";
import { Appbar } from "react-native-paper";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { backgroundColor, color } from "@/common/styles/color";
import { RFValue } from "react-native-responsive-fontsize";

interface InvitationAppBarProps {}

export default function InvitationAppBar({}: InvitationAppBarProps): React.ReactElement {
  const router = useRouter();

  return (
    <Appbar.Header style={styles.header}>
      <Appbar.BackAction
        size={RFValue(24)}
        color={color.white}
        onPress={() => router.navigate("/(protected)/(tabs)/my-page" as any)}
      />
      <Appbar.Content
        mode="medium"
        titleStyle={styles.content}
        color={color.white}
        title="기도방 초대 목록"
      />
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  header: {
    height: RFValue(36),
    backgroundColor: color.third,
  },
  backAction: {},
  content: {
    fontWeight: "bold",
    lineHeight: RFValue(24),
  },
});
