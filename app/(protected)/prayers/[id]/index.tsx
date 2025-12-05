import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { backgroundColor, color } from "@/common/styles/color";
import Top1Body10Bottom1 from "../../../../src/common/components/layout/Top1Body10Bottom1";
import PrayerReadBody from "./_components/PrayerReadBody";
import PrayerReadTop from "./_components/PrayerReadTop";
import OverlayLoading from "@/common/components/loading/OverlayLoading";
import { BottomActionButton } from "@/common/components/button";
import ConfirmationModal from "@/common/components/modal/ConfirmationModal";
import { usePrayerCompletionMutation } from "../../../../src/domain/prayers/hooks/mutations/usePrayerMutations";
import { useCloseOnBack } from "@/common/services/back-handler/useCloseOnBack";
import { Fragment } from "react";

export default function PrayerReadScreen() {
  const params = useLocalSearchParams();
  const prayerTitleId = Number(params.id);
  const roomId = params.roomId ? Number(params.roomId) : undefined;
  console.log("PrayerReadScreen - prayerTitleId from URL:", prayerTitleId, "roomId:", roomId);

  const { mutate: notifyPrayerCompletion, isPending } = usePrayerCompletionMutation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  useCloseOnBack(() => {
    // 로딩 중일 때는 아무것도 하지 않음 (뒤로가기 막힘)
    console.log("로딩 중에는 뒤로가기가 막혔습니다.");
  }, isPending);

  const handlePrayerComplete = () => {
    notifyPrayerCompletion({ prayerTitleId, roomId: roomId! });
    setConfirmModalVisible(false);
  };

  return (
    <Fragment>
      <Top1Body10Bottom1
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