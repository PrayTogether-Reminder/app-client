import apiService from "@/common/apis/apiService";
import { InviteRoomMemberRequest } from "../../invitations/types/request/inviteRoomMemberRequest";
import { inviteRoomMemberResponse } from "../../invitations/types/response/inviteRoomMemberResponse";

export const invitationService = {
  // 멤버 초대
  inviteRoomMember: async (
    roomId: number | null,
    email: string
  ): Promise<inviteRoomMemberResponse> => {
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
