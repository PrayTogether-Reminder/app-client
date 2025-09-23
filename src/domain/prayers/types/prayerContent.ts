import type { PrayerContentBase } from "./prayerContentBase";

export interface PrayerContent extends PrayerContentBase {
  id: number;
  writerId: number;
  writerName: string;
  memberId: number;
  memberName: string;
  content: string;
}
