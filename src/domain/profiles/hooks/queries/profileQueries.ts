import QUERY_KEYS from "./../../../../common/constants/queryKeys";
import { profileService } from "../../services/profileService";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";

// 사용자 프로필 조회 쿼리
export const useProfileQuery = (
  options?: UseQueryOptions<FetchProfileResponse, Error>
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.profiles, QUERY_KEYS.me],

    queryFn: async () => {
      console.log("fetch 사용자 프로필 조회");
      return profileService.fetch();
    },

    ...options,
  });
};
