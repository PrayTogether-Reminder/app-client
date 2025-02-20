import { Room } from "../types/roomType";
import { OrderBy, Dir } from "../../../common/apis/constants/params";

export interface RoomState {
  rooms: Room[];
  loading: boolean;
  refreshing: boolean;
  hasMore: boolean;
}

export interface RoomAction {
  loadRooms: (orderBy?: OrderBy, after?: number, dir?: Dir) => Promise<Room[]>;
  // handleRefresh: () => Promise<void>;
  toggleNotification: (room: Room) => void;
  leaveRoom: (room: Room) => void;
  setLoading: (loading: boolean) => void;
  // setRefreshing: (refreshing: boolean) => void;
  setHasMore: (hasMore: boolean) => void;
}

export type RoomStore = RoomState & RoomAction;
