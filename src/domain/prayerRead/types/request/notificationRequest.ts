import { NOTIFICATION_TYPE } from "../../constants/notificationType";

export interface NotificationRequest {
  prayerTitleId: number | null;
  roomId: number | null;
  type: NOTIFICATION_TYPE;
}
