import { create } from "zustand";
import { RoomStore } from "./roomStoreType";
import { OrderBy, Dir } from "../../../common/apis/constants/params";
import { fetchRooms } from "../services/roomService";
import { Room } from "../types/roomType";

export const useRoomStore = create<RoomStore>((set, get) => ({
  rooms: [],
  loading: false,
  refreshing: false,
  hasMore: true,

  loadRooms: async (orderBy?: OrderBy, after?: string, dir?: Dir) => {
    set({ loading: true });
    try {
      const loadedRooms: Room[] = await fetchRooms(orderBy, after, dir);
      set({
        rooms: after ? [...get().rooms, ...loadedRooms] : loadedRooms,
        loading: false,
        hasMore: loadedRooms.length > 0,
      });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
  toggleNotification: (room: Room) => {
    const currentState = get();
    const updatedRooms = currentState.rooms.map((r) =>
      r.id === room.id ? { ...r, isNotification: !r.isNotification } : r
    );
    set({ rooms: updatedRooms });
  },
  leaveRoom: (room: Room) => {
    const currentState = get();
    const updatedRooms = currentState.rooms.filter((r) => r.id !== room.id);
    set({ rooms: updatedRooms });
  },
  setLoading: (loading: boolean) => set({ loading }),
  setHasMore: (hasMore: boolean) => set({ hasMore }),
  handleRefresh: async (orderBy?: OrderBy, after?: string, dir?: Dir) => {
    set({ refreshing: true });
    try {
      await get().loadRooms(orderBy, after, dir);
    } finally {
      set({ refreshing: false });
    }
  },
  setRefreshing: (refreshing: boolean) => set({ refreshing }),
}));
