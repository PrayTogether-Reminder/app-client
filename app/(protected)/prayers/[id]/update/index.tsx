import React, { useState, useMemo, useEffect, useRef, Fragment } from "react";
import { StyleSheet, SafeAreaView, BackHandler } from "react-native";
import { useSelectedPrayerTitleStore } from "../../../../../src/domain/prayers/stores/useSelectedPrayerTitleStore";
import { useSelectedRoomStore } from "../../../../../src/domain/rooms/stores/useSelectedRoomStore";
import { router } from "expo-router";
import { color } from "../../../../../src/common/styles/color";
import { useCloseOnBack } from "../../../../../src/common/services/back-handler/useCloseOnBack";
import PrayerUpdateTop from "./_components/PrayerUpdateTop";
import PrayerUpdateBody from "./_components/PrayerUpdateBody";
import PrayerUpdateBottom from "./_components/PrayerUpdateBottom";
import ConfirmationModal from "@/common/components/modal/ConfirmationModal";
import Top1Body10Bottom1 from "../../../../../src/common/layout/Top1Body10Bottom1";

export default function PrayerUpdateScreen() {
  const originalTitle = useSelectedPrayerTitleStore().selectedPrayerTitle;
  const [prayerTitle, setPrayerTitle] = useState(originalTitle?.title ?? "");
  const room = useSelectedRoomStore().selectedRoom;

  // [기도 변경 취소] Dialog 상태
  const [prayerUpdateDialog, setPrayerUpdateDialog] = useState(false);

  // [기도 변경 취소] 버튼 처리
  const handlePrayeCancellation = () => {
    setPrayerUpdateDialog(true);
  };

  // [기도 변경 취소] 확인
  const confirmPrayerCancellation = () => {
    setPrayerUpdateDialog(false);
    // clearPrayer();
    router.back();
  };

  // [기도 변경 취소]의 취소
  const cancelPrayerCancellation = () => {
    setPrayerUpdateDialog(false);
  };

  useCloseOnBack(handlePrayeCancellation);

  return (
    <Fragment>
      <Top1Body10Bottom1
        tops={[
          <PrayerUpdateTop
            roomName={room?.name}
            onCancel={handlePrayeCancellation}
          />,
        ]}
        bodies={[
          <PrayerUpdateBody
            prayerTitle={prayerTitle}
            setPrayerTitle={setPrayerTitle}
          />,
        ]}
        bottoms={[
          <PrayerUpdateBottom
            disabled={!prayerTitle.trim()}
            title={prayerTitle}
          />,
        ]}
      />

      {/* ConfirmationModal을 사용한 기도 제목 변경 취소 모달 */}
      <ConfirmationModal
        visible={prayerUpdateDialog}
        onDismiss={cancelPrayerCancellation}
        onConfirm={confirmPrayerCancellation}
        icon="alert-circle" // 또는 "pencil-off", "close-circle" 등 수정 취소를 나타내는 아이콘
        title="변경 취소"
        content="기도 제목 변경을 취소하시겠습니까?"
        confirmText="확인"
        cancelText="돌아가기"
      />
    </Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
