export interface Room {
  id: number;
  name: string;
  memberCnt: number;
  description: string;
  joinedTime: Date;
  isNotification: boolean;
}
