import React from "react";
import { StyleSheet } from "react-native";
import { Friend } from "@/domain/friends/types/Friend";
import SelectableFriendList from "./SelectableFriendList";

interface InviteFriendsBodyProps {
  friends: Friend[];
  roomMemberIds: number[];
  selectedFriendIds: number[];
  onToggleFriend: (friendId: number) => void;
  isLoading: boolean;
}

export default function InviteFriendsBody({
  friends,
  roomMemberIds,
  selectedFriendIds,
  onToggleFriend,
  isLoading,
}: InviteFriendsBodyProps): React.ReactElement {
  return (
    <SelectableFriendList
      friends={friends}
      roomMemberIds={roomMemberIds}
      selectedFriendIds={selectedFriendIds}
      onToggleFriend={onToggleFriend}
      isLoading={isLoading}
    />
  );
}

const styles = StyleSheet.create({});
