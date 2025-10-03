export interface InviteRoomMemberV2Request {
  roomId: number;
  friendIds: number[]; // 친구들의 memberId 배열 (Friend.friendId == RoomMember.id)
}
