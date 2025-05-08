import type { RegisterFcmTokenRequest } from "../types/registerFcmTokenDto";
import apiService from "@/common/apis/apiService";

export const fcmTokenService = {
  // fcm 토큰 등록
  registerFcmToken: async (fcmToken: string): Promise<void> => {
    const response = await apiService.post<RegisterFcmTokenRequest>(
      `/fcm-token`,
      {
        fcmToken,
      } as RegisterFcmTokenRequest
    );
    console.log("Register Fcm Token API response=", response.message);
  },
};
