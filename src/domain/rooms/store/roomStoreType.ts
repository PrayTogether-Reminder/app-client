import { Room } from "../types/roomType";
import { OrderBy, Dir } from "../../../common/apis/constants/params";

export interface RoomState {
  rooms: Room[];
  loading: boolean;
  refreshing: boolean;
  hasMore: boolean;
}

export interface RoomAction {
  loadRooms: (orderBy?: OrderBy, after?: string, dir?: Dir) => Promise<void>;
  handleRefresh: (
    orderBy?: OrderBy,
    after?: string,
    dir?: Dir
  ) => Promise<void>;
  setRefreshing: (refreshing: boolean) => void;
  toggleNotification: (room: Room) => void;
  leaveRoom: (room: Room) => void;
  setLoading: (loading: boolean) => void;
  setHasMore: (hasMore: boolean) => void;
}

export type RoomStore = RoomState & RoomAction;
