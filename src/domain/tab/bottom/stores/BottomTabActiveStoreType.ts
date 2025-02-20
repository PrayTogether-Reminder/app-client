import {
  BottomTabActive,
  BottomTabActiveType,
} from "../types/bottomTabActiveType";

export interface BottomTabActiveState {
  bottomTabActive: BottomTabActive;
}

export interface BottomTabActiveAction {
  setTabActive: (value: BottomTabActiveType) => void;
}

export type BottomTabActiveStore = BottomTabActiveState & BottomTabActiveAction;
