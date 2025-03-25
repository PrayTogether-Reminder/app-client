import { usePrayerCreationStore } from "@/domain/prayers/stores/usePrayerCreationStore";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { BackHandler, SafeAreaView, StyleSheet } from "react-native";
import Top1Body10Bottom1 from "../../src/common/layout/Top1Body10Bottom1";
import { color } from "../../src/common/styles/color";
import { useSelectedRoomStore } from "../../src/domain/rooms/stores/useSelectedRoomStore";
import PrayerCreationCancelDialog from "./_components/dialog/PrayerCreationCancelDialog";
import PrayerCreationBody from "./_components/PrayerCreationBody";
import PrayerCreationBottom from "./_components/PrayerCreationBottom";
import PrayerCreationTop from "./_components/PrayerCreationTop";

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
        bottoms={[
          <PrayerCreationBottom
            disabled={!prayerTitle.trim()}
            title={prayerTitle}
          />,
        ]}
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
