import apiService from "../../../common/apis/apiService";
import type { MessageResponse } from "../../../common/types/messageResponse";
import { NotifyPrayerRequest } from "../../notifications/types/request/notifyPrayerRequest";

export const notificationService = {
  // 기도 완료 알림
  notifyPrayerCompletion: async ({
    prayerTitleId,
    roomId,
    type,
  }: NotifyPrayerRequest) => {
    const response = await apiService.post<MessageResponse>(`/notifications`, {
      prayerTitleId,
      roomId,
      type,
    } as NotifyPrayerRequest);
    return response.data;
  },
};
