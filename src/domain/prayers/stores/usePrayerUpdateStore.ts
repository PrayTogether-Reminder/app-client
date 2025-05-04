import { create } from "zustand";
import {
  PrayerUpdateStore,
  PrayerUpdateState,
} from "../types/prayerUpdateStore";
import { PrayerUpdateItem } from "../types/prayerUpdateItem";

const initialState: PrayerUpdateState = {
  prayerList: [],
};

export const usePrayerUpdateStore = create<PrayerUpdateStore>((set, get) => ({
  // state
  ...initialState,

  // actions
  add: (prayer: PrayerUpdateItem) =>
    set((state) => ({
      prayerList: [prayer, ...state.prayerList],
    })),

  delete: (prayer: PrayerUpdateItem) =>
    set((state) => ({
      prayerList: state.prayerList.filter(
        (p) =>
          p.memberName !== prayer.memberName && p.memberId !== prayer.memberId
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
  clear: () => set(initialState),
}));
