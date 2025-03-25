import { create } from "zustand";
import { SelectedPrayerTitleStore } from "../types/selectedPrayerTitle";
import { SelectedPrayerTitle } from "../types/selectedPrayerTitle";
import { PrayerTitle } from "../types/dto/response/prayerTitle";

const initialState: SelectedPrayerTitle = {
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
