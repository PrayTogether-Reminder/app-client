import apiService from "@/common/apis/apiService";
import { Room } from "../types/room";
import { RoomMember } from "../types/roomMember";
import { MessageResponse } from "@/common/types/messageResponse";
import { FetchRoomsParams } from "../types/params/fetchRoomsParams";
import { DeleteRoomParams } from "../types/params/deleteRoomParams";

export const roomService = {
  // 방 목록 조회
  fetchRooms: async ({
    orderBy,
    after,
    dir,
  }: FetchRoomsParams): Promise<Room[]> => {
    const response = await apiService.get<{ rooms: Room[] }>("/rooms", {
      orderBy,
      after,
      dir,
    });
    return response.data.rooms;
  },

  // 알림 설정 토글
  toggleNotification: async (roomId: number): Promise<void> => {
    await apiService.post(`/rooms/${roomId}/notification`);
  },

  // 멤버 목록 조회
  fetchRoomMembers: async (roomId: number | null): Promise<RoomMember[]> => {
    const response = await apiService.get<{ members: RoomMember[] }>(
      `/rooms/${roomId}/members`
    );
    return response.data.members;
  },

  // 방 생성
  create: async (
    name: string,
    description: string
  ): Promise<MessageResponse> => {
    const response = await apiService.post<MessageResponse>(`/rooms`, {
      name,
      description,
    } as CreateRoomRequest);
    return response;
  },

  // 기도방 나가기(삭제)
  delete: async (params: DeleteRoomParams): Promise<MessageResponse> => {
    const response = await apiService.delete<MessageResponse>(
      `/rooms/${params.roomId}`
    );
    return response;
  },
};
