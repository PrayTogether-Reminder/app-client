import apiService from "@/common/apis/apiService";
import { Room } from "../types/room";
import { RoomMember } from "../types/roomMember";
import { InviteRoomMemberRequest } from "../../invitations/types/request/inviteRoomMemberRequest";
import { inviteRoomMemberResponse } from "../../invitations/types/response/inviteRoomMemberResponse";
import { RoomListParams } from "../types/params/roomListParams";

export const roomService = {
  // 방 목록 조회
  fetchRooms: async ({
    orderBy,
    after,
    dir,
  }: RoomListParams): Promise<Room[]> => {
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
