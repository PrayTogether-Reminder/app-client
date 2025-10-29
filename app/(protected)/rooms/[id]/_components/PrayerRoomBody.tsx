import PrayerTitleList from "./prayerTitleList";
import React from "react";

interface PrayerRoomBodyProps {
  roomId: number;
}

export default function PrayerRoomBody({ roomId }: PrayerRoomBodyProps): React.JSX.Element {
  return <PrayerTitleList roomId={roomId} />;
}
