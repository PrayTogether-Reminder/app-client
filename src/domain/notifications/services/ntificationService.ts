import type { RegisterFcmTokenRequest } from "../types/registerFcmTokenDto";
import apiService from "@/common/apis/apiService";

export const notificationService = {
  // fcm 토큰 등록
  registerFcmToken: async (fcmToken: string): Promise<void> => {
    const response = await apiService.post<RegisterFcmTokenRequest>(
      `/notifications/fcm-token`,
      {
        fcmToken,
      } as RegisterFcmTokenRequest
    );
    console.log("Register Fcm Token API response=", response.message);
  },
};
