import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import QUERY_KEYS from "../../../../common/hooks/queries/queryKeys";
import roomService from "./../../services/roomService";
import { RoomMember } from "./../../types/dto/response/roomMember";

export const useRoomMembersQuery = (
  roomId: string,
  options?: UseQueryOptions<RoomMember[], Error>
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.room, QUERY_KEYS.members, roomId],
    queryFn: async () => {
      console.log("fetching room members with ID:", roomId);
      return roomService.fetchRoomMembers(roomId);
    },
    enabled: !!roomId, // roomId가 있을 때만 쿼리 실행
    ...options,
  });
};
