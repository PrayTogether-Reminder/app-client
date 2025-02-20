import { create } from "zustand";
import { BottomTabActiveStore } from "./bottomTabActiveStoreType";
import {
  BottomTabActiveStatus,
  BottomTabActiveType,
} from "../types/bottomTabActiveType";

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
