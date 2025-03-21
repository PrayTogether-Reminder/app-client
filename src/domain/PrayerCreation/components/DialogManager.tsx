// 6. DialogManager.tsx
import React from "react";
import { PrayerCreationItem } from "../types/PrayerCreationItem";
import { RoomMember } from "../../prayerRoom/types/dto/response/roomMember";
import PrayerDeleteDialog from "./dialog/PrayerDeleteDialog";
import PrayerCustomNameDialog from "./dialog/PrayerCustomNameDialog";
import PrayerMemberSelectionModal from "./modal/PrayerMemberSelectionModal";

interface DialogManagerProps {
  // Delete Dialog Props
  prayerDeleteDialog: boolean;
  prayerDelete: PrayerCreationItem | null;
  cancelPrayerDelete: () => void;
  confirmPrayerDelete: () => void;

  // Member Selection Modal Props
  memberSelectionModal: boolean;
  closeMemberSelectionModal: () => void;
  sortedRoomMembers: RoomMember[];
  handleSelectMember: (member: RoomMember) => void;
  showCustomNameDialog: () => void;

  // Custom Name Dialog Props
  customNameDialog: boolean;
  hideCustomNameDialog: () => void;
  customNameRef: React.MutableRefObject<{ customName: string }>;
  onChangeCustomName: (name: string) => void;
  addCustomName: () => void;
}

export default function DialogManager({
  // Delete Dialog Props
  prayerDeleteDialog,
  prayerDelete,
  cancelPrayerDelete,
  confirmPrayerDelete,

  // Member Selection Modal Props
  memberSelectionModal,
  closeMemberSelectionModal,
  sortedRoomMembers,
  handleSelectMember,
  showCustomNameDialog,

  // Custom Name Dialog Props
  customNameDialog,
  hideCustomNameDialog,
  customNameRef,
  onChangeCustomName,
  addCustomName,
}: DialogManagerProps) {
  return (
    <>
      {/* 기도문 삭제 확인 Dialog */}
      <PrayerDeleteDialog
        visible={prayerDeleteDialog}
        onDismiss={cancelPrayerDelete}
        onConfirm={confirmPrayerDelete}
        memberName={prayerDelete?.memberName}
      />

      {/* 멤버 선택 Modal */}
      <PrayerMemberSelectionModal
        visible={memberSelectionModal}
        onDismiss={closeMemberSelectionModal}
        members={sortedRoomMembers}
        onSelectMember={handleSelectMember}
        onCustomNamePress={showCustomNameDialog}
      />

      {/* 멤버 직접 입력 Dialog */}
      <PrayerCustomNameDialog
        visible={customNameDialog}
        onDismiss={hideCustomNameDialog}
        customNameRef={customNameRef}
        onChangeText={onChangeCustomName}
        onCancel={hideCustomNameDialog}
        onAdd={addCustomName}
      />
    </>
  );
}
