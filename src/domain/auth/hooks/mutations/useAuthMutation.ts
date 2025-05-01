import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import QUERY_KEYS from "../../../../common/constants/queryKeys";
import { authService } from "../../services/authService";
import type { VerifyOtpRequest } from "../../types/request/verifyOtpRequest";
import type { SignupRequest } from "../../types/request/signupRequest";
import type { LoginRequest } from "../../types/request/loginRequest";

export const useOtpEmailRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (email: string) => authService.requestOtpByEmail(email),
    onError: (error, email, context) => {
      Alert.alert(error.message);
    },
    onSuccess: (data) => {
      Alert.alert(data.message);
    },
  });
};

export const useOtpVerifyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, otp }: VerifyOtpRequest) =>
      authService.verifyOtpByEmail(email, otp),
    onSuccess: (data) => {
      Alert.alert(data.message);
    },
    onError: (error, requests, context) => {
      Alert.alert(error.message);
    },
  });
};

export const useSignupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, email, password }: SignupRequest) =>
      authService.signup(name, email, password),
    onSuccess: (data) => {
      Alert.alert(data.message);
    },
    onError: (error, requests, context) => {
      Alert.alert(error.message);
    },
  });
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: ({ email, password }: LoginRequest) =>
      authService.login(email, password),
    onError: (error, requests, context) => {
      Alert.alert(error.message);
    },
  });
};
