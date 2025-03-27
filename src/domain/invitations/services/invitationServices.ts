import apiService from "@/common/apis/apiService";
import type { MessageResponse } from "@/common/types/messageResponse";
import { Invitation } from "../types/Intivation";
import { FetchInvitationsResponse } from "../types/response/fetchInvitationsResponse";

export const invitationService = {
  // 멤버 초대
  inviteRoomMember: async (
    roomId: number | null,
    email: string
  ): Promise<MessageResponse> => {
    const response = await apiService.post<MessageResponse>(`/invitations`, {
      roomId,
      email,
    });
    return response;
  },
  // 초대 목록 조회
  fetch: async (): Promise<Invitation[]> => {
    const response = await apiService.get<FetchInvitationsResponse>(
      `/invitations`
    );
    return response.data.invitations;
  },
};
