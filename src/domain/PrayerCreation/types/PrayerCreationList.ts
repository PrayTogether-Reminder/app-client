import { PrayerCreationItem } from "./PrayerCreationItem";

export interface PrayerCreationList {
  prayerList: PrayerCreationItem[];
  add: (prayer: PrayerCreationItem) => void;
  delete: (prayer: PrayerCreationItem) => void;
  update: (prayer: PrayerCreationItem) => void;
  clear: () => void;
}
