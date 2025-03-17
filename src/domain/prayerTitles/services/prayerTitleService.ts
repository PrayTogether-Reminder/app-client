import apiService from "../../../common/apis/apiService";
import api, { ApiResponse } from "../../../common/apis/api";
import { PrayerTitle } from "../types/dto/response/prayerTitle";

const prayerTitleService = {
  fetchPrayerTitles: async (roomId: string, after: string = "0") => {
    const response = await apiService.get<{ prayerTitles: PrayerTitle[] }>(
      "/prayers",
      {
        roomId,
        after,
      }
    );
    return response.data.prayerTitles;
  },
};

export default prayerTitleService;
