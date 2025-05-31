import { usePrayerCreationStore } from "@/domain/prayers/stores/usePrayerCreationStore";
import React, { useMemo, useRef, useState } from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Divider, Text } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "../../../../../src/common/styles/color";
import { PrayerCreationItem } from "../../../../../src/domain/prayers/types/PrayerCreationItem";
import { useRoomMembersQuery } from "../../../../../src/domain/rooms/hooks/queries/useRoomQueries";
import { useSelectedRoomStore } from "../../../../../src/domain/rooms/stores/useSelectedRoomStore";
import { RoomMember } from "../../../../../src/domain/rooms/types/roomMember";

// 컴포넌트 임포트
import { showAlert } from "@/common/components/modal/stores/useAlertStore";
import ConfirmationModal from "@/common/components/modal/ConfirmationModal"; // ConfirmationModal 추가
import PrayerAddButton from "./PrayerAddButton";
import PrayerCarousel from "./PrayerCarousel";
import PrayerContentInput from "./PrayerContentInput";
import PrayerMemberSelector from "./PrayerMemberSelector";
import PrayerTitleInput from "./PrayerTitleInput";
import PrayerCustomNameDialog from "./dialog/PrayerCustomNameDialog";
import PrayerMemberSelectionModal from "./modal/PrayerMemberSelectionModal";

const { width } = Dimensions.get("window");
const CARD_SPACING = RFValue(20); // 카드 사이 간격

interface PrayerCreationBodyProps {
  prayerTitle: string;
  setPrayerTitle: (text: string) => void;
}

export default function PrayerCreationBody({
  prayerTitle,
  setPrayerTitle,
}: PrayerCreationBodyProps) {
  const {
    add: addPrayer,
    delete: deletePrayer,
    prayerList,
  } = usePrayerCreationStore();

  const [prayerContent, setPrayerContent] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedMember, setSelectedMember] = useState<RoomMember | null>(null);
  const [memberSelectionModal, setMemberSelectionModal] = useState(false);

  const customNameRef = useRef({ customName: "" });
  const [customNameDialog, setCustomNameDialog] = useState(false);

  const [prayerDelete, setPrayerDelete] = useState<PrayerCreationItem | null>(
    null
  );
  const [prayerDeleteDialog, setPrayerDeleteDialog] = useState(false);

  const [prayerEdit, setPrayerEdit] = useState<PrayerCreationItem | null>(null);
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
    const prayedMember = new Set(prayerList.map((prayer) => prayer.memberName));

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
    if (customName) {
      const existingMember = roomMembers?.find(
        (member) => member.name === customName
      );

      // 기존 멤버가 있으면 그 멤버를 선택
      if (existingMember) {
        setSelectedMember(existingMember);
      } else {
        // 없으면 새 멤버 생성
        const newMember: RoomMember = {
          id: null,
          name: customName,
        };
        setSelectedMember(newMember);
      }

      closeCustomNameDialog();
    }
  };
  // 기도문 추가 함수
  const handleAddPrayer = () => {
    if (!prayerContent.trim() || !selectedMember) return;
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

    // 새 기도문 생성
    const newPrayer: PrayerCreationItem = {
      memberId: selectedMember.id,
      memberName: selectedMember.name,
      content: prayerContent,
    };

    // 기도문 추가 및 입력값 초기화
    addPrayer(newPrayer);
    setPrayerContent("");
    setSelectedMember(null);
    setCurrentIndex(0);
  };

  // 기도문 삭제 관련 함수
  const showPrayerDeleteDialog = (prayer: PrayerCreationItem) => {
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
  const showPrayerEditDialog = (prayer: PrayerCreationItem) => {
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

      {/* 기도문 편집 확인  */}
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
