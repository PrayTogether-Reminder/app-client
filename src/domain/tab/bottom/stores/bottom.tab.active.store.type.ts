import {
  BottomTabActive,
  BottomTabActiveType,
} from "../types/bottom.tab.active.type";

export interface BottomTabActiveState {
  bottomTabActive: BottomTabActive;
}

export interface BottomTabActiveAction {
  setTabActive: (value: BottomTabActiveType) => void;
}

export type BottomTabActiveStore = BottomTabActiveState & BottomTabActiveAction;
