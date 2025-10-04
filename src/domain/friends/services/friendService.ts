import apiService from "@/common/apis/apiService";
import type { MessageResponse } from "@/common/types/messageResponse";
import { FriendInvitation } from "../types/FriendInvitation";
import { Friend } from "../types/Friend";
import { FetchFriendInvitationsResponse } from "../types/response/fetchFriendInvitationsResponse";
import { FetchFriendsResponse } from "../types/response/fetchFriendsResponse";
import { UpdateFriendInvitationStatusRequest } from "../types/request/updateFriendInvitationStatusRequest";
import { SendFriendInvitationRequest } from "../types/request/sendFriendInvitationRequest";
import { FRIEND_INVITATION_STATUS } from "../constants/friendInvitationStatus";

export const friendService = {
  // 1. 친구 요청 보내기
  sendFriendInvitation: async (
    inviteeEmail: string
  ): Promise<MessageResponse> => {
    const response = await apiService.post<MessageResponse>(
      `/v1/friends/requests`,
      { inviteeEmail } as SendFriendInvitationRequest
    );
    return response;
  },

  // 2. 친구 요청 목록 조회
  fetchFriendInvitations: async (): Promise<FriendInvitation[]> => {
    const response = await apiService.get<FetchFriendInvitationsResponse>(
      `/v1/friends/requests`
    );
    return response.data.friendInvitations;
  },

  // 3. 친구 요청 응답 (수락/거절)
  updateInvitationStatus: async (
    requestId: number,
    status: FRIEND_INVITATION_STATUS
  ): Promise<MessageResponse> => {
    const response = await apiService.patch<MessageResponse>(
      `/v1/friends/requests/${requestId}`,
      { status } as UpdateFriendInvitationStatusRequest
    );
    return response;
  },

  // 4. 친구 목록 조회
  fetchFriends: async (): Promise<Friend[]> => {
    const response = await apiService.get<FetchFriendsResponse>(`/v1/friends`);
    return response.data.friends;
  },

  // 5. 친구 삭제
  deleteFriend: async (friendId: number): Promise<MessageResponse> => {
    const response = await apiService.delete<MessageResponse>(
      `/v1/friends/${friendId}`
    );
    return response;
  },
};