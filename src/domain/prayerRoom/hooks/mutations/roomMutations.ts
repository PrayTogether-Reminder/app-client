import { useMutation, useQueryClient } from "@tanstack/react-query";
import roomService from "../../services/roomService";
import QUERY_KEYS from "../../../../common/hooks/queries/queryKeys";
import type { InviteRoomMemberRequest } from "../../types/dto/request/inviteRoomMemberRequest";
import { ApiError } from "../../../../common/apis/api";
import { Alert } from "react-native";

// 방 초대 mutation
export const useInviteRoomMemberMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roomId, email }: InviteRoomMemberRequest) => {
      return roomService.inviteRoomMember(roomId, email);
    },
    onError: (error: ApiError, variables, context) => {
      Alert.alert(error.message);
    },
    onSuccess: (data, variables) => {
      Alert.alert(data.message);
    },
  });
};
