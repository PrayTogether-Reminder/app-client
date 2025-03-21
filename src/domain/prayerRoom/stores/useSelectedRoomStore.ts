import { create } from "zustand";
import { SelectedRoomStore, SelectedRoom } from "../types/selectedRoom";
import { Room } from "../../roomList/types/dto/responses/room";

const initialState: SelectedRoom = {
  selectedRoom: null,
};

export const useSelectedRoomStore = create<SelectedRoomStore>((set, get) => ({
  ...initialState,

  selectRoom: (room: Room) => set({ selectedRoom: room }),

  resetRoom: () => set(initialState),
}));
