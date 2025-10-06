import QUERY_KEYS from "../../../../common/constants/queryKeys";
import { memberService } from "../../services/memberService";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { FetchProfileResponse } from "../../types/response/fetchProfileResponse";
import { MemberSearchResult } from "../../types/response/searchMembersResponse";

// 사용자 프로필 조회 쿼리
export const useProfileQuery = (
  options?: UseQueryOptions<FetchProfileResponse, Error>
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.profiles, QUERY_KEYS.me],

    queryFn: async () => {
      console.log("fetch 사용자 프로필 조회");
      return memberService.fetchProfile();
    },

    ...options,
  });
};

// 회원 검색 쿼리
export const useSearchMembersQuery = (
  name: string,
  options?: UseQueryOptions<MemberSearchResult[], Error>
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.members, QUERY_KEYS.search, name],

    queryFn: async () => {
      console.log("회원 검색:", name);
      return memberService.searchMembers(name);
    },

    enabled: name.length > 0,
    staleTime: 0,
    gcTime: 0,

    ...options,
  });
};
