import { PrayerUpdateItem } from "../prayerUpdateItem";

export interface PrayerUpdateRequest {
  prayers: {
    title: string;
    contents: PrayerUpdateItem[];
  };
}
