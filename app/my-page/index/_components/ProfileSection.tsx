// ProfileSection.tsx
import React from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { Avatar, Title, Caption, Surface, Button } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize"; // RFValue 라이브러리 import 추가
import { color } from "@/common/styles/color";
import { useProfileQuery } from "@/domain/profiles/hooks/queries/profileQueries";

export default function ProfileSection() {
  const { width } = useWindowDimensions();
  const avatarSize = width * 0.1;
  const { data: profile } = useProfileQuery();

  return (
    <Surface style={[styles.profileSection, { backgroundColor: color.white }]}>
      <View style={styles.profileContainer}>
        <Avatar.Text
          size={avatarSize}
          label={profile?.name?.charAt(0) ?? ""}
          style={styles.avatar}
        />
        <Title style={styles.userName}>{profile?.name ?? "이름이..."}</Title>
        <Caption style={styles.userEmail}>
          {profile?.email ?? "이메일이..."}
        </Caption>
        {/* <Button
        mode="outlined"
        // onPress={handleEditProfile}
        style={styles.editButton}
        icon="pencil-outline"
        compact
      >
        프로필 수정
      </Button> */}
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    alignItems: "center",
    justifyContent: "center",
    height: "95%",
    paddingTop: RFValue(12),
  },
  profileContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    marginBottom: RFValue(4),
  },
  userName: {
    fontSize: RFValue(20),
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: RFValue(14),
    marginBottom: RFValue(8),
  },
  editButton: {
    // marginTop: RFValue(8),
  },
});
