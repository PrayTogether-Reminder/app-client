import { Route } from "expo-router";

const path = {
  showRoomList: () => "/rooms" as Route,
  showRoomById: (id: string) => `/rooms/${id}` as Route,
  showPrayerContentById: (id: string) => `/prayers/${id}` as Route,
  showPrayerCreate: () => "/prayer/creation" as Route,
};

export default path;
