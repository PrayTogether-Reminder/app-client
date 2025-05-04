import { PrayerTitle } from "./prayerTitle";

export interface SelectedPrayerTitleState {
  selectedPrayerTitle: PrayerTitle | null;
}

export interface SelectedPrayerTitleAction {
  select: (prayerTitle: PrayerTitle) => void;
  clear: () => void;
}

export type SelectedPrayerTitleStore = SelectedPrayerTitleState &
  SelectedPrayerTitleAction;
