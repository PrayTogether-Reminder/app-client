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
import { backgroundColor, color } from "@/common/styles/color";
import { FriendInvitation } from "@/domain/friends/types/FriendInvitation";
import { FRIEND_INVITATION_STATUS } from "@/domain/friends/constants/friendInvitationStatus";

interface FriendRequestItemProps {
  invitation: FriendInvitation;
  onStatusUpdate: (
    invitationId: number,
    status: FRIEND_INVITATION_STATUS
  ) => void;
  isPending: boolean;
}

export default function FriendRequestItem({
  invitation,
  onStatusUpdate,
  isPending,
}: FriendRequestItemProps): React.ReactElement {
  const theme = useTheme();
  const { width } = useWindowDimensions();

  // Animation setup
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
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

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
        <Card
          style={[
            styles.card,
            { borderLeftColor: color.secondary },
          ]}
          mode="elevated"
        >
          <Card.Content style={styles.contentContainer}>
            {/* Header Row */}
            <View style={styles.headerRow}>
              <Title style={styles.senderName}>{invitation.senderName}</Title>
            </View>

            {/* Info Row */}
            <View style={styles.infoRow}>
              <View style={styles.detailRow}>
                <AntDesign
                  name="user"
                  size={width * 0.045}
                  color={color.gray}
                />
                <Paragraph style={styles.detailText}>
                  친구 요청을 보냈습니다
                </Paragraph>
              </View>
            </View>
          </Card.Content>

          {/* Actions */}
          <Card.Actions style={styles.actions}>
            <Button
              mode="outlined"
              onPress={() =>
                onStatusUpdate(
                  invitation.invitationId,
                  FRIEND_INVITATION_STATUS.REJECTED
                )
              }
              style={[styles.button, styles.rejectButton]}
              labelStyle={styles.buttonLabel}
              textColor={theme.colors.error}
              icon="close-circle-outline"
              disabled={isPending}
            >
              거절
            </Button>
            <Button
              mode="contained"
              onPress={() =>
                onStatusUpdate(
                  invitation.invitationId,
                  FRIEND_INVITATION_STATUS.ACCEPTED
                )
              }
              style={[styles.button, styles.acceptButton]}
              labelStyle={styles.buttonLabel}
              icon="check-circle-outline"
              disabled={isPending}
            >
              수락
            </Button>
          </Card.Actions>
        </Card>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: backgroundColor.white,
    marginBottom: RFValue(16),
    borderLeftWidth: RFValue(6),
    elevation: 3,
  },
  contentContainer: {
    gap: RFValue(10),
    paddingBottom: RFValue(4),
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  senderName: {
    fontSize: RFValue(17),
    fontWeight: "bold",
    flex: 1,
    marginRight: RFValue(8),
    lineHeight: RFValue(22),
  },
  infoRow: {
    flexDirection: "column",
    gap: RFValue(6),
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: RFValue(6),
  },
  detailText: {
    fontSize: RFValue(13),
    color: color.gray,
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
    borderColor: color.red,
  },
  acceptButton: {
    // Default contained style
  },
  buttonLabel: {
    fontSize: RFValue(13),
    lineHeight: RFValue(17),
  },
});