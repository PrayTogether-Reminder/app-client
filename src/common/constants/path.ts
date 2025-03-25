import { Route } from "expo-router";

const path = {
  showRoomList: () => "/rooms" as Route,
  showRoomById: (id: number) => `/rooms/${id}` as Route,
  showPrayersContentById: (id: number) => `/prayers/${id}` as Route,
  showPrayersCreate: () => "/prayers/creation" as Route,
  showPrayersUpdateById: (id: number | null) =>
    `/prayers/${id}/update` as Route,
};

export default path;
