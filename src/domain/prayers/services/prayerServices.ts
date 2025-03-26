import apiService from "../../../common/apis/apiService";
import { ApiResponse } from "../../../common/apis/api";
import type { PrayerCreationItem } from "../types/PrayerCreationItem";
import { CreatePrayerRequest } from "../types/request/createPrayerRequest";
import { MessageResponse } from "../../../common/types/messageResponse";
import { PrayerTitle } from "../types/prayerTitle";
import { FetchPrayerTitlesResponse } from "../types/response/fetchPrayerTitlesResponse";
import type { FetchPrayerContentsResponse } from "../types/response/fetchPrayerContentsResponse";
import { PrayerUpdateItem } from "../types/prayerUpdateItem";
import { UpdatePrayerRequest } from "../types/request/updatePrayerRequest";

export const prayerService = {
  // 기도 제목 작성
  create: async (
    title: string,
    prayerList: PrayerCreationItem[]
  ): Promise<MessageResponse> => {
    const response: MessageResponse =
      await apiService.post<CreatePrayerRequest>(`/prayers`, {
        prayers: {
          title,
          contents: prayerList,
        },
      } as CreatePrayerRequest);
    console.log("API response=", response.message);
    return response;
  },
  // 기도 제목 무한 스크롤 조회
  fetchTitles: async (roomId: number | null, after: string = "0") => {
    const response = await apiService.get<FetchPrayerTitlesResponse>(
      "/prayers",
      {
        roomId,
        after,
      }
    );
    return response.data.prayerTitles;
  },
  // 기도 내용 조회
  fetchContents: async (titleId: number | null) => {
    const response = await apiService.get<FetchPrayerContentsResponse>(
      `/prayers/${titleId}/contents`
    );
    return response.data.prayerContents ?? [];
  },
  // 기도 제목 변경
  update: async (
    prayerTitleId: number | null,
    title: string,
    prayerList: PrayerUpdateItem[]
  ): Promise<MessageResponse> => {
    const response: MessageResponse = await apiService.put<UpdatePrayerRequest>(
      `/prayers/${prayerTitleId}`,
      {
        prayers: {
          title,
          contents: prayerList,
        },
      } as UpdatePrayerRequest
    );
    console.log("API response=", response.message);
    return response;
  },
};
