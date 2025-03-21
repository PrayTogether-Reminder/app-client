import React, { useState, useRef, useMemo } from "react";
import { View, StyleSheet, Platform, Dimensions } from "react-native";
import { Divider, Text } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "../../../common/styles/color";
import { SelectedMember } from "../types/SelectedMember";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { usePrayerCreationStore } from "./../stores/usePrayerCreationStore";
import { PrayerCreationItem } from "../types/PrayerCreationItem";
import { useSelectedRoomStore } from "../../prayerRoom/types/selectedRoomStore";
import { useRoomMembersQuery } from "../../prayerRoom/hooks/queries/roomQueries";
import { RoomMember } from "../../prayerRoom/types/dto/response/roomMember";

// 컴포넌트 임포트
import PrayerTitleInput from "./PrayerTitleInput";
import PrayerMemberSelector from "./PrayerMemberSelector";
import PrayerContentInput from "./PrayerContentInput";
import PrayerAddButton from "./PrayerAddButton";
import PrayerCarousel from "./PrayerCarousel";
import DialogManager from "./DialogManager";

// 화면 너비 가져오기
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

  // 기도 관련 상태
  const [prayerContent, setPrayerContent] = useState("");
  const [selectedMember, setSelectedMember] = useState<SelectedMember | null>(
    null
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  // 다이얼로그 관련 상태
  const [prayerDelete, setPrayerDelete] = useState<PrayerCreationItem | null>(
    null
  );
  const [prayerDeleteDialog, setPrayerDeleteDialog] = useState(false);
  const customNameRef = useRef({ customName: "" });
  const [customNameDialog, setCustomNameDialog] = useState(false);
  const [memberSelectionModal, setMemberSelectionModal] = useState(false);

  // 방 멤버 관련
  const room = useSelectedRoomStore().selectedRoom;
  const { data: roomMembers } = useRoomMembersQuery(room?.id ?? "");

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

  const hideCustomNameDialog = () => {
    setCustomNameDialog(false);
    onChangeCustomName("");
  };

  const onChangeCustomName = (name: string) => {
    customNameRef.current.customName = name;
  };

  // 이름순으로 정렬된 멤버 목록
  const sortedRoomMembers = useMemo(() => {
    if (!roomMembers) return [];
    return [...roomMembers].sort((a, b) => a.name.localeCompare(b.name));
  }, [roomMembers]);

  // 방 구성원 선택 처리
  const handleSelectMember = (member: RoomMember) => {
    setSelectedMember({
      ...member,
    });
    setMemberSelectionModal(false);
  };

  // 직접 입력한 이름 추가
  const addCustomName = () => {
    const customName = customNameRef.current.customName;
    if (customName.trim()) {
      const newMember: SelectedMember = {
        id: "customMember",
        name: customName.trim(),
      };

      setSelectedMember(newMember);
      hideCustomNameDialog();
    }
  };

  // 기도문 추가 함수
  const handleAddPrayer = () => {
    if (!prayerContent.trim() || !selectedMember) return;
    const newPrayer: PrayerCreationItem = {
      memberId: selectedMember.id,
      content: prayerContent,
      memberName: selectedMember.name,
    };

    addPrayer(newPrayer);

    // 기도 내용만 초기화
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

      {/* 사람 선택 버튼 */}
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

      <Divider style={styles.divider} />

      {/* 작성된 기도문 목록 섹션 */}
      <View style={styles.prayersListContainer}>
        <Text style={styles.prayersListTitle}>작성된 기도문</Text>
        <PrayerCarousel
          prayerList={prayerList}
          onDeletePrayer={showPrayerDeleteDialog}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      </View>

      {/* 다이얼로그 관리자 */}
      <DialogManager
        // Delete Dialog Props
        prayerDeleteDialog={prayerDeleteDialog}
        prayerDelete={prayerDelete}
        cancelPrayerDelete={cancelPrayerDelete}
        confirmPrayerDelete={confirmPrayerDelete}
        // Member Selection Modal Props
        memberSelectionModal={memberSelectionModal}
        closeMemberSelectionModal={closeMemberSelectionModal}
        sortedRoomMembers={sortedRoomMembers}
        handleSelectMember={handleSelectMember}
        showCustomNameDialog={showCustomNameDialog}
        // Custom Name Dialog Props
        customNameDialog={customNameDialog}
        hideCustomNameDialog={hideCustomNameDialog}
        customNameRef={customNameRef}
        onChangeCustomName={onChangeCustomName}
        addCustomName={addCustomName}
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
    marginVertical: RFValue(16),
    height: RFValue(1),
  },
  prayersListContainer: {},
  prayersListTitle: {
    fontSize: RFValue(18),
    fontWeight: "bold",
    marginBottom: RFValue(16),
    color: color.secondary,
  },
});
