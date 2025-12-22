export interface Prayer {
  memberId: number;
  memberName: string;
  prayerCount: number;
}

export interface PrayerTitle {
  id: number;
  title: string;
  createdTime: Date;
  prayers: Prayer[];
}
