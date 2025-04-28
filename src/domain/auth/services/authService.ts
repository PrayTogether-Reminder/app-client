import apiService from "@/common/apis/apiService";
import { MessageResponse } from "@/common/types/messageResponse";
import { OtpEmailRequest } from "../types/request/otpEmailRequest";

export const authService = {
  // 이메일 OTP 요청 API
  requestOtpByEmail: async (email: string): Promise<MessageResponse> => {
    const response = await apiService.post<MessageResponse>(`/otp/email`, {
      email,
    } as OtpEmailRequest);
    return response;
  },
};
