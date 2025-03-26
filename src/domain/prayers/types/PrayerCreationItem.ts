import type { PrayerContentBase } from "./prayerContentBase";

export interface PrayerCreationItem extends PrayerContentBase {
  memberId: number | null;
  memberName: string;
  content: string;
}
