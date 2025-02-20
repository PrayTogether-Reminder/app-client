export interface BottomTabActive {
  status: BottomTabActiveType;
}

export const BottomTabActiveStatus = {
  ROOMS: "rooms",
  CREATE_ROOM: "create_room",
  PROFILES: "profiles",
} as const;

export type BottomTabActiveType =
  (typeof BottomTabActiveStatus)[keyof typeof BottomTabActiveStatus];
