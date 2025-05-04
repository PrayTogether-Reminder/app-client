import { create } from "zustand";
import {
  PrayerCreationStore,
  PrayerCreationState,
} from "../types/PrayerCreationStore";
import { PrayerCreationItem } from "../types/PrayerCreationItem";

// 초기 상태 정의
const initialState: PrayerCreationState = {
  prayerList: [],
};

export const usePrayerCreationStore = create<PrayerCreationStore>(
  (set, get) => ({
    ...initialState,

    // actions
    add: (prayer: PrayerCreationItem) =>
      set((state) => ({
        prayerList: [prayer, ...state.prayerList],
      })),

    delete: (prayer: PrayerCreationItem) =>
      set((state) => ({
        prayerList: state.prayerList.filter(
          (p) =>
            p.memberId !== prayer.memberId && p.memberName !== prayer.memberName
        ),
      })),

    update: (prayer: PrayerCreationItem) =>
      set((state) => ({
        prayerList: state.prayerList.map((p) =>
          p.memberId === prayer.memberId && p.memberName === prayer.memberName
            ? { ...p, ...prayer }
            : p
        ),
      })),

    clear: () => set(initialState),
  })
);
