import apiService from "../../../common/apis/apiService";
import api, { ApiResponse } from "../../../common/apis/api";
import { PrayerContent } from "../types/response/prayerContent";

const prayerReadService = {
  fetchPrayerContents: async (titleId: number | null) => {
    const response = await apiService.get<{ prayerContents: PrayerContent[] }>(
      `/prayers/${titleId}/contents`
    );
    return response.data.prayerContents ?? [];
  },
};

export default prayerReadService;
