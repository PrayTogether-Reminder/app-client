import React from "react";
import { StyleSheet, Pressable } from "react-native";
import { List, Avatar } from "react-native-paper";
import { color } from "@/common/styles/color";
import { Friend } from "@/domain/friends/types/Friend";

interface FriendItemProps {
  friend: Friend;
  onLongPress: (friend: Friend) => void;
}

export default function FriendItem({
  friend,
  onLongPress,
}: FriendItemProps): React.ReactElement {
  return (
    <Pressable onLongPress={() => onLongPress(friend)} delayLongPress={500}>
      <List.Item
        title={friend.friendName}
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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
  },
  avatar: {
    backgroundColor: color.secondary,
  },
});