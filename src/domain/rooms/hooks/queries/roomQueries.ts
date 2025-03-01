import {
  useQuery,
  useInfiniteQuery,
  UseQueryOptions,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { OrderBy, Dir } from "../../../../common/apis/constants/params";
import { Room } from "../../types/dto/responses/room";
import roomService from "./../../services/roomService";
import QUERY_KEYS from "../../../../common/hooks/queries/queryKeys";

type RoomPageParam = {
  orderBy: OrderBy;
  after: string;
  dir: Dir;
};

// 무한 스크롤용 방 목록 쿼리
export const useInfiniteRoomsQuery = (
  orderBy: OrderBy = OrderBy.DEFAULT,
  after: string = "0",
  dir: Dir = Dir.DEFAULT,
  options?: UseInfiniteQueryOptions<Room[], Error>
) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.rooms, QUERY_KEYS.infinite],
    queryFn: async ({ pageParam }) => {
      const param = pageParam as RoomPageParam;
      console.log("infinite query pageParam=", param);
      return roomService.fetchRooms(param.orderBy, param.after, param.dir);
    },
    initialPageParam: {
      orderBy,
      after,
      dir,
    } as RoomPageParam,
    getNextPageParam: (lastPage) => {
      if (lastPage.length === 0) return undefined;
      const lastRoom = lastPage[lastPage.length - 1];
      let nextAfter = getNextAfter(orderBy, lastRoom);
      return {
        orderBy: orderBy,
        after: nextAfter,
        dir: dir,
      };
    },
    ...options,
  });
};

function getNextAfter(orderBy: OrderBy, room: Room) {
  switch (orderBy) {
    case OrderBy.DEFAULT:
    case OrderBy.TIME:
      return room.createdTime.toString();
  }
  return "0";
}
