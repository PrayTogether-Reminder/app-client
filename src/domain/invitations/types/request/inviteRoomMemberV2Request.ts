export interface InviteRoomMemberV2Request {
  roomId: number;
  memberIds: number[]; // 초대할 회원들의 ID 배열
}
