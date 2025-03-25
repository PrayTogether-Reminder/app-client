import {
  useQuery,
  useInfiniteQuery,
  UseQueryOptions,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { OrderBy, Dir } from "../../../../common/constants/params";
import { Room } from "../../types/room";
import { roomService } from "../../services/roomService";
import { RoomMember } from "../../types/roomMember";
import QUERY_KEYS from "../../../../common/constants/queryKeys";

type RoomPageParam = {
  orderBy: OrderBy;
  after: string;
  dir: Dir;
};

// 기도방 무한 스크롤
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
      return roomService.fetchRooms({
        orderBy: param.orderBy,
        after: param.after,
        dir: param.dir,
      });
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

// 기도방 멤버 조회
export const useRoomMembersQuery = (
  roomId: number | null,
  options?: UseQueryOptions<RoomMember[], Error>
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.rooms, roomId, QUERY_KEYS.members],
    queryFn: async () => {
      console.log("fetching room members with ID:", roomId);
      return roomService.fetchRoomMembers(roomId);
    },
    enabled: !!roomId, // roomId가 있을 때만 쿼리 실행
    ...options,
  });
};
