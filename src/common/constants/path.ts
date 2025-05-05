import { Route } from "expo-router";

const path = {
  showRoomList: () => "/(protected)/rooms" as Route,
  showRoomById: (id: number) => `/(protected)/rooms/${id}` as Route,
  showPrayersContentById: (id: number) => `/(protected)/prayers/${id}` as Route,
  showPrayersCreate: () => "/(protected)/prayers/creation" as Route,
  showPrayersUpdateById: (id: number | null) =>
    `/(protected)/prayers/${id}/update` as Route,
  showInvitations: () => "/(protected)/my-page/invitations" as Route,
  showLogin: () => "/(public)/login" as Route,
  showSignup: () => "/(public)/signup" as Route,
  showWelcome: () => "/" as Route,
  showNotificationsSettings: () =>
    "/(protected)/my-page/notifications" as Route,
};

export default path;
