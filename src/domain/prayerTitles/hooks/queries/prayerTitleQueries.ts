import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import PrayerTitlesService from "../../services/prayerTitleService";
import QUERY_KEYS from "../../../../common/hooks/queries/queryKeys";
import { PrayerTitle } from "../../types/dto/response/prayerTitle";

type PrayerTitlePageParam = {
  roomId: number | null;
  after: string;
};

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
      const param = pageParam as PrayerTitlePageParam;
      console.log(
        "fetch 기도 제목 = roomId:",
        param.roomId,
        " after:",
        param.after
      );
      return PrayerTitlesService.fetchPrayerTitles(param.roomId, param.after);
    },

    initialPageParam: {
      roomId: null,
      after: "0",
    } as PrayerTitlePageParam,

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
