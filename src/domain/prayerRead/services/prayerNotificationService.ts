import apiService from "../../../common/apis/apiService";
import type { MessageResponse } from "../../../common/types/messageResponse";
import { NotificationRequest } from "../types/request/notificationRequest";

const prayerNotificationService = {
  notifyPrayerCompletion: async ({
    prayerTitleId,
    roomId,
    type,
  }: NotificationRequest) => {
    const response = await apiService.post<MessageResponse>(`/notifications`, {
      prayerTitleId,
      roomId,
      type,
    } as NotificationRequest);
    return response.data;
  },
};

export default prayerNotificationService;
