import { PrayerCreationItem } from "../PrayerCreationItem";

export interface CreatePrayerRequest {
  title: string;
  contents: PrayerCreationItem[];
}
