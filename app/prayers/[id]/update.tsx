import React, { useState, useMemo, useEffect, useRef } from "react";
import { StyleSheet, SafeAreaView, BackHandler } from "react-native";
import { useSelectedPrayerTitleStore } from "../../../src/domain/prayers/stores/useSelectedPrayerTitleStore";
import { useSelectedRoomStore } from "../../../src/domain/rooms/stores/useSelectedRoomStore";
import { router } from "expo-router";
import { color } from "../../../src/common/styles/color";
import { useCloseOnBack } from "./../../../src/common/services/back-handler/useCloseOnBack";
import PrayerUpdateTop from "./_components/update/PrayerUpdateTop";
import PrayerUpdateBody from "./_components/update/PrayerUpdateBody";
import PrayerUpdateBottom from "./_components/update/PrayerUpdateBottom";
import PrayerUpdateCancelDialog from "./_components/update/dialog/PrayerUpdateCancelDialog";
import Top1Body10Bottom1 from "../../../src/common/layout/Top1Body10Bottom1";

export default function PrayerCreationScreen() {
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
    <SafeAreaView style={styles.container}>
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

      {/* 기도 제목 변경 취소 Dialog */}
      <PrayerUpdateCancelDialog
        visible={prayerUpdateDialog}
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
