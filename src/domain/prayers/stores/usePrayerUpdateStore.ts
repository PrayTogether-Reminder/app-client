import { create } from "zustand";
import { PrayerUpdateStore } from "../types/prayerUpdateStore";
import { PrayerUpdateItem } from "../types/prayerUpdateItem";

export const usePrayerUpdateStore = create<PrayerUpdateStore>((set, get) => ({
  // state
  prayerList: [],

  // actions
  add: (prayer: PrayerUpdateItem) =>
    set((state) => ({
      prayerList: [prayer, ...state.prayerList],
    })),

  delete: (prayer: PrayerUpdateItem) =>
    set((state) => ({
      prayerList: state.prayerList.filter(
        (p) =>
          p.memberId !== prayer.memberId && p.memberName !== prayer.memberName
      ),
    })),
  update: (prayer: PrayerUpdateItem) =>
    set((state) => ({
      prayerList: state.prayerList.map((p) =>
        p.memberId === prayer.memberId && p.memberName == prayer.memberName
          ? { ...p, ...prayer }
          : p
      ),
    })),
  set: (prayers: PrayerUpdateItem[]) =>
    set((steat) => ({
      prayerList: prayers,
    })),
  clear: () => set({ prayerList: [] }),
}));
