import apiService from "../../../common/apis/apiService";
import { FetchProfileResponse } from "../types/response/fetchProfileResponse";
import { SearchMembersResponse, MemberSearchResult } from "../types/response/searchMembersResponse";
import { UpdateMemberRequest } from "../types/request/updateMemberRequest";
import { MessageResponse } from "../../../common/types/messageResponse";

export const memberService = {
  // 사용자 프로필 단일 정보 조회
  fetchProfile: async () => {
    const response = await apiService.get<FetchProfileResponse>(`/v1/members/me`);
    return response.data;
  },

  // 회원 검색
  searchMembers: async (name: string): Promise<MemberSearchResult[]> => {
    const response = await apiService.get<SearchMembersResponse>(
      `/v1/members/search?name=${encodeURIComponent(name)}`
    );
    return response.data.members;
  },

  // 회원 정보 업데이트
  updateProfile: async (data: UpdateMemberRequest): Promise<MessageResponse> => {
    const response = await apiService.patch<MessageResponse>(`/v1/members/me`, data);
    return response;
  },
};
