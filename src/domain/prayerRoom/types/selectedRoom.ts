import { Room } from "../../roomList/types/dto/responses/room";

export interface SelectedRoom {
  selectedRoom: Room | null;
}

export interface SelectedRoomAction {
  selectRoom: (room: Room) => void;
  resetRoom: () => void;
}

export type SelectedRoomStore = SelectedRoom & SelectedRoomAction;
