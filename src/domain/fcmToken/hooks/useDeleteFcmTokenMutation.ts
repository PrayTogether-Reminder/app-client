import { useMutation } from "@tanstack/react-query";
import { fcmTokenService } from "../services/fcmTokenService";

export const useDeleteFcmTokenMutation = () => {
  return useMutation({
    mutationFn: async (fcmToken: string) => {
      return await fcmTokenService.deleteFcmToken(fcmToken);
    },
    onError: (error) => {
      console.error("FCM 토큰 삭제 실패:", error);
    },
    onSuccess: () => {
      console.log("FCM 토큰 삭제 성공");
    },
  });
};