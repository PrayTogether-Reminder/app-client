import React from "react";
import { StyleSheet } from "react-native";
import FetchError from "@/common/components/error/FetchError";
import FriendRequestList from "./FriendRequestList";
import { FriendInvitation } from "@/domain/friends/types/FriendInvitation";
import { FRIEND_INVITATION_STATUS } from "@/domain/friends/constants/friendInvitationStatus";

interface FriendRequestBodyProps {
  invitations: FriendInvitation[];
  isLoading: boolean;
  isRefetching: boolean;
  isError: boolean;
  error: Error | null;
  isPending: boolean;
  onRefresh: () => void;
  onRetry: () => void;
  onStatusUpdate: (
    invitationId: number,
    status: FRIEND_INVITATION_STATUS
  ) => void;
}

export default function FriendRequestBody({
  invitations,
  isLoading,
  isRefetching,
  isError,
  error,
  isPending,
  onRefresh,
  onRetry,
  onStatusUpdate,
}: FriendRequestBodyProps) {
  if (isError) {
    return (
      <FetchError error={error} onRetry={onRetry} isRetrying={isRefetching} />
    );
  }

  return (
    <FriendRequestList
      invitations={invitations}
      isLoading={isLoading}
      isRefetching={isRefetching}
      isPending={isPending}
      onRefresh={onRefresh}
      onStatusUpdate={onStatusUpdate}
    />
  );
}

const styles = StyleSheet.create({});