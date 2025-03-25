import apiService from "../../../common/apis/apiService";
import type { MessageResponse } from "../../../common/types/messageResponse";
import { NotifyPrayerCompletionRequest } from "../../notifications/types/request/notifyPrayerCompletionRequest";

export const notificationService = {
  // 기도 완료 알림
  notifyPrayerCompletion: async ({
    prayerTitleId,
    roomId,
    type,
  }: NotifyPrayerCompletionRequest) => {
    const response = await apiService.post<MessageResponse>(`/notifications`, {
      prayerTitleId,
      roomId,
      type,
    } as NotifyPrayerCompletionRequest);
    return response.data;
  },
};
