import { PrayerUpdateItem } from "../prayerUpdateItem";

export interface UpdatePrayerRequest {
  prayers: {
    title: string;
    contents: PrayerUpdateItem[];
  };
}
