import { PrayerCreationItem } from "../PrayerCreationItem";

export interface CreatePrayerRequest {
  roomId: number;
  title: string;
  contents: PrayerCreationItem[];
}
