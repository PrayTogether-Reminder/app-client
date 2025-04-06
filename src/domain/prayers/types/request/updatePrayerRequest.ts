import { PrayerUpdateItem } from "../prayerUpdateItem";

export interface UpdatePrayerRequest {
  title: string;
  contents: PrayerUpdateItem[];
}
