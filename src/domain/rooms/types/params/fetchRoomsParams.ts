import { OrderBy, Dir } from "@/common/constants/params";

export interface FetchRoomsParams {
  orderBy: OrderBy;
  after: string;
  dir: Dir;
}
