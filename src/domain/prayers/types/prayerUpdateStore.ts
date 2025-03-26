import { PrayerUpdateItem } from "./prayerUpdateItem";

export interface PrayerUpdateState {
  prayerList: PrayerUpdateItem[];
}

export interface PrayerUpdateActions {
  add: (prayer: PrayerUpdateItem) => void;
  delete: (prayer: PrayerUpdateItem) => void;
  update: (prayer: PrayerUpdateItem) => void;
  set: (prayers: PrayerUpdateItem[]) => void;
  clear: () => void;
}

export interface PrayerUpdateStore
  extends PrayerUpdateState,
    PrayerUpdateActions {}
