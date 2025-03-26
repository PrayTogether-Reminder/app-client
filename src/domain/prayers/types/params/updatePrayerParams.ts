import { PrayerUpdateItem } from "./../prayerUpdateItem";

export interface UpdatePrayerParams {
  roomId: number | null;
  prayerTitleId: number | null;
  title: string;
  prayerList: PrayerUpdateItem[];
}
