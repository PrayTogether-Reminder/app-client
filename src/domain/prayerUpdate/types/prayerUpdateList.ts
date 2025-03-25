import { PrayerUpdateItem } from "./prayerUpdateItem";

export interface PrayerUpdateList {
  prayerList: PrayerUpdateItem[];
  add: (prayer: PrayerUpdateItem) => void;
  delete: (prayer: PrayerUpdateItem) => void;
  update: (prayer: PrayerUpdateItem) => void;
  set: (prayers: PrayerUpdateItem[]) => void;
  clear: () => void;
}
