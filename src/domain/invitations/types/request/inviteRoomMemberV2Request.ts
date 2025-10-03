export interface InviteRoomMemberV2Request {
  roomId: number;
  friendId: number; // 친구의 memberId (Friend.friendId == RoomMember.id)
}
