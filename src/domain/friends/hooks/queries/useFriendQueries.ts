import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { friendService } from "../../services/friendService";
import { Friend } from "../../types/Friend";
import { FriendInvitation } from "../../types/FriendInvitation";
import QUERY_KEYS from "../../../../common/constants/queryKeys";

// 친구 목록 조회
export const useFetchFriendsQuery = (
  options?: UseQueryOptions<Friend[], Error>
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.friends],
    queryFn: async () => {
      console.log("API: fetch friends");
      return friendService.fetchFriends();
    },
    ...options,
  });
};

// 친구 요청 목록 조회
export const useFetchFriendInvitationsQuery = (
  options?: UseQueryOptions<FriendInvitation[], Error>
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.friendInvitations],
    queryFn: async () => {
      console.log("API: fetch friend invitations");
      return friendService.fetchFriendInvitations();
    },
    ...options,
  });
};