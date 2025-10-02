import React from "react";
import { StyleSheet, View } from "react-native";
import { List, Avatar, Button } from "react-native-paper";
import { color } from "@/common/styles/color";
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
  return (
    <View style={styles.container}>
      <List.Item
        title={invitation.senderName}
        titleStyle={styles.title}
        left={(props) => (
          <Avatar.Icon
            {...props}
            size={48}
            icon="account"
            color={color.white}
            style={styles.avatar}
          />
        )}
        style={styles.item}
      />
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() =>
            onStatusUpdate(
              invitation.invitationId,
              FRIEND_INVITATION_STATUS.ACCEPTED
            )
          }
          disabled={isPending}
          style={[styles.button, styles.acceptButton]}
          labelStyle={styles.buttonLabel}
        >
          수락
        </Button>
        <Button
          mode="outlined"
          onPress={() =>
            onStatusUpdate(
              invitation.invitationId,
              FRIEND_INVITATION_STATUS.REJECTED
            )
          }
          disabled={isPending}
          style={[styles.button, styles.rejectButton]}
          labelStyle={styles.buttonLabel}
        >
          거절
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  item: {
    paddingVertical: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
  },
  avatar: {
    backgroundColor: color.secondary,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 8,
  },
  button: {
    minWidth: 80,
  },
  acceptButton: {
    backgroundColor: color.primary,
  },
  rejectButton: {
    borderColor: color.gray,
  },
  buttonLabel: {
    fontSize: 14,
  },
});