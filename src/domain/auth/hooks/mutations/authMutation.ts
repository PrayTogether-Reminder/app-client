import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import QUERY_KEYS from "../../../../common/constants/queryKeys";
import { authService } from "./../../services/authService";
import type { VerifyOtpRequest } from "../../types/request/verifyOtpRequest";

export const useOtpEmailRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (email: string) => authService.requestOtpByEmail(email),
    onError: (error, email, context) => {
      Alert.alert("인증 메일 발송에 실패했습니다.");
    },
    onSuccess: () => {
      Alert.alert("인증 메일이 발송되었습니다.");
    },
  });
};

export const useOtpVerifyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, otp }: VerifyOtpRequest) =>
      authService.verifyOtpByEmail(email, otp),
    onSuccess: () => {
      Alert.alert("OTP 인증에 성공했습니다.");
    },
    onError: (error, requests, context) => {
      Alert.alert("OTP 인증에 실패했습니다.");
    },
  });
};
