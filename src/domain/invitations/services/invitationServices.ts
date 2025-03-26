import apiService from "@/common/apis/apiService";
import { InviteRoomMemberRequest } from "../../invitations/types/request/inviteRoomMemberRequest";
import type { MessageResponse } from "@/common/types/messageResponse";

export const invitationService = {
  // 멤버 초대
  inviteRoomMember: async (
    roomId: number | null,
    email: string
  ): Promise<MessageResponse> => {
    const response = await apiService.post<InviteRoomMemberRequest>(
      `/invitations`,
      {
        roomId,
        email,
      }
    );
    return response;
  },
};
