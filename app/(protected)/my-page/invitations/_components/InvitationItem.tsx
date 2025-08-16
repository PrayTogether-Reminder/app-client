import React, { useRef } from "react";
import {
  StyleSheet,
  View,
  Animated,
  Pressable,
  useWindowDimensions,
} from "react-native";
import {
  Card,
  Text,
  Button,
  useTheme,
  Paragraph,
  Title,
} from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"; // For icons
import { formatDistanceToNow } from "date-fns"; // 날짜 포맷팅 라이브러리
import { ko } from "date-fns/locale"; // 한국어 locale
import { backgroundColor, color } from "@/common/styles/color"; // Assuming color styles are here
import { Invitation } from "@/domain/invitations/types/Intivation";
import { INVITATION_STATUS } from "@/domain/invitations/constants/invitationStatus";

type InvitationItemProps = {
  invitation: Invitation;
  onClick: (invitationId: number, status: INVITATION_STATUS) => void;
  ispending: boolean; // To disable buttons during mutation
};

// Reusing the RoomItem visual style approach
export default function InvitationItem({
  invitation,
  onClick,
  ispending,
}: InvitationItemProps) {
  const theme = useTheme();
  const { width } = useWindowDimensions();

  // Animation setup (like RoomItem)
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96, // Slightly less aggressive than RoomItem's 0.92
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start();
  };

  // 'X시간 전', 'Y일 전' 등으로 표시
  const timeAgo = formatDistanceToNow(invitation.createdTime, {
    addSuffix: true,
    locale: ko,
  });

  return (
    // Pressable wrapper for animation, no onPress/onLongPress needed here
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
        <Card
          style={[
            styles.card,
            // Use a theme color or a specific color for the border accent
            { borderLeftColor: color.secondary },
          ]}
          mode="elevated"
        >
          <Card.Content style={styles.contentContainer}>
            {/* Header Row (Room Name) - Similar to RoomItem */}
            <View style={styles.headerRow}>
              <Title style={styles.roomName}>{invitation.roomName}</Title>
              {/* Optional: Add an icon if needed, e.g., mail icon */}
              {/* <MaterialCommunityIcons name="email-outline" size={width * 0.06} color={color.black} /> */}
            </View>

            {/* Info Row (Inviter Info + Time) - Similar structure */}
            <View style={styles.infoRow}>
              <View style={styles.detailRow}>
                <AntDesign
                  name="user"
                  size={width * 0.045} // Slightly smaller icon
                  color={color.gray} // Use a less prominent color
                />
                <Paragraph style={styles.detailInviter}>
                  <Text style={styles.inviterName}>
                    {invitation.inviterName}
                  </Text>{" "}
                  님의 초대
                </Paragraph>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons
                  name="clock-time-three-outline"
                  size={width * 0.045}
                  color={color.gray}
                />
                <Text style={styles.invitedTime}>{timeAgo}</Text>
              </View>
              <View style={styles.detailRowDescription}>
                <Text style={styles.detailDescription}>
                  {invitation.roomDescription}
                </Text>
              </View>
            </View>
          </Card.Content>

          {/* Actions remain similar, but maybe adjust padding */}
          <Card.Actions style={styles.actions}>
            <Button
              mode="outlined"
              onPress={() =>
                onClick(invitation.invitationId, INVITATION_STATUS.REJECT)
              }
              style={[styles.button, styles.rejectButton]}
              labelStyle={styles.buttonLabel}
              textColor={theme.colors.error}
              icon="close-circle-outline"
              disabled={ispending} // Disable while accept/reject is processing
            >
              거절
            </Button>
            <Button
              mode="contained"
              onPress={() =>
                onClick(invitation.invitationId, INVITATION_STATUS.ACCEPT)
              }
              style={[styles.button, styles.acceptButton]}
              labelStyle={styles.buttonLabel}
              icon="check-circle-outline"
              disabled={ispending} // Disable while accept/reject is processing
            >
              수락
            </Button>
          </Card.Actions>
        </Card>
      </Animated.View>
    </Pressable>
  );
}

// Styles adapted from RoomItem and the original InvitationItem
const styles = StyleSheet.create({
  card: {
    backgroundColor: backgroundColor.white,
    marginBottom: RFValue(16),
    borderLeftWidth: RFValue(6), // Accent border like RoomItem
    elevation: 3, // Similar elevation
  },
  contentContainer: {
    gap: RFValue(10), // Spacing between elements
    paddingBottom: RFValue(4), // Reduce bottom padding if actions are present
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    color: color.secondary,
  },
  roomName: {
    fontSize: RFValue(17), // Slightly smaller title than RoomItem
    fontWeight: "bold",
    flex: 1, // Allow title to take available space
    marginRight: RFValue(8), // Add space if an icon is used on the right
    lineHeight: RFValue(22),
  },
  infoRow: {
    flexDirection: "column", // Stack inviter and time vertically
    gap: RFValue(6),
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: RFValue(6), // Space between icon and text
  },
  detailInviter: {
    fontSize: RFValue(13),
    color: color.black, // Use a defined gray color
    lineHeight: RFValue(17),
  },
  inviterName: {
    fontWeight: "600", // Medium weight
    color: color.secondary, // Or slightly darker gray
    lineHeight: RFValue(17),
  },
  invitedTime: {
    fontSize: RFValue(12),
    color: color.secondary, // Lighter gray for time
    lineHeight: RFValue(16),
  },
  detailRowDescription: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: RFValue(8),
  },
  detailDescription: {
    fontSize: RFValue(13),
    color: color.black,
    lineHeight: RFValue(17),
  },
  actions: {
    justifyContent: "flex-end",
    paddingTop: RFValue(4),
    paddingBottom: RFValue(10),
    paddingHorizontal: RFValue(12),
  },
  button: {
    marginLeft: RFValue(8),
    minWidth: RFValue(80),
  },
  rejectButton: {
    borderColor: color.red, // Use theme outline color
  },
  acceptButton: {
    // Default contained
  },
  buttonLabel: {
    fontSize: RFValue(13),
    lineHeight: RFValue(17),
  },
});
