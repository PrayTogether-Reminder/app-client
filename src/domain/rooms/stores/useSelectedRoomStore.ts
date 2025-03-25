import { create } from "zustand";
import {
  SelectedRoomStore,
  SelectedRoomState,
} from "../types/selectedRoomStore";
import { Room } from "../types/room";

const initialState: SelectedRoomState = {
  selectedRoom: null,
};

export const useSelectedRoomStore = create<SelectedRoomStore>((set, get) => ({
  ...initialState,

  selectRoom: (room: Room) => set({ selectedRoom: room }),

  resetRoom: () => set(initialState),
}));
