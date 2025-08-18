import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../../services/authService";
import type { LoginRequest } from "../../types/request/loginRequest";
import type { LogoutRequest } from "../../types/request/logoutRequest";
import type { SignupRequest } from "../../types/request/signupRequest";
import type { VerifyOtpRequest } from "../../types/request/verifyOtpRequest";
import { showAlert } from "@/common/components/modal/stores/useAlertStore";

export const useOtpEmailRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (email: string) => authService.requestOtpByEmail(email),
    onError: (error, email, context) => {
      showAlert({
        title: "에러",
        message: error.message,
        icon: "alert-circle",
      });
    },
    onSuccess: (data) => {
      showAlert({
        title: "성공",
        message: data.message,
        icon: "check-circle",
      });
    },
  });
};

export const useOtpVerifyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, otp }: VerifyOtpRequest) =>
      authService.verifyOtpByEmail(email, otp),
    onSuccess: (data) => {
      showAlert({
        title: "인증 성공",
        message: data.message,
        icon: "check-circle",
      });
    },
    onError: (error, requests, context) => {
      showAlert({
        title: "인증 실패",
        message: error.message,
        icon: "alert-circle",
      });
    },
  });
};

export const useSignupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, email, password }: SignupRequest) =>
      authService.signup(name, email, password),
    onSuccess: (data) => {
      showAlert({
        title: "회원가입 성공",
        message: data.message,
        icon: "account-check",
      });
    },
    onError: (error, requests, context) => {
      showAlert({
        title: "회원가입 실패",
        message: error.message,
        icon: "account-alert",
      });
    },
  });
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: ({ email, password }: LoginRequest) =>
      authService.login(email, password),
    onError: (error, requests, context) => {
      showAlert({
        title: "로그인 실패",
        message: error.message,
        icon: "login-variant",
      });
    },
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: ({ refreshToken }: LogoutRequest) =>
      authService.logout(refreshToken),
    onError: (error, requests, context) => {
      console.error("로그아웃 실패:", error);
      showAlert({
        title: "로그아웃 실패",
        message: error.message,
        icon: "logout-variant",
      });
    },
  });
};

export const useDeleteAccountMutation = () => {
  return useMutation({
    mutationFn: () => authService.deleteAccount(),
    onError: (error, requests, context) => {
      console.error("회원 탈퇴 실패:", error);
      showAlert({
        title: "회원 탈퇴 실패",
        message: error.message,
        icon: "account-remove",
      });
    },
  });
};
