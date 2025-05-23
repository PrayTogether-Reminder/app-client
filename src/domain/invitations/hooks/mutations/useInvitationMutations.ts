import { useMutation, useQueryClient } from "@tanstack/react-query";
import QUERY_KEYS from "../../../../common/constants/queryKeys";
import type { CreateInvitationRequest } from "../../types/request/createInvitationRequest";
import { ApiError } from "../../../../common/apis/api";
import { invitationService } from "../../services/invitationServices";
import type { UpdateInvitationStatusRequest } from "../../types/request/updateInvitationStatusRequest";
import { showAlert } from "@/common/components/modal/stores/useAlertStore";

// 방 초대 mutation
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
      showAlert({
        title: "응답 완료",
        message: data.message,
        icon: "check-circle",
      });
    },
  });
};
