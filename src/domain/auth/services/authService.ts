import apiService from "@/common/apis/apiService";
import { MessageResponse } from "@/common/types/messageResponse";
import { OtpEmailRequest } from "../types/request/otpEmailRequest";
import { VerifyOtpRequest } from "../types/request/verifyOtpRequest";
import type { SignupRequest } from "../types/request/signupRequest";
import { time } from "console";
import type { LoginResponse } from "../types/response/loginResponse";
import type { LoginRequest } from "../types/request/loginRequest";
import type { LogoutRequest } from "../types/request/logoutRequest";

export const authService = {
  // 이메일 OTP 요청 API
  requestOtpByEmail: async (email: string): Promise<MessageResponse> => {
    const response = await apiService.post<MessageResponse>(
      `/auth/otp/email`,
      {
        email,
      } as OtpEmailRequest,
      {
        timeout: 10000, // 10초
      }
    );
    return response;
  },

  // 이메일 OTP 검증 API
  verifyOtpByEmail: async (
    email: string,
    otp: string
  ): Promise<MessageResponse> => {
    const response = await apiService.post<MessageResponse>(
      `/auth/otp/email/verification`,
      {
        email,
        otp,
      } as VerifyOtpRequest
    );
    return response;
  },

  // 회원가입
  signup: async (
    name: string,
    email: string,
    password: string
  ): Promise<MessageResponse> => {
    const response = await apiService.post<MessageResponse>(`/auth/signup`, {
      name,
      email,
      password,
    } as SignupRequest);
    return response;
  },

  // 로그인
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiService.post<LoginResponse>(`/auth/login`, {
      email,
      password,
    } as LoginRequest);
    return response.data;
  },

  // 로그아웃
  logout: async (refreshToken: string): Promise<void> => {
    const response = await apiService.post<LoginResponse>(`/auth/logout`, {
      refreshToken,
    } as LogoutRequest);
  },
};
