const path = {
  rooms: "/rooms" as const,
  roomId: (id: string) => `/rooms/${id}` as const,
};

export default path;
