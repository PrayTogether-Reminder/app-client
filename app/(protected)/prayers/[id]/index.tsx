import React, { useState } from "react";
import { StyleSheet } from "react-native";

import { backgroundColor } from "@/common/styles/color";
import Top1Body10Bottom1 from "../../../../src/common/layout/Top1Body10Bottom1";
import PrayerReadBody from "./_components/PrayerReadBody";
import PrayerReadBottom from "./_components/PrayerReadBottom";
import PrayerReadTop from "./_components/PrayerReadTop";
import OverlayLoading from "@/common/components/loading/OverlayLoading";
import { usePrayerCompletionMutation } from "../../../../src/domain/prayers/hooks/mutations/usePrayerMuations";
import { useCloseOnBack } from "@/common/services/back-handler/useCloseOnBack";
import { Fragment } from "react";

export default function PrayerReadScreen() {
  const { mutate: notifyPrayerCompletion, isPending } = usePrayerCompletionMutation();
  const [isEditMode, setIsEditMode] = useState(false);

  useCloseOnBack(() => {
    // 로딩 중일 때는 아무것도 하지 않음 (뒤로가기 막힘)
    console.log("로딩 중에는 뒤로가기가 막혔습니다.");
  }, isPending);

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
            isEditMode={isEditMode}
            onEditModeChange={setIsEditMode}
          />
        ]}
        bottoms={[
          <PrayerReadBottom 
            key="bottom"
            onPrayerComplete={notifyPrayerCompletion}
            isPending={isPending}
          />
        ]}
      />
      {isPending && <OverlayLoading />}
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