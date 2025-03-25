import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { prayerService } from "../../services/prayerServices";
import QUERY_KEYS from "../../../../common/constants/queryKeys";
import { FetchPrayerTitlesParams } from "../../types/params/fetchPrayerTitlesParams";
import { PrayerTitle } from "../../types/prayerTitle";

export const useInfinitePrayerTitlesQuery = (
  roomId: number | null,
  after: string = "0",
  options?: UseInfiniteQueryOptions<PrayerTitle[], Error>
) => {
  return useInfiniteQuery({
    queryKey: [
      QUERY_KEYS.rooms,
      roomId,
      QUERY_KEYS.prayerTitles,
      QUERY_KEYS.infinite,
    ],

    queryFn: async ({ pageParam }) => {
      const param = pageParam as FetchPrayerTitlesParams;
      console.log(
        "fetch 기도 제목 목록 (roomId:",
        param.roomId,
        " after:",
        param.after
      );
      return prayerService.fetchTitles(param.roomId, param.after);
    },

    initialPageParam: {
      roomId: null,
      after: "0",
    } as FetchPrayerTitlesParams,

    getNextPageParam: (lastPage) => {
      if (lastPage.length === 0) return undefined;

      const lastItem = lastPage[lastPage.length - 1];
      return {
        roomId,
        after: lastItem.createdTime.toString(),
      };
    },

    ...options,
  });
};
