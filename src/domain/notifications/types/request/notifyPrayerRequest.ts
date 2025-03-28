import { NOTIFICATION_TYPE } from "../../constants/notificationType";

export interface NotifyPrayerRequest {
  prayerTitleId: number | null;
  roomId: number | null;
  type: NOTIFICATION_TYPE;
}
