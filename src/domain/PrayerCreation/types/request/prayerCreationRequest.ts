import { PrayerCreationItem } from "../PrayerCreationItem";

export interface PrayerCreationRequest {
  prayers: {
    title: string;
    contents: PrayerCreationItem[];
  };
}
