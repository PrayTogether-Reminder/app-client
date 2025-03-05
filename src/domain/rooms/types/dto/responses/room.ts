export interface Room {
  id: number;
  name: string;
  memberCnt: number;
  description: string;
  createdTime: Date;
  isNotification: boolean;
}
