import apiService from "@/common/apis/apiService";
import { AppVersionInfoResponse } from "../types/appVersion";

export const appVersionApi = {
  // 앱 버전 정보 조회
  fetchVersionInfo: async (): Promise<AppVersionInfoResponse> => {
    try {
      const response = await apiService.get<AppVersionInfoResponse>("/v1/app-versions");
      return response.data;
    } catch (error) {
      console.error('Error fetching version info:', error);
      // 에러 시 기본값 반환
      return {
        minimumAppVersion: '1.0.0',
        forceUpdateAppVersion: '1.0.0',
        maintenanceMode: false,
      };
    }
  },
};