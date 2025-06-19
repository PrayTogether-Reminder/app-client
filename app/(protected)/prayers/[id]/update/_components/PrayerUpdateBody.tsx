import { color } from "@/common/styles/color";
import { usePrayerContentsQuery } from "@/domain/prayers/hooks/queries/usePrayerQueries";
import { usePrayerUpdateStore } from "@/domain/prayers/stores/usePrayerUpdateStore";
import { useSelectedPrayerTitleStore } from "@/domain/prayers/stores/useSelectedPrayerTitleStore";
import { PrayerUpdateItem } from "@/domain/prayers/types/prayerUpdateItem";
import { useRoomMembersQuery } from "@/domain/rooms/hooks/queries/useRoomQueries";
import { useSelectedRoomStore } from "@/domain/rooms/stores/useSelectedRoomStore";
import { RoomMember } from "@/domain/rooms/types/roomMember";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Divider, Text } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";

import ConfirmationModal from "@/common/components/modal/ConfirmationModal";

import PrayerAddButton from "../../../creation/_components/PrayerAddButton";
import PrayerCarousel from "../../../creation/_components/PrayerCarousel";
import PrayerContentInput from "../../../creation/_components/PrayerContentInput";
import PrayerMemberSelector from "../../../creation/_components/PrayerMemberSelector";
import PrayerTitleInput from "../../../creation/_components/PrayerTitleInput";
import PrayerCustomNameDialog from "../../../creation/_components/dialog/PrayerCustomNameDialog";
import PrayerMemberSelectionModal from "../../../creation/_components/modal/PrayerMemberSelectionModal";
import { showAlert } from "@/common/components/modal/stores/useAlertStore";

const { width } = Dimensions.get("window");
const CARD_SPACING = RFValue(20); // 카드 사이 간격

interface PrayerUpdateBodyProps {
  prayerTitle: string;
  setPrayerTitle: (text: string) => void;
}

