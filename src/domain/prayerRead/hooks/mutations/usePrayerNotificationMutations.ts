import { useMutation, useQueryClient } from "@tanstack/react-query";
import QUERY_KEYS from "../../../../common/hooks/queries/queryKeys";
import { ApiError } from "../../../../common/apis/api";
import { Alert } from "react-native";
import type { NotificationRequest } from "../../types/request/notificationRequest";
import prayerNotificationService from "./../../services/prayerNotificationService";

// 기도 완료 알림
export const usePrayerNotificationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ prayerTitleId, roomId, type }: NotificationRequest) => {
      return prayerNotificationService.notifyPrayerCompletion({
        prayerTitleId,
        roomId,
        type,
      });
    },
    onError: (error: ApiError, variables, context) => {
      Alert.alert(error.message);
    },
    onSuccess: (data, variables) => {
      Alert.alert(data.message);
    },
  });
};
