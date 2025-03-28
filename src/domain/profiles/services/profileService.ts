import apiService from "../../../common/apis/apiService";
import type { MessageResponse } from "../../../common/types/messageResponse";
import { NotifyPrayerRequest } from "../../notifications/types/request/notifyPrayerRequest";

export const profileService = {
  // 사용자 프로필 단일 정보 조회
  fetch: async () => {
    const response = await apiService.get<FetchProfileResponse>(`/profiles/me`);
    return response.data;
  },
};
