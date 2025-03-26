import { useMutation, useQueryClient } from "@tanstack/react-query";
import QUERY_KEYS from "../../../../common/constants/queryKeys";
import type { InviteRoomMemberRequest } from "../../types/request/inviteRoomMemberRequest";
import { ApiError } from "../../../../common/apis/api";
import { Alert } from "react-native";
import { invitationService } from "../../services/invitationServices";

// 방 초대 mutation
export const useInviteRoomMemberMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roomId, email }: InviteRoomMemberRequest) => {
      return invitationService.inviteRoomMember(roomId, email);
    },
    onError: (error: ApiError, variables, context) => {
      Alert.alert(error.message);
    },
    onSuccess: (data, variables) => {
      Alert.alert(data.message);
    },
  });
};
