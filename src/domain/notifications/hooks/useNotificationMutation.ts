import { useMutation } from "@tanstack/react-query";
import { notificationService } from "../services/ntificationService";
import type { RegisterFcmTokenRequest } from "../types/registerFcmTokenDto";
import { Alert } from "react-native";

// Fcm Token 등록 API 호출
export const useRegisterFcmTokenMutation = () => {
  return useMutation({
    mutationFn: ({ fcmToken }: RegisterFcmTokenRequest) =>
      notificationService.registerFcmToken(fcmToken),
    onSuccess: () => {},
    onError: (error) => {
      Alert.alert(error.message);
    },
  });
};
