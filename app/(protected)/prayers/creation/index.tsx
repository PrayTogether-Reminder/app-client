import { usePrayerCreationStore } from "@/domain/prayers/stores/usePrayerCreationStore";
import { router, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { BackHandler, SafeAreaView, StyleSheet, View } from "react-native";
import { Top1Body10Bottom1Layout } from "@/common/components/layout";
import { color } from "../../../../src/common/styles/color";
import { useSelectedRoomStore } from "../../../../src/domain/rooms/stores/useSelectedRoomStore";
import ConfirmationModal from "@/common/components/modal/ConfirmationModal";
import { BottomActionButton } from "@/common/components/button";
import PrayerCreationBody from "./_components/PrayerCreationBody";
import PrayerCreationTop from "./_components/PrayerCreationTop";
import { usePrayerCreationMutation } from "@/domain/prayers/hooks/mutations/usePrayerMutations";
import { useQueryClient } from "@tanstack/react-query";
import QUERY_KEYS from "@/common/constants/queryKeys";

export default function PrayerCreationScreen() {
  const [prayerTitle, setPrayerTitle] = useState("");
  const room = useSelectedRoomStore().selectedRoom;
  const { prayerList, clear: clearPrayer } = usePrayerCreationStore();
  const queryClient = useQueryClient();
  const { mutate: createPrayerMutation, isPending: isCreating } = usePrayerCreationMutation();

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

  // 기도문 전체 저장
  const handleCreatePrayer = () => {
    if (!room?.id) return;

    createPrayerMutation(
      { roomId: room.id, title: prayerTitle, prayerList },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.rooms, room.id, QUERY_KEYS.infinite],
          });
          clearPrayer();
          router.back();
        },
      }
    );
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
    <>
      <Stack.Screen
        options={{
          animation: "slide_from_bottom",
          presentation: "modal",
        }}
      />
      <View style={styles.container}>
        <Top1Body10Bottom1Layout
          showBackButton={false}
          keyboardAvoiding
          scrollable={false}
          contentPadding={false}
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
            <BottomActionButton
              key="button"
              onPress={handleCreatePrayer}
              disabled={!prayerTitle.trim() || isCreating}
              loading={isCreating}
              icon="content-save-all"
              text="모두 저장하기"
              loadingText="저장 중..."
            />
          ]}
        />

        {/* 기도 제목 작성 취소 모달 */}
        <ConfirmationModal
          visible={prayerCancellationDialog}
          onDismiss={cancelPrayerCancellation}
          onConfirm={confirmPrayerCancellation}
          icon="alert-circle"
          title="작성 취소"
          content="기도 제목 작성을 취소하시겠습니까?"
          confirmText="확인"
          cancelText="돌아가기"
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
