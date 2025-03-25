import { NOTIFICATION_TYPE } from "../../../../common/constants/notificationType";

export interface NotifyPrayerCompletionRequest {
  prayerTitleId: number | null;
  roomId: number | null;
  type: NOTIFICATION_TYPE;
}
