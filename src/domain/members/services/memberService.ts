import apiService from "../../../common/apis/apiService";

export const memberService = {
  // 사용자 프로필 단일 정보 조회
  fetchProfile: async () => {
    const response = await apiService.get<FetchProfileResponse>(`/members/me`);
    return response.data;
  },
};
