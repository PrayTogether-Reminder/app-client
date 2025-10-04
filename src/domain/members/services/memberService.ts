import apiService from "../../../common/apis/apiService";
import { FetchProfileResponse } from "../types/response/fetchProfileResponse";

export const memberService = {
  // 사용자 프로필 단일 정보 조회
  fetchProfile: async () => {
    const response = await apiService.get<FetchProfileResponse>(`/v1/members/me`);
    return response.data;
  },
};
