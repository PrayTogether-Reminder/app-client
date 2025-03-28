import type { INVITATION_STATUS } from "../../constants/invitationStatus";

export interface UpdateInvitationStatusRequest {
  invitationId: number;
  status: INVITATION_STATUS;
}
