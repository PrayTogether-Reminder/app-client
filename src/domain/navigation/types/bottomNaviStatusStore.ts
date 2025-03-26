import { BottomNaviStatus } from "./bottomNaviStatus";

export interface BottomNaviStatusState {
  status: BottomNaviStatus;
}

export interface BottomNaviStatusAction {
  set: (value: BottomNaviStatus) => void;
}

export type BottomNaviStatusStore = BottomNaviStatusState &
  BottomNaviStatusAction;
