import { Route } from "expo-router";

const path = {
  showRoomList: () => "/(protected)/rooms" as Route,
  showRoomById: (id: number) => `/(protected)/rooms/${id}` as Route,
  showInviteFriends: (roomId: number) =>
    `/(protected)/rooms/${roomId}/invite-friends` as Route,
  showPrayersContentById: (id: number) => `/(protected)/prayers/${id}` as Route,
  showPrayersCreate: () => "/(protected)/prayers/creation" as Route,
  showInvitations: () => "/(protected)/my-page/invitations" as Route,
  showFriends: () => "/(protected)/friends" as Route,
  showFriendRequests: () => "/(protected)/friends/requests" as Route,
  showFriendAdd: () => "/(protected)/friends/add" as Route,
  showLogin: () => "/(public)/login" as Route,
  showSignup: () => "/(public)/signup" as Route,
  showForgotPassword: () => "/(public)/forgot-password" as Route,
  showChangePassword: () => "/(protected)/my-page/change-password" as Route,
  showWelcome: () => "/" as Route,
};

export default path;
