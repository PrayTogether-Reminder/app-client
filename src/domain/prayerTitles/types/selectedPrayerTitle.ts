import { PrayerTitle } from "../types/dto/response/prayerTitle";

export interface SelectedPrayerTitle {
  selectedPrayerTitle: PrayerTitle | null;
}

export interface SelectedPrayerTitleAction {
  select: (prayerTitle: PrayerTitle) => void;
  reset: () => void;
}

export type SelectedPrayerTitleStore = SelectedPrayerTitle &
  SelectedPrayerTitleAction;
