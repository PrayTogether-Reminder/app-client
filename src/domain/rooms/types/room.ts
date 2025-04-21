export interface Room {
  id: number | null;
  name: string;
  memberCnt: number;
  description: string;
  joinedTime: Date;
  isNotification: boolean;
}
