import apiService from "../../../common/apis/apiService";
import { ApiResponse } from "../../../common/apis/api";
import type { PrayerCreationItem } from "../types/PrayerCreationItem";
import { CreatePrayerRequest } from "../types/request/createPrayerRequest";
import { MessageResponse } from "../../../common/types/messageResponse";
import { PrayerTitle } from "../types/prayerTitle";
import { FetchPrayerTitlesResponse } from "../types/response/fetchPrayerTitlesResponse";
import type { FetchPrayerContentsResponse } from "../types/response/fetchPrayerContentsResponse";
import { CreatePrayerCompletionRequest } from "../types/request/createPrayerCompletionRequest";

export const prayerService = {
  // 기도 제목만 생성
  createTitle: async (
    roomId: number,
    title: string
  ): Promise<MessageResponse> => {
    const response: MessageResponse =
      await apiService.post<CreatePrayerRequest>(`/prayers`, {
        roomId,
        title,
        contents: [],
      } as CreatePrayerRequest);
    console.log("API response=", response.message);
    return response;
  },
  // 기도 제목 작성
  create: async (
    roomId: number,
    title: string,
    prayerList: PrayerCreationItem[]
  ): Promise<MessageResponse> => {
    const response: MessageResponse =
      await apiService.post<CreatePrayerRequest>(`/prayers`, {
        roomId,
        title,
        contents: prayerList,
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
  // 기도 제목만 수정
  updateTitle: async (
    prayerTitleId: number | null,
    title: string
  ): Promise<MessageResponse> => {
    const response: MessageResponse = await apiService.put(
      `/prayers/${prayerTitleId}/title`,
      { title }
    );
    return response;
  },
  
  // 기도 내용 추가
  createContent: async (
    prayerTitleId: number | null,
    memberName: string,
    content: string
  ): Promise<MessageResponse> => {
    const response: MessageResponse = await apiService.post(
      `/prayers/${prayerTitleId}/contents`,
      { memberName, content }
    );
    return response;
  },
  
  // 기도 내용 수정
  updateContent: async (
    prayerTitleId: number | null,
    contentId: number | null,
    content: string
  ): Promise<MessageResponse> => {
    const response: MessageResponse = await apiService.put(
      `/prayers/${prayerTitleId}/contents/${contentId}`,
      { content }
    );
    return response;
  },
  
  // 기도 내용 삭제
  deleteContent: async (
    prayerTitleId: number | null,
    contentId: number | null
  ): Promise<MessageResponse> => {
    const response: MessageResponse = await apiService.delete(
      `/prayers/${prayerTitleId}/contents/${contentId}`
    );
    return response;
  },

  // 기도 완료 알림
  completePrayer: async ({ prayerTitleId, roomId }: CreatePrayerCompletionRequest) => {
    const response = await apiService.post<MessageResponse>(
      `/prayers/${prayerTitleId}/completion`,
      {
        roomId,
      }
    );
    return response.data;
  },
};
