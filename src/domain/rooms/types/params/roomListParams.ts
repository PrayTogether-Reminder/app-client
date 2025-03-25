import { OrderBy, Dir } from "@/common/apis/constants/params";

export interface RoomListParams {
  orderBy: OrderBy;
  after: string;
  dir: Dir;
}
