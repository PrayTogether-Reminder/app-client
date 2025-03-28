import { useMutation, useQueryClient } from "@tanstack/react-query";
import QUERY_KEYS from "../../../../common/constants/queryKeys";
import type { CreateInvitationRequest } from "../../types/request/createInvitationRequest";
import { ApiError } from "../../../../common/apis/api";
import { Alert } from "react-native";
import { invitationService } from "../../services/invitationServices";
import type { UpdateInvitationStatusRequest } from "../../types/request/updateInvitationStatusRequest";

// 방 초대 mutation
export const useInviteRoomMemberMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roomId, email }: CreateInvitationRequest) => {
      return invitationService.inviteRoomMember(roomId, email);
    },
    onError: (error: ApiError, variables, context) => {
      Alert.alert("오류", error.message);
    },
    onSuccess: (data, variables) => {
      Alert.alert("성공", data.message);
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
      Alert.alert("오류", error.message);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.invitations] });
      Alert.alert("초대 응답", data.message);
    },
  });
};
