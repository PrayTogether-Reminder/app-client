import apiService from "../../../common/apis/apiService";
import { ApiResponse } from "../../../common/apis/api";
import type { PrayerCreationItem } from "../types/PrayerCreationItem";
import { PrayerCreationRequest } from "../types/request/prayerCreationRequest";
import { MessageResponse } from "../../../common/types/messageResponse";

const prayerCreationService = {
  // 기도 제목 작성
  createPrayers: async (
    title: string,
    prayerList: PrayerCreationItem[]
  ): Promise<MessageResponse> => {
    const response: MessageResponse =
      await apiService.post<PrayerCreationRequest>(`/prayers`, {
        prayers: {
          title,
          contents: prayerList,
        },
      } as PrayerCreationRequest);
    console.log("API response=", response.message);
    return response;
  },
};

export default prayerCreationService;
