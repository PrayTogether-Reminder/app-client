import React, { useState, useMemo, useEffect, useRef } from "react";
import { StyleSheet, SafeAreaView, BackHandler } from "react-native";
import { color } from "../../src/common/styles/color";
import { useRoomMembersQuery } from "../../src/domain/prayerRoom/hooks/queries/roomQueries";
import { useSelectedRoomStore } from "../../src/domain/prayerRoom/types/roomStore";
import { RoomMember } from "../../src/domain/prayerRoom/types/dto/response/roomMember";
import { router } from "expo-router";
import PrayerMemberSelectionModal from "../../src/domain/PrayerCreation/components/modal/PrayerMemberSelectionModal";
import PrayerCustomNameDialog from "../../src/domain/PrayerCreation/components/dialog/PrayerCustomNameDialog";
import PrayerCreationCancelDialog from "../../src/domain/PrayerCreation/components/dialog/PrayerCreationCancelDialog";
import Top1Body10Bottom1 from "../../src/common/layout/Top1Body10Bottom1";
import PrayerCreationTop from "../../src/domain/PrayerCreation/components/PrayerCreationTop";
import PrayerCreationBody from "../../src/domain/PrayerCreation/components/PrayerCreationBody";
import PrayerCreationBottom from "../../src/domain/PrayerCreation/components/PrayerCreationBottom";

// 멤버 타입 정의
interface SelectedMember extends RoomMember {
  isRoomMember: boolean;
}

export default function PrayerCreationScreen() {
  const [prayerTitle, setPrayerTitle] = useState("");
  const [prayerContent, setPrayerContent] = useState("");
  const [selectedMember, setSelectedMember] = useState<SelectedMember | null>(
    null
  );
  const [customNameDialogVisible, setCustomNameDialogVisible] = useState(false);
  const customNameRef = useRef({ customName: "" });
  const [memberSelectionModalVisible, setMemberSelectionModalVisible] =
    useState(false);
  const room = useSelectedRoomStore().selectedRoom;
  const { data: roomMembers } = useRoomMembersQuery(room?.id ?? "");

  // 커스텀 멤버 이름 변경
  const onChangeCustomName = (name: string) => {
    customNameRef.current.customName = name;
  };

  // 이름순으로 정렬된 멤버 목록
  const sortedRoomMembers = useMemo(() => {
    //todo: 이미 작성된 이름은 제외.
    if (!roomMembers) return [];
    return [...roomMembers].sort((a, b) => a.name.localeCompare(b.name));
  }, [roomMembers]);

  // 방 구성원 선택 처리
  const handleSelectMember = (member: RoomMember) => {
    setSelectedMember({
      ...member,
      isRoomMember: true,
    });
    setMemberSelectionModalVisible(false);
  };

  // 멤버 선택 모달 열기
  const openMemberSelectionModal = () => {
    setMemberSelectionModalVisible(true);
  };

  // 멤버 선택 모달 닫기
  const closeMemberSelectionModal = () => {
    setMemberSelectionModalVisible(false);
  };

  // 직접 입력 다이얼로그 표시
  const showCustomNameDialog = () => {
    setCustomNameDialogVisible(true);
    setMemberSelectionModalVisible(false);
  };

  // 직접 입력 다이얼로그 숨기기
  const hideCustomNameDialog = () => {
    setCustomNameDialogVisible(false);
    onChangeCustomName("");
  };

  // 직접 입력한 이름 추가
  const addCustomName = () => {
    const customName = customNameRef.current.customName;
    if (customName.trim()) {
      const newMember: SelectedMember = {
        id: "customMember",
        name: customName.trim(),
        isRoomMember: false,
      };

      setSelectedMember(newMember);
      hideCustomNameDialog();
    }
  };

  // 기도 내용 저장
  const savePrayer = () => {
    if (prayerTitle.trim() && prayerContent.trim() && selectedMember) {
      // 여기서 실제 저장 로직 구현
      // API 호출이나 store 업데이트 등을 수행

      // 저장 후 이전 화면으로 돌아가기
      router.back();
    }
  };

  // 확인 다이얼로그 상태
  const [cancelDialogVisible, setCancelDialogVisible] = useState(false);

  // 취소 버튼 처리 - 확인 다이얼로그 표시
  const handleCancel = () => {
    setCancelDialogVisible(true);
  };

  // 취소 확인 시 처리
  const confirmCancel = () => {
    setCancelDialogVisible(false);
    router.back();
  };

  // 취소 취소 시 처리
  const cancelCancellation = () => {
    setCancelDialogVisible(false);
  };

  // 안드로이드 뒤로가기 버튼 처리
  useEffect(() => {
    const backAction = () => {
      handleCancel();
      return true; // 기본 동작 방지
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // 컴포넌트 언마운트 시 이벤트 리스너 제거
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Top1Body10Bottom1
        tops={[
          <PrayerCreationTop roomName={room?.name} onCancel={handleCancel} />,
        ]}
        bodies={[
          <PrayerCreationBody
            prayerTitle={prayerTitle}
            setPrayerTitle={setPrayerTitle}
            prayerContent={prayerContent}
            setPrayerContent={setPrayerContent}
            selectedMember={selectedMember}
            openMemberSelectionModal={openMemberSelectionModal}
          />,
        ]}
        bottoms={[
          <PrayerCreationBottom
            onSave={savePrayer}
            disabled={
              !prayerTitle.trim() || !prayerContent.trim() || !selectedMember
            }
          />,
        ]}
      />

      {/* 멤버 선택 모달 */}
      <PrayerMemberSelectionModal
        visible={memberSelectionModalVisible}
        onDismiss={closeMemberSelectionModal}
        members={sortedRoomMembers}
        onSelectMember={handleSelectMember}
        onCustomNamePress={showCustomNameDialog}
      />

      {/* 멤버 직접 입력 다이얼로그 */}
      <PrayerCustomNameDialog
        visible={customNameDialogVisible}
        onDismiss={hideCustomNameDialog}
        customNameRef={customNameRef}
        onChangeText={onChangeCustomName}
        onCancel={hideCustomNameDialog}
        onAdd={addCustomName}
      />

      {/* 취소 확인 다이얼로그 */}
      <PrayerCreationCancelDialog
        visible={cancelDialogVisible}
        onDismiss={cancelCancellation}
        onConfirm={confirmCancel}
        onCancel={cancelCancellation}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
  },
});
