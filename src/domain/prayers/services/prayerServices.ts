import apiService from "../../../common/apis/apiService";
import { ApiResponse } from "../../../common/apis/api";
import type { PrayerCreationItem } from "../types/PrayerCreationItem";
import { CreatePrayerRequest } from "../types/request/createPrayerRequest";
import { CreatePrayerContentRequest } from "../types/request/createPrayerContentRequest";
import { UpdatePrayerTitleRequest } from "../types/request/updatePrayerTitleRequest";
import { UpdatePrayerContentRequest } from "../types/request/updatePrayerContentRequest";
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
      await apiService.post<CreatePrayerRequest>(`/v1/prayers`, {
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
      await apiService.post<CreatePrayerRequest>(`/v1/prayers`, {
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
      "/v1/prayers",
      {
        roomId,
        after,
      }
    );
    return response.data.prayerTitles;
  },
  // 기도문 조회
  fetchContents: async (titleId: number) => {
    const response = await apiService.get<FetchPrayerContentsResponse>(
      `/v1/prayers/${titleId}/contents`
    );
    return response.data.prayerContents ?? [];
  },
  // 기도 제목 변경
  // 기도 제목만 수정
  updateTitle: async (
    prayerTitleId: number,
    title: string
  ): Promise<MessageResponse> => {
    const requestBody: UpdatePrayerTitleRequest = { changedTitle: title };
    const response: MessageResponse = await apiService.put(
      `/v1/prayers/${prayerTitleId}`,
      requestBody
    );
    return response;
  },

  // 기도문 추가
  createContent: async (
    prayerTitleId: number,
    memberName: string,
    content: string,
    memberId?: number | null
  ): Promise<MessageResponse> => {
    const requestBody: CreatePrayerContentRequest = { memberName, content };
    if (memberId !== undefined && memberId !== null) {
      requestBody.memberId = memberId;
    }
    const response: MessageResponse = await apiService.post(
      `/v1/prayers/${prayerTitleId}/contents`,
      requestBody
    );
    return response;
  },

  // 기도문 수정
  updateContent: async (
    prayerTitleId: number,
    contentId: number,
    content: string
  ): Promise<MessageResponse> => {
    const requestBody: UpdatePrayerContentRequest = { changedContent: content };
    const response: MessageResponse = await apiService.put(
      `/v1/prayers/${prayerTitleId}/contents/${contentId}`,
      requestBody
    );
    return response;
  },

  // 기도문 삭제
  deleteContent: async (
    prayerTitleId: number,
    contentId: number
  ): Promise<MessageResponse> => {
    const response: MessageResponse = await apiService.delete(
      `/v1/prayers/${prayerTitleId}/contents/${contentId}`
    );
    return response;
  },

  // 기도 완료 알림
  completePrayer: async ({ prayerTitleId, roomId }: CreatePrayerCompletionRequest) => {
    const response = await apiService.post<MessageResponse>(
      `/v1/prayers/${prayerTitleId}/completion`,
      {
        roomId,
      }
    );
    return response.data;
  },

  // 기도 제목 삭제
  deleteTitle: async (prayerTitleId: number): Promise<MessageResponse> => {
    const response: MessageResponse = await apiService.delete(
      `/v1/prayers/${prayerTitleId}`
    );
    return response;
  },
};
