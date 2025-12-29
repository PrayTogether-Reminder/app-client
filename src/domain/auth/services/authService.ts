import apiService from "@/common/apis/apiService";
import { MessageResponse } from "@/common/types/messageResponse";
import { OtpEmailRequest } from "../types/request/otpEmailRequest";
import { VerifyOtpRequest } from "../types/request/verifyOtpRequest";
import type { SignupRequest } from "../types/request/signupRequest";
import type { LoginResponse } from "../types/response/loginResponse";
import type { LoginRequest } from "../types/request/loginRequest";
import type { LogoutRequest } from "../types/request/logoutRequest";
import type { ReissuePasswordRequest } from "../types/request/reissuePasswordRequest";
import type { ChangePasswordRequest } from "../types/request/changePasswordRequest";
import type { GoogleAuthRequest } from "../types/request/googleAuthRequest";
import type { GoogleAuthResponse } from "../types/response/googleAuthResponse";
import type { GoogleSignupRequest } from "../types/request/googleSignupRequest";

export const authService = {
  // 이메일 OTP 요청 API
  requestOtpByEmail: async (email: string): Promise<MessageResponse> => {
    const response = await apiService.post<MessageResponse>(
      `/v1/auth/otp/email`,
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
      `/v1/auth/otp/email/verification`,
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
    password: string,
    phoneNumber: string
  ): Promise<MessageResponse> => {
    const response = await apiService.post<MessageResponse>(`/v1/auth/signup`, {
      name,
      email,
      password,
      phoneNumber,
    } as SignupRequest);
    return response;
  },

  // 로그인
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiService.post<LoginResponse>(`/v1/auth/login`, {
      email,
      password,
    } as LoginRequest);
    return response.data;
  },

  // 로그아웃
  logout: async (refreshToken: string): Promise<void> => {
    const response = await apiService.post<LoginResponse>(`/v1/auth/logout`, {
      refreshToken,
    } as LogoutRequest);
  },

  // 회원 탈퇴
  deleteAccount: async (): Promise<MessageResponse> => {
    const response = await apiService.delete<MessageResponse>(`/v1/auth/withdraw`);
    return response;
  },

  // 비밀번호 재발급
  reissuePassword: async (email: string): Promise<MessageResponse> => {
    const response = await apiService.post<MessageResponse>(
      `/v1/auth/reissue-password`,
      {
        email,
      } as ReissuePasswordRequest
    );
    return response;
  },

  // 비밀번호 변경
  changePassword: async (newPassword: string): Promise<MessageResponse> => {
    const response = await apiService.patch<MessageResponse>(
      `/v1/auth/password`,
      {
        newPassword,
      } as ChangePasswordRequest
    );
    return response;
  },

  // Google OAuth 인증 확인
  // 기존 회원이면 JWT 발급, 신규 회원이면 isNewUser: true 반환
  googleAuth: async (
    idToken: string,
    email: string,
    name: string | null
  ): Promise<GoogleAuthResponse> => {
    const response = await apiService.post<GoogleAuthResponse>(`/v1/auth/google`, {
      idToken,
      email,
      name,
    } as GoogleAuthRequest);
    return response.data;
  },

  // Google OAuth 신규 회원가입 (전화번호 포함)
  googleSignup: async (
    idToken: string,
    email: string,
    name: string | null,
    phoneNumber: string
  ): Promise<LoginResponse> => {
    const response = await apiService.post<LoginResponse>(`/v1/auth/google/signup`, {
      idToken,
      email,
      name,
      phoneNumber,
    } as GoogleSignupRequest);
    return response.data;
  },
};
