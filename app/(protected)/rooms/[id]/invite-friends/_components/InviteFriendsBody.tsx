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
  isRefetching: boolean;
  onRefresh: () => void;
}

export default function InviteFriendsBody({
  friends,
  roomMemberIds,
  selectedFriendIds,
  onToggleFriend,
  isLoading,
  isRefetching,
  onRefresh,
}: InviteFriendsBodyProps): React.ReactElement {
  return (
    <SelectableFriendList
      friends={friends}
      roomMemberIds={roomMemberIds}
      selectedFriendIds={selectedFriendIds}
      onToggleFriend={onToggleFriend}
      isLoading={isLoading}
      isRefetching={isRefetching}
      onRefresh={onRefresh}
    />
  );
}

const styles = StyleSheet.create({});
