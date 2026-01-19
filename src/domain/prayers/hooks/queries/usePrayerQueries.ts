import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { prayerService } from "../../services/prayerServices";
import QUERY_KEYS from "../../../../common/constants/queryKeys";
import { FetchPrayerTitlesParams } from "../../types/params/fetchPrayerTitlesParams";
import { PrayerTitle } from "../../types/prayerTitle";
import { PrayerContent } from "../../types/prayerContent";

// 기도 제목 무한 스크롤 쿼리
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
        param.after,
        ")"
      );
      return prayerService.fetchTitles(param.roomId, param.after);
    },

    initialPageParam: {
      roomId,
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

// 기도문 조회 쿼리
export const usePrayerContentsQuery = (
  roomId: number | null,
  titleId: number | null,
  options?: UseQueryOptions<PrayerContent[], Error>
) => {
  return useQuery({
    queryKey: [
      QUERY_KEYS.rooms,
      roomId,
      QUERY_KEYS.prayerTitles,
      titleId,
      QUERY_KEYS.prayerContents,
    ],

    queryFn: async () => {
      console.log("fetch 기도문: prayer title Id=", titleId);
      if (!titleId) {
        return [];
      }
      return prayerService.fetchContents(titleId);
    },

    // titleId가 null이면 쿼리를 실행하지 않음
    enabled: titleId !== null,

    ...options,
  });
};
