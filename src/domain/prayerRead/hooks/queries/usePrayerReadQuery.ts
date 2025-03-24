import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import PrayerReadService from "../../services/prayerReadService";
import QUERY_KEYS from "../../../../common/hooks/queries/queryKeys";
import { PrayerContent } from "../../types/response/prayerContent";

export const usePrayerContentsQuery = (
  titleId: number | null,
  options?: UseQueryOptions<PrayerContent[], Error>
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.prayerTitles, titleId, QUERY_KEYS.prayerContents],

    queryFn: async () => {
      console.log("fetch 기도 내용 = title Id:", titleId);
      return PrayerReadService.fetchPrayerContents(titleId);
    },

    // titleId가 null이면 쿼리를 실행하지 않음
    enabled: titleId !== null,

    ...options,
  });
};
