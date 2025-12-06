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
        style={styles.backAction}
      />
      <Appbar.Content
        mode="medium"
        titleStyle={styles.content}
        color={color.white}
        title="기도방 초대 목록"
        style={styles.headerContent}
      />
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  header: {
    height: "100%",
    backgroundColor: color.third,
    paddingTop: 0,
    paddingBottom: 0,
    paddingVertical: 0,
    elevation: 0,
    minHeight: 0,
  },
  backAction: {
    alignSelf: "center",
    marginLeft: 0,
    marginTop: -RFValue(20),
  },
  headerContent: {
    marginTop: -RFValue(20),
  },
  content: {
    fontWeight: "bold",
    lineHeight: RFValue(22),
  },
});
