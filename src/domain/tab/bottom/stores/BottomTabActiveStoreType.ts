import {
  BottomTabActive,
  BottomTabActiveType,
} from "../types/BottomTabActiveType";

export interface BottomTabActiveState {
  bottomTabActive: BottomTabActive;
}

export interface BottomTabActiveAction {
  setTabActive: (value: BottomTabActiveType) => void;
}

export type BottomTabActiveStore = BottomTabActiveState & BottomTabActiveAction;
