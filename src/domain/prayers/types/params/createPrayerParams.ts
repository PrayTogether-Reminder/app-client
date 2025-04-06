import { PrayerCreationItem } from "./../PrayerCreationItem";

export interface CreatePrayerParams {
  roomId: number;
  title: string;
  prayerList: PrayerCreationItem[];
}
