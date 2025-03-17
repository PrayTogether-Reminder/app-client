import apiService from "../../../common/apis/apiService";
import { ApiResponse } from "../../../common/apis/api";
import { RoomMember } from "../types/dto/response/roomMember";

const roomService = {
  // 멤버 목록 조회
  fetchRoomMembers: async (roomId: string): Promise<RoomMember[]> => {
    const response: ApiResponse<{ members: RoomMember[] }> =
      await apiService.get<{
        members: RoomMember[];
      }>(`/rooms/${roomId}/members`);
    return response.data.members;
  },
};

export default roomService;
