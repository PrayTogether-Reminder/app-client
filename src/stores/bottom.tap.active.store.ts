import { create } from "zustand";
import { BottomTabActiveStore } from "../stores/bottom.tab.active.store.type";
import {
  BottomTabActiveStatus,
  BottomTabActiveType,
} from "../types/bottom.tab.active.type";

export const useBottomTabActiveStore = create<BottomTabActiveStore>(
  (set, get) => ({
    // state
    bottomTabActive: {
      status: BottomTabActiveStatus.ROOMS,
    },

    // actions
    setTabActive: (value: BottomTabActiveType) => {
      set(() => ({
        bottomTabActive: {
          status: value,
        },
      }));
    },
  })
);
