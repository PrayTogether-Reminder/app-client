import apiService from "../../../common/apis/apiService";
import { ApiResponse } from "../../../common/apis/api";
import type { PrayerUpdateItem } from "../types/prayerUpdateItem";
import { PrayerUpdateRequest } from "../types/request/prayerUpdateRequest";
import { MessageResponse } from "../../../common/types/messageResponse";

const prayerUpdateService = {
  // 기도 제목 변경
  createPrayers: async (
    prayerTitleId: number | null,
    title: string,
    prayerList: PrayerUpdateItem[]
  ): Promise<MessageResponse> => {
    const response: MessageResponse = await apiService.put<PrayerUpdateRequest>(
      `/prayers/${prayerTitleId}`,
      {
        prayers: {
          title,
          contents: prayerList,
        },
      } as PrayerUpdateRequest
    );
    console.log("API response=", response.message);
    return response;
  },
};

export default prayerUpdateService;
