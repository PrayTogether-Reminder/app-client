import { Route } from "expo-router";

const path = {
  // Protected routes - AuthStateListener depends on this!
  showRoomList: () => "/(protected)/rooms" as Route,
  showRoomById: (id: number) => `/(protected)/rooms/${id}` as Route,
  showInviteFriends: (roomId: number) =>
    `/(protected)/rooms/${roomId}/invite-friends` as Route,
  showPrayersContentById: (id: number) => `/(protected)/prayers/${id}` as Route,
  showPrayersContentByIdWithRoom: (prayerId: number, roomId: number) =>
    `/(protected)/prayers/${prayerId}?roomId=${roomId}` as Route,
  showPrayersCreate: () => "/(protected)/prayers/creation" as Route,
  showInvitations: () => "/(protected)/my-page/invitations" as Route,
  showFriends: () => "/(protected)/friends" as Route,
  showFriendRequests: () => "/(protected)/friends/requests" as Route,
  showFriendAdd: () => "/(protected)/friends/add" as Route,
  showChangePassword: () => "/(protected)/my-page/change-password" as Route,

  // Public routes
  showLogin: () => "/(public)/login" as Route,
  showSignup: () => "/(public)/signup" as Route,
  showForgotPassword: () => "/(public)/forgot-password" as Route,
  showGoogleSignup: () => "/(public)/google-signup" as Route,

  // Root
  showWelcome: () => "/" as Route,
};

// href object helpers for dynamic routes (Expo Router best practice)
// Note: 절대 경로 사용 - Tabs 네비게이터 컨텍스트에서 상위 레벨 라우트로 이동 가능하도록
const pathHref = {
  showRoomById: (id: number) => ({
    pathname: "/(protected)/rooms/[id]" as const,
    params: { id: String(id) },
  }),

  showPrayersContentById: (id: number) => ({
    pathname: "/(protected)/prayers/[id]" as const,
    params: { id: String(id) },
  }),

  showPrayersContentByIdWithRoom: (
    prayerId: number,
    roomId: number,
    title?: string
  ) => ({
    pathname: "/(protected)/prayers/[id]" as const,
    params: {
      id: String(prayerId),
      roomId: String(roomId),
      ...(title && { title }),
    },
  }),
};

export default path;
export { pathHref };
