import { OrderBy, Dir } from "@/common/constants/params";

export interface RoomListParams {
  orderBy: OrderBy;
  after: string;
  dir: Dir;
}
