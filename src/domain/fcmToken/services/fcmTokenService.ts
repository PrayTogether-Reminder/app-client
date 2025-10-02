import type { RegisterFcmTokenRequest, DeleteFcmTokenRequest } from "../types/registerFcmTokenDto";
import apiService from "@/common/apis/apiService";

export const fcmTokenService = {
  // fcm 토큰 등록
  registerFcmToken: async (fcmToken: string): Promise<void> => {
    const response = await apiService.post<RegisterFcmTokenRequest>(
      `/v1/fcm-token`,
      {
        fcmToken,
      } as RegisterFcmTokenRequest
    );
    console.log("Register Fcm Token API response=", response.message);
  },

  // fcm 토큰 삭제
  deleteFcmToken: async (fcmToken: string): Promise<void> => {
    const response = await apiService.delete<DeleteFcmTokenRequest>(
      `/v1/fcm-token`,
      {
        data: {
          fcmToken,
        } as DeleteFcmTokenRequest
      }
    );
    console.log("Delete Fcm Token API response=", response.message);
  },
};
