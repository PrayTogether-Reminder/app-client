import {
  useQuery,
  useInfiniteQuery,
  UseQueryOptions,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { invitationService } from "../../services/invitationServices";
import { Invitation } from "../../types/Intivation";
import QUERY_KEYS from "../../../../common/constants/queryKeys";

// 초대 목록 조회
export const useInviationsQuery = (
  options?: UseQueryOptions<Invitation[], Error>
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.invitations],
    queryFn: async () => {
      console.log("API: fetch invitations");
      return invitationService.fetch();
    },
  });
};
