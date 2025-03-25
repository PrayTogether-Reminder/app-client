import { PrayerCreationItem } from "./PrayerCreationItem";

export interface PrayerCreationState {
  prayerList: PrayerCreationItem[];
}

export interface PrayerCreationActions {
  add: (prayer: PrayerCreationItem) => void;
  delete: (prayer: PrayerCreationItem) => void;
  update: (prayer: PrayerCreationItem) => void;
  clear: () => void;
}

export interface PrayerCreationStore
  extends PrayerCreationState,
    PrayerCreationActions {}
