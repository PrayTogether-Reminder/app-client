import { PrayerTitle } from "./prayerTitle";

export interface SelectedPrayerTitle {
  selectedPrayerTitle: PrayerTitle | null;
}

export interface SelectedPrayerTitleAction {
  select: (prayerTitle: PrayerTitle) => void;
  reset: () => void;
}

export type SelectedPrayerTitleStore = SelectedPrayerTitle &
  SelectedPrayerTitleAction;
