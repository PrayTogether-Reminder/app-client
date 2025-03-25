import apiService from "../../../common/apis/apiService";
import { ApiResponse } from "../../../common/apis/api";
import type { PrayerCreationItem } from "../types/PrayerCreationItem";
import { CreatePrayerRequest } from "../types/request/createPrayerRequest";
import { MessageResponse } from "../../../common/types/messageResponse";

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
};
