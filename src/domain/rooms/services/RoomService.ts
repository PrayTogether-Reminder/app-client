import apiService from "../../../common/apis/apiService";
import { ApiResponse } from "../../../common/apis/api";
import { Room } from "../types/dto/responses/room";
import { OrderBy, Dir } from "../../../common/apis/constants/params";

const roomService = {
  // 방 목록 조회
  fetchRooms: async (
    orderBy: OrderBy = OrderBy.DEFAULT,
    after: string = "0",
    dir: Dir = Dir.DEFAULT
  ): Promise<Room[]> => {
    const response: ApiResponse<{ rooms: Room[] }> = await apiService.get<{
      rooms: Room[];
    }>("/rooms", {
      orderBy,
      after,
      dir,
    });
    return response.data.rooms;
  },
  toggleNotification: async (roomId: number): Promise<void> => {
    await apiService.post<number>(`/rooms/${roomId}/notification`);
  },
};

export default roomService;
