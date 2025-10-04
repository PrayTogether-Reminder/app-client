import React from "react";
import { StyleSheet } from "react-native";
import FetchError from "@/common/components/error/FetchError";
import FriendList from "./FriendList";
import { Friend } from "@/domain/friends/types/Friend";

interface FriendsBodyProps {
  friends: Friend[];
  isLoading: boolean;
  isRefetching: boolean;
  isError: boolean;
  error: Error | null;
  onRefresh: () => void;
  onRetry: () => void;
  onFriendLongPress: (friend: Friend) => void;
}

export default function FriendsBody({
  friends,
  isLoading,
  isRefetching,
  isError,
  error,
  onRefresh,
  onRetry,
  onFriendLongPress,
}: FriendsBodyProps) {
  if (isError) {
    return (
      <FetchError error={error} onRetry={onRetry} isRetrying={isRefetching} />
    );
  }

  return (
    <FriendList
      friends={friends}
      isLoading={isLoading}
      isRefetching={isRefetching}
      onRefresh={onRefresh}
      onFriendLongPress={onFriendLongPress}
    />
  );
}

const styles = StyleSheet.create({});