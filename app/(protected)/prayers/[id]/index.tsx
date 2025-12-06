import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { backgroundColor, color } from "@/common/styles/color";
import { Top1Body10Bottom1Layout } from "@/common/components/layout";
import PrayerReadBody from "./_components/PrayerReadBody";
import PrayerReadTop from "./_components/PrayerReadTop";
import OverlayLoading from "@/common/components/loading/OverlayLoading";
import { BottomActionButton } from "@/common/components/button";
import ConfirmationModal from "@/common/components/modal/ConfirmationModal";
import { usePrayerCompletionMutation } from "../../../../src/domain/prayers/hooks/mutations/usePrayerMutations";
import { useCloseOnBack } from "@/common/services/back-handler/useCloseOnBack";
import { Fragment } from "react";
import { useSelectedRoomStore } from "../../../../src/domain/rooms/stores/useSelectedRoomStore";

export default function PrayerReadScreen() {
  const params = useLocalSearchParams();
  const prayerTitleId = Number(params.id);
  const roomIdFromUrl = params.roomId ? Number(params.roomId) : undefined;
  const { selectedRoom } = useSelectedRoomStore();

  // URL 파라미터를 우선 사용하고, 없으면 store에서 가져옴
  const roomId = roomIdFromUrl ?? selectedRoom?.id;
  console.log("PrayerReadScreen - prayerTitleId from URL:", prayerTitleId, "roomId:", roomId);

  const { mutate: notifyPrayerCompletion, isPending } = usePrayerCompletionMutation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  useCloseOnBack(() => {
    // 로딩 중일 때는 아무것도 하지 않음 (뒤로가기 막힘)
    console.log("로딩 중에는 뒤로가기가 막혔습니다.");
  }, isPending);

  const handlePrayerComplete = () => {
    if (!roomId) {
      console.error("roomId is missing");
      return;
    }
    notifyPrayerCompletion({ prayerTitleId, roomId });
    setConfirmModalVisible(false);
  };

  return (
    <Fragment>
      <Top1Body10Bottom1Layout
        showBackButton={false}
        keyboardAvoiding
        scrollable={false}
        contentPadding={false}
        tops={[
          <PrayerReadTop
            key="top"
            isEditMode={isEditMode}
            onToggleEditMode={() => setIsEditMode(!isEditMode)}
          />
        ]}
        bodies={[
          <PrayerReadBody
            key="body"
            prayerTitleId={prayerTitleId}
            isEditMode={isEditMode}
            onEditModeChange={setIsEditMode}
          />
        ]}
        bottoms={[
          <BottomActionButton
            key="button"
            onPress={() => setConfirmModalVisible(true)}
            disabled={isPending}
            loading={isPending}
            icon="bell"
            text="기도 알림"
          />
        ]}
      />
      {isPending && <OverlayLoading />}

      <ConfirmationModal
        visible={confirmModalVisible}
        onDismiss={() => setConfirmModalVisible(false)}
        onConfirm={handlePrayerComplete}
        icon="bell-ring"
        title="기도 완료 알림"
        content="기도 완료 알림을 전송하시겠습니까?"
        confirmText="확인"
        cancelText="취소"
        iconColor={color.secondary}
      />
    </Fragment>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor.default,
  },
  input: {
    marginBottom: 12,
  },
});