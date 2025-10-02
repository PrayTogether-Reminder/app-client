import apiService from "@/common/apis/apiService";
import type { MessageResponse } from "@/common/types/messageResponse";
import { Invitation } from "../types/Intivation";
import { FetchInvitationsResponse } from "../types/response/fetchInvitationsResponse";
import type { INVITATION_STATUS } from "../constants/invitationStatus";
import { UpdateInvitationStatusRequest } from "../types/request/updateInvitationStatusRequest";

export const invitationService = {
  // 멤버 초대
  inviteRoomMember: async (
    roomId: number | null,
    email: string
  ): Promise<MessageResponse> => {
    const response = await apiService.post<MessageResponse>(`/v1/invitations`, {
      roomId,
      email,
    });
    return response;
  },

  // 초대 목록 조회
  fetch: async (): Promise<Invitation[]> => {
    const response =
      await apiService.get<FetchInvitationsResponse>(`/v1/invitations`);
    return response.data.invitations;
  },

  // 초대 응답 상태 없데이트 - AEECPTED or REJECTED
  updateStatus: async (
    invitationId: number,
    status: INVITATION_STATUS
  ): Promise<MessageResponse> => {
    const response = await apiService.patch<MessageResponse>(
      `/v1/invitations/${invitationId}`,
      {
        status,
      } as UpdateInvitationStatusRequest
    );
    return response;
  },
};
