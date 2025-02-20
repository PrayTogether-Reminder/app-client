import { create } from "zustand";
import { BottomTabActiveStore } from "./BottomTabActiveStoreType";
import {
  BottomTabActiveStatus,
  BottomTabActiveType,
} from "../types/BottomTabActiveType";

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
