import { useMutation, useQueryClient } from "@tanstack/react-query";
import QUERY_KEYS from "../../../../common/constants/queryKeys";
import { ApiError } from "../../../../common/apis/api";
import { friendService } from "../../services/friendService";
import { FRIEND_INVITATION_STATUS } from "../../constants/friendInvitationStatus";
import { showAlert } from "@/common/components/modal/stores/useAlertStore";

// 친구 요청 보내기
export const useSendFriendInvitationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inviteeEmail: string) => {
      return friendService.sendFriendInvitation(inviteeEmail);
    },
    onError: (error: ApiError, variables, context) => {
      showAlert({
        title: "친구 요청 실패",
        message: error.message,
        icon: "account-alert",
      });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.friends] });
      showAlert({
        title: "친구 요청 완료",
        message: data.message,
        icon: "account-plus",
      });
    },
  });
};

// 친구 요청 응답 (수락/거절)
export const useUpdateFriendInvitationStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      requestId,
      status,
    }: {
      requestId: number;
      status: FRIEND_INVITATION_STATUS;
    }) => {
      return await friendService.updateInvitationStatus(requestId, status);
    },
    onError: (error: ApiError, variables, context) => {
      showAlert({
        title: "응답 실패",
        message: error.message,
        icon: "alert-circle",
      });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.friendInvitations],
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.friends] });
      showAlert({
        title: "응답 완료",
        message: data.message,
        icon: "check-circle",
      });
    },
  });
};

// 친구 삭제
export const useDeleteFriendMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (friendId: number) => {
      return friendService.deleteFriend(friendId);
    },
    onError: (error: ApiError, variables, context) => {
      showAlert({
        title: "친구 삭제 실패",
        message: error.message,
        icon: "account-alert",
      });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.friends] });
      showAlert({
        title: "친구 삭제 완료",
        message: data.message,
        icon: "account-remove",
      });
    },
  });
};