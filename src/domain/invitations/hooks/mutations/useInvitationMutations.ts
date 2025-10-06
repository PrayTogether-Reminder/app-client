import { useMutation, useQueryClient } from "@tanstack/react-query";
import QUERY_KEYS from "../../../../common/constants/queryKeys";
import type { CreateInvitationRequest } from "../../types/request/createInvitationRequest";
import type { InviteRoomMemberV2Request } from "../../types/request/inviteRoomMemberV2Request";
import { ApiError } from "../../../../common/apis/api";
import { invitationService } from "../../services/invitationServices";
import type { UpdateInvitationStatusRequest } from "../../types/request/updateInvitationStatusRequest";
import { showAlert } from "@/common/components/modal/stores/useAlertStore";

// 방 초대 mutation (v1 - email 기반)
export const useInviteRoomMemberMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roomId, email }: CreateInvitationRequest) => {
      return invitationService.inviteRoomMember(roomId, email);
    },
    onError: (error: ApiError, variables, context) => {
      showAlert({
        title: "초대 실패",
        message: error.message,
        icon: "account-alert",
      });
    },
    onSuccess: (data, variables) => {
      showAlert({
        title: "초대 성공",
        message: data.message,
        icon: "account-plus",
      });
    },
  });
};

// 방 초대 mutation (v2 - memberIds 배열 기반)
export const useInviteRoomMemberV2Mutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roomId, memberIds }: InviteRoomMemberV2Request) => {
      return invitationService.inviteRoomMemberV2(roomId, memberIds);
    },
    onError: (error: ApiError, variables, context) => {
      showAlert({
        title: "초대 실패",
        message: error.message,
        icon: "account-alert",
      });
    },
    onSuccess: (data, variables) => {
      showAlert({
        title: "초대 성공",
        message: data.message,
        icon: "account-plus",
      });
    },
  });
};

// 초대 응답 - ACCEPT or REJECT
export const useUpdateInvitationStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      invitationId,
      status,
    }: UpdateInvitationStatusRequest) => {
      return await invitationService.updateStatus(invitationId, status);
    },
    onError: (error: ApiError, variables, context) => {
      showAlert({
        title: "응답 실패",
        message: error.message,
        icon: "alert-circle",
      });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.invitations] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.rooms] });
      showAlert({
        title: "응답 완료",
        message: data.message,
        icon: "check-circle",
      });
    },
  });
};
