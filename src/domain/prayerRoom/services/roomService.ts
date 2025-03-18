import apiService from "../../../common/apis/apiService";
import { ApiResponse } from "../../../common/apis/api";
import { RoomMember } from "../types/dto/response/roomMember";
import { inviteRoomMemberResponse } from "../types/dto/response/inviteRoomMemberResponse";
import { InviteRoomMemberRequest } from "../types/dto/request/inviteRoomMemberRequest";
import { Easing } from "react-native";

const roomService = {
  // 멤버 목록 조회
  fetchRoomMembers: async (roomId: string): Promise<RoomMember[]> => {
    const response: ApiResponse<{ members: RoomMember[] }> =
      await apiService.get<{
        members: RoomMember[];
      }>(`/rooms/${roomId}/members`);
    return response.data.members;
  },
  inviteRoomMember: async (
    roomId: string,
    email: string
  ): Promise<inviteRoomMemberResponse> => {
    const response = await apiService.post<InviteRoomMemberRequest>(
      `/invitations`,
      {
        roomId: roomId,
        email: email,
      }
    );
    return response;
  },
};

export default roomService;