export default function PrayerUpdateBody({
  prayerTitle,
  setPrayerTitle,
}: PrayerUpdateBodyProps) {
  const titleId = useSelectedPrayerTitleStore().selectedPrayerTitle?.id ?? null;
  const roomId = useSelectedRoomStore().selectedRoom?.id ?? null;
  const { data: fetchContents, refetch } = usePrayerContentsQuery(
    roomId,
    titleId
  );

  const {
    add: addPrayer,
    delete: deletePrayer,
    set: setPrayerList,
    prayerList,
  } = usePrayerUpdateStore();

  // 기도 관련 상태
  const [prayerContent, setPrayerContent] = useState("");
  const [selectedMember, setSelectedMember] = useState<RoomMember | null>(null);
  const customNameRef = useRef({ customName: "" });
  const [currentIndex, setCurrentIndex] = useState(0);

  const [prayerDelete, setPrayerDelete] = useState<PrayerUpdateItem | null>(
    null
  );
  const [prayerEdit, setPrayerEdit] = useState<PrayerUpdateItem | null>(null);
  const [prayerDeleteDialog, setPrayerDeleteDialog] = useState(false);
  const [customNameDialog, setCustomNameDialog] = useState(false);
  const [memberSelectionModal, setMemberSelectionModal] = useState(false);
  const [prayerEditDialog, setPrayerEditDialog] = useState(false);

  // 방 멤버 관련
  const room = useSelectedRoomStore().selectedRoom;
  const { data: roomMembers } = useRoomMembersQuery(room?.id ?? null);

  // 멤버 선택 모달 관련 함수
  const openMemberSelectionModal = () => {
    setMemberSelectionModal(true);
  };

  const closeMemberSelectionModal = () => {
    setMemberSelectionModal(false);
  };

  // 멤버 직접 입력 다이얼로그 관련 함수
  const showCustomNameDialog = () => {
    setCustomNameDialog(true);
    setMemberSelectionModal(false);
  };

  const closeCustomNameDialog = () => {
    setCustomNameDialog(false);
    onChangeCustomName("");
  };

  const onChangeCustomName = (name: string) => {
    customNameRef.current.customName = name;
  };

  // 이름순으로 정렬된 멤버 목록
  const sortedRoomMembers = useMemo(() => {
    if (!roomMembers) return [];
    const prayedMember = new Set(
      prayerList.map((prayer: PrayerUpdateItem) => prayer.memberName)
    );

    return [...roomMembers]
      .filter((member) => !prayedMember.has(member.name))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [roomMembers, prayerList]);

  // 방 구성원 선택 처리
  const handleSelectMember = (member: RoomMember) => {
    setSelectedMember({
      ...member,
    });
    setMemberSelectionModal(false);
  };

  // 직접 입력한 이름 추가
  const addCustomName = () => {
    const customName = customNameRef.current.customName.trim();
    if (!customName) return;

    const existingContent = fetchContents?.find(
      // 1. API 기도 내용에서 동일한 이름 찾기
      (content) => content.memberName === customName
    );

    if (existingContent) {
      // 동일한 이름이 있다면, 멤버로 사용
      setSelectedMember({
        id: existingContent.memberId,
        name: existingContent.memberName,
      });
      closeCustomNameDialog();
      return;
    }

    const existingRoomMember = roomMembers?.find(
      // 2. 방 멤버에서 동일한 이름 찾기
      (member) => member.name === customName
    );

    setSelectedMember(
      // 방 멤버가 있다면 사용, 없으면 새 멤버 사용
      existingRoomMember || { id: null, name: customName }
    );
    closeCustomNameDialog();
  };

  // 기도문 추가 함수
  const handleAddPrayer = () => {
    if (!prayerContent.trim() || !selectedMember) return;

    const existingPrayer = fetchContents?.find(
      (content) =>
        content.memberId === selectedMember.id &&
        content.memberName === selectedMember.name
    );

    const prayerId = existingPrayer?.id ?? null;
    const newPrayer: PrayerUpdateItem = {
      id: prayerId!!,
      memberId: selectedMember.id!!,
      memberName: selectedMember.name,
      content: prayerContent,
    };

    const isDuplicateMember = prayerList.some(
      (prayer) => prayer.memberName === selectedMember.name
    );

    if (isDuplicateMember) {
      showAlert({
        title: "기도문 중복",
        message: `${selectedMember?.name}님은 이미 기도문을 작성했습니다.`,
      });
      return;
    }

    addPrayer(newPrayer);

    // 기도 내용만 초기화
    setPrayerContent("");
    setSelectedMember(null);
    setCurrentIndex(0);
  };

  // 기도문 삭제 관련 함수
  const showPrayerDeleteDialog = (prayer: PrayerUpdateItem) => {
    setPrayerDelete(prayer);
    setPrayerDeleteDialog(true);
  };

  const cancelPrayerDelete = () => {
    setPrayerDeleteDialog(false);
  };

  const confirmPrayerDelete = () => {
    setPrayerDeleteDialog(false);
    if (prayerDelete) {
      if (prayerList.length - 1 == currentIndex) {
        setCurrentIndex(prayerList.length - 2);
      }
      deletePrayer(prayerDelete);
    }
  };

  // 기도문 편집 함수
  const showPrayerEditDialog = (prayer: PrayerUpdateItem) => {
    setPrayerEdit(prayer);
    setPrayerDelete(prayer);
    setPrayerEditDialog(true);
  };

  const cancelPrayerEdit = () => {
    setPrayerEditDialog(false);
  };

  const confirmPrayerEdit = () => {
    setPrayerEditDialog(false);

    setSelectedMember({
      id: prayerEdit?.memberId,
      name: prayerEdit?.memberName,
    } as RoomMember);
    setPrayerContent(prayerEdit?.content as string);
    confirmPrayerDelete();
  };

  useEffect(() => {
    const fetchAndUpdateData = async () => {
      const result = await refetch();
      if (result.data && result.data.length > 0) {
        const formattedData = result.data.map(
          (item) =>
            ({
              memberId: item.memberId,
              content: item.content,
              memberName: item.memberName,
            }) as PrayerUpdateItem
        );

        setPrayerList(formattedData);
      }
    };

    fetchAndUpdateData();
  }, [refetch, setPrayerList]); // 의존성에 refetch 추가
  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainerStyle}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={Platform.OS === "ios" ? 60 : 50}
      keyboardShouldPersistTaps="handled"
    >
      {/* 기도 제목 입력 */}
      <PrayerTitleInput
        prayerTitle={prayerTitle}
        setPrayerTitle={setPrayerTitle}
      />
      <Divider style={styles.divider} />
      {/* 기도 대상자 선택 버튼 */}
      <PrayerMemberSelector
        selectedMember={selectedMember}
        openMemberSelectionModal={openMemberSelectionModal}
      />
      {/* 기도 내용 입력 */}
      <PrayerContentInput
        selectedMember={selectedMember}
        prayerContent={prayerContent}
        setPrayerContent={setPrayerContent}
      />
      {/* 기도문 추가 버튼 */}
      <PrayerAddButton
        prayerContent={prayerContent}
        selectedMember={selectedMember}
        onAddPrayer={handleAddPrayer}
      />
      {/* 작성된 기도문 목록 섹션 */}
      <View style={styles.prayersListContainer}>
        <Text style={styles.prayersListTitle}>작성된 기도문</Text>
        <PrayerCarousel
          prayerList={prayerList}
          onDeletePrayer={showPrayerDeleteDialog}
          onEditPrayer={showPrayerEditDialog}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      </View>

      {/* 기도문 삭제 확인 */}
      <ConfirmationModal
        visible={prayerDeleteDialog}
        onDismiss={cancelPrayerDelete}
        onConfirm={confirmPrayerDelete}
        icon="alert-circle"
        title="기도문 삭제"
        content={`${prayerDelete?.memberName}님의 기도문을 삭제하시겠습니까?`}
        confirmText="삭제"
        cancelText="취소"
      />

      {/* 기도문 편집 확인 */}
      <ConfirmationModal
        visible={prayerEditDialog}
        onDismiss={cancelPrayerEdit}
        onConfirm={confirmPrayerEdit}
        icon="alert-circle"
        title="기도문 수정"
        content={`${prayerEdit?.memberName}님의 기도문을 수정하시겠습니까?`}
        confirmText="수정"
        cancelText="취소"
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
        onDismiss={closeCustomNameDialog}
        onChangeText={onChangeCustomName}
        onCancel={closeCustomNameDialog}
        onAdd={addCustomName}
      />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainerStyle: {
    padding: CARD_SPACING,
    paddingBottom: CARD_SPACING + RFValue(4),
  },
  divider: {
    marginVertical: RFValue(10),
    height: RFValue(1),
  },
  prayersListContainer: {},
  prayersListTitle: {
    fontSize: RFValue(18),
    fontWeight: "bold",
    marginVertical: RFValue(8),
    color: color.secondary,
  },
});
