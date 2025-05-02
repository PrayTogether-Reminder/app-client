import type { PrayerContentBase } from "./prayerContentBase";

export interface PrayerContent extends PrayerContentBase {
  id: number;
  memberId: number | null;
  memberName: string;
  content: string;
}
