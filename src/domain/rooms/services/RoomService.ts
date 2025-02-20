import apiService from "../../../common/apis/apiService";
import { ApiResponse } from "../../../common/apis/api";
import { Room } from "../types/roomType";
import { OrderBy, Dir } from "../../../common/apis/constants/params";

export async function fetchRooms(
  orderBy: OrderBy = OrderBy.DEFAULT,
  after: number = 0,
  dir: Dir = Dir.DEFAULT
): Promise<Room[]> {
  const response: ApiResponse<{ rooms: Room[] }> = await apiService.get<{
    rooms: Room[];
  }>("/rooms", {
    orderBy: orderBy,
    after: after,
    dir: dir,
  });
  return response.data.rooms;
}
