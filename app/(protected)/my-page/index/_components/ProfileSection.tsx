// ProfileSection.tsx
import React from "react";
import { StyleSheet, View } from "react-native";
import { Title, Caption, Surface, IconButton } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "@/common/styles/color";
import { useProfileQuery } from "@/domain/members/hooks/queries/memberQueries";
import { useRouter } from "expo-router";
import { Avatar } from "@/common/components/avatar";

export default function ProfileSection() {
  const router = useRouter();
  const { data: profile } = useProfileQuery();

  return (
    <Surface style={[styles.profileSection, { backgroundColor: color.white }]} elevation={0}>
      <View style={styles.profileContainer}>
        <Avatar
          name={profile?.name ?? ""}
          size={40}
          style={styles.avatar}
        />
        <View style={styles.nameRow}>
          <Title style={styles.userName}>{profile?.name ?? "이름이..."}</Title>
          <IconButton
            icon="pencil-outline"
            size={RFValue(18)}
            onPress={() => router.push("/(protected)/my-page/edit")}
            style={styles.editIcon}
            iconColor={color.secondary}
          />
        </View>
        <Caption style={styles.userEmail}>
          {profile?.email ?? "이메일이..."}
        </Caption>
        {profile?.phoneNumber && (
          <Caption style={styles.userPhone}>
            {profile.phoneNumber}
          </Caption>
        )}
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    alignItems: "center",
    justifyContent: "flex-end",
    height: "95%",
    paddingTop: RFValue(12),
    borderBottomWidth: 2,
    borderBottomColor: "#DDDDDD",
  },
  profileContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    marginBottom: RFValue(4),
  },
  nameRow: {
    position: "relative",
    width: "70%",
    alignItems: "center",
    justifyContent: "center",
  },
  userName: {
    fontSize: RFValue(20),
    fontWeight: "bold",
    lineHeight: RFValue(26),
    textAlign: "center",
  },
  editIcon: {
    position: "absolute",
    right: RFValue(-28),
    top: RFValue(0),
    margin: 0,
    padding: 0,
  },
  userEmail: {
    fontSize: RFValue(14),
    marginBottom: RFValue(4),
    lineHeight: RFValue(18),
  },
  userPhone: {
    fontSize: RFValue(13),
    marginBottom: RFValue(8),
    lineHeight: RFValue(17),
    color: "#888",
  },
});
