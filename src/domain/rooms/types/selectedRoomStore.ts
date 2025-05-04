import { Room } from "./room";

export interface SelectedRoomState {
  selectedRoom: Room | null;
}

export interface SelectedRoomAction {
  selectRoom: (room: Room) => void;
  clear: () => void;
}

export type SelectedRoomStore = SelectedRoomState & SelectedRoomAction;
