import React from "react";
import { Appbar } from "react-native-paper";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { color } from "@/common/styles/color";
import { RFValue } from "react-native-responsive-fontsize";

export default function InviteFriendsTop(): React.ReactElement {
  const router = useRouter();

  return (
    <Appbar.Header style={styles.header}>
      <Appbar.BackAction
        size={RFValue(24)}
        color={color.white}
        onPress={() => router.back()}
      />
      <Appbar.Content
        mode="medium"
        titleStyle={styles.content}
        color={color.white}
        title="친구 초대"
      />
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  header: {
    height: RFValue(36),
    backgroundColor: color.third,
  },
  content: {
    fontWeight: "bold",
    lineHeight: RFValue(24),
  },
});
