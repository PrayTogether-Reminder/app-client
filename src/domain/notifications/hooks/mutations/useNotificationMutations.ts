import { useMutation, useQueryClient } from "@tanstack/react-query";
import QUERY_KEYS from "../../../../common/constants/queryKeys";
import { ApiError } from "../../../../common/apis/api";
import { Alert } from "react-native";
import { NotifyPrayerCompletionRequest } from "../../../notifications/types/request/notifyPrayerCompletionRequest";
import { notificationService } from "../../services/notificationService";

// 기도 완료 알림
export const usePrayerNotificationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      prayerTitleId,
      roomId,
      type,
    }: NotifyPrayerCompletionRequest) => {
      return notificationService.notifyPrayerCompletion({
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
