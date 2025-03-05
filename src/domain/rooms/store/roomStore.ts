import { create } from "zustand";
import { Room } from "../types/dto/responses/room";

export interface SelectedRoom {
  selectedRoom: Room | null;
}

export interface SelectedRoomAction {
  selectRoom: (room: Room) => void;
  resetRoom: () => void;
}

export type SelectedRoomStore = SelectedRoom & SelectedRoomAction;

const initialState: SelectedRoom = {
  selectedRoom: null,
};

export const useSelectedRoomStore = create<SelectedRoomStore>((set, get) => ({
  ...initialState,

  selectRoom: (room: Room) => set({ selectedRoom: room }),

  resetRoom: () => set(initialState),
}));
