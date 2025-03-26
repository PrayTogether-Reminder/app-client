import { PrayerCreationItem } from "../PrayerCreationItem";

export interface CreatePrayerRequest {
  prayers: {
    title: string;
    contents: PrayerCreationItem[];
  };
}
