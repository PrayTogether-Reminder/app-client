import { Route } from "expo-router";

const path = {
  showRoomList: () => "/(app)/rooms" as Route,
  showRoomById: (id: number) => `/(app)/rooms/${id}` as Route,
  showPrayersContentById: (id: number) => `/(app)/prayers/${id}` as Route,
  showPrayersCreate: () => "/(app)/prayers/creation" as Route,
  showPrayersUpdateById: (id: number | null) =>
    `/(app)/prayers/${id}/update` as Route,
  showInvitations: () => "/(app)/my-page/invitations" as Route,
  showLogin: () => "/(public)/login" as Route,
  showSignup: () => "/(public)/signup" as Route,
  showWelcome: () => "/" as Route,
};

export default path;
