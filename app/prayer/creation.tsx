import React, { useState, useMemo, useEffect, useRef } from "react";
import { StyleSheet, SafeAreaView, BackHandler } from "react-native";
import { color } from "../../src/common/styles/color";
import { useRoomMembersQuery } from "../../src/domain/prayerRoom/hooks/queries/roomQueries";
import { useSelectedRoomStore } from "../../src/domain/prayerRoom/types/selectedRoomStore";
import { RoomMember } from "../../src/domain/prayerRoom/types/dto/response/roomMember";
import { router } from "expo-router";
import PrayerMemberSelectionModal from "../../src/domain/PrayerCreation/components/modal/PrayerMemberSelectionModal";
import PrayerCustomNameDialog from "../../src/domain/PrayerCreation/components/dialog/PrayerCustomNameDialog";
import PrayerCreationCancelDialog from "../../src/domain/PrayerCreation/components/dialog/PrayerCreationCancelDialog";
import Top1Body10Bottom1 from "../../src/common/layout/Top1Body10Bottom1";
import PrayerCreationTop from "../../src/domain/PrayerCreation/components/PrayerCreationTop";
import PrayerCreationBody from "../../src/domain/PrayerCreation/components/PrayerCreationBody";
import PrayerCreationBottom from "../../src/domain/PrayerCreation/components/PrayerCreationBottom";
import { SelectedMember } from "../../src/domain/PrayerCreation/types/SelectedMember";
import { usePrayerCreationStore } from "./../../src/domain/PrayerCreation/stores/usePrayerCreationStore";

export default function PrayerCreationScreen() {
  const [prayerTitle, setPrayerTitle] = useState("");
  const room = useSelectedRoomStore().selectedRoom;
  const { clear: clearPrayer } = usePrayerCreationStore();

  // [기도 작성 취소] Dialog 상태
  const [prayerCancellationDialog, setprayerCancellationDialog] =
    useState(false);

  // [기도 작성 취소] 버튼 처리
  const handlePrayeCancellation = () => {
    setprayerCancellationDialog(true);
  };

  // [기도 작성 취소] 확인
  const confirmPrayerCancellation = () => {
    setprayerCancellationDialog(false);
    clearPrayer();
    router.back();
  };

  // [기도 작성 취소]의 취소
  const cancelPrayerCancellation = () => {
    setprayerCancellationDialog(false);
  };

  //  안드로이드 뒤로가기 버튼 처리
  useEffect(() => {
    const backAction = () => {
      handlePrayeCancellation();
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
          <PrayerCreationTop
            roomName={room?.name}
            onCancel={handlePrayeCancellation}
          />,
        ]}
        bodies={[
          <PrayerCreationBody
            prayerTitle={prayerTitle}
            setPrayerTitle={setPrayerTitle}
          />,
        ]}
        bottoms={[<PrayerCreationBottom disabled={!prayerTitle.trim()} />]}
      />

      {/* 기도 제목 작성 취소 Dialog */}
      <PrayerCreationCancelDialog
        visible={prayerCancellationDialog}
        onDismiss={cancelPrayerCancellation}
        onCancel={cancelPrayerCancellation}
        onConfirm={confirmPrayerCancellation}
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
