import { create } from "zustand";
import { BottomNaviStatus } from "../types/bottomNaviStatus";
import { BottomNaviStatusStore } from "../types/bottomNaviStatusStore";

export const useBottomNaviStatusStore = create<BottomNaviStatusStore>(
  (set) => ({
    // state
    status: BottomNaviStatus.ROOMS,

    // actions
    set: (value: BottomNaviStatus) => {
      set(() => ({
        status: value,
      }));
    },
  })
);
