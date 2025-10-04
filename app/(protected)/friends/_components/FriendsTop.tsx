import React from "react";
import { Appbar, Badge } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { backgroundColor, color } from "@/common/styles/color";
import { RFValue } from "react-native-responsive-fontsize";
import path from "@/common/constants/path";

interface FriendsTopProps {
  requestCount?: number;
  onPressRequests: () => void;
  onPressAdd: () => void;
}

export default function FriendsTop({
  requestCount = 0,
  onPressRequests,
  onPressAdd,
}: FriendsTopProps): React.ReactElement {
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
        title="친구"
      />

      {/* 친구 요청 버튼 */}
      <View style={styles.iconContainer}>
        <Appbar.Action
          icon="bell-outline"
          size={RFValue(24)}
          color={color.white}
          onPress={onPressRequests}
        />
        {requestCount > 0 && (
          <Badge style={styles.badge} size={16}>
            {requestCount}
          </Badge>
        )}
      </View>

      {/* 친구 추가 버튼 */}
      <Appbar.Action
        icon="account-plus-outline"
        size={RFValue(24)}
        color={color.white}
        onPress={onPressAdd}
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
  iconContainer: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: color.error,
  },
});