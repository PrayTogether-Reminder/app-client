import { create } from "zustand";
import {
  SelectedPrayerTitleStore,
  SelectedPrayerTitleState,
} from "../types/selectedPrayerTitleStore";
import { PrayerTitle } from "../types/prayerTitle";

const initialState: SelectedPrayerTitleState = {
  selectedPrayerTitle: null,
};

export const useSelectedPrayerTitleStore = create<SelectedPrayerTitleStore>(
  (set, get) => ({
    ...initialState,

    select: (prayerTitle: PrayerTitle) =>
      set({ selectedPrayerTitle: prayerTitle }),

    reset: () => set(initialState),
  })
);
