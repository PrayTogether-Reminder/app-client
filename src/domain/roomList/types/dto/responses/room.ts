export interface Room {
  id: string;
  name: string;
  memberCnt: number;
  description: string;
  createdTime: Date;
  isNotification: boolean;
}
