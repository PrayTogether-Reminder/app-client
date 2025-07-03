"use client";

import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";

import { backgroundColor } from "@/common/styles/color";
import Top1Body10Bottom1 from "../../../../src/common/layout/Top1Body10Bottom1";
import PrayerReadBody from "./_components/PrayerReadBody";
import PrayerReadBottom from "./_components/PrayerReadBottom";
import PrayerReadTop from "./_components/PrayerReadTop";
import OverlayLoading from "@/common/components/loading/OverlayLoading";
import { usePrayerCompletionMutation } from "../../../../src/domain/prayers/hooks/mutations/usePrayerMuations";

export default function PrayerReadScreen() {
  const { mutate: notifyPrayerCompletion, isPending } = usePrayerCompletionMutation();

  return (
    <SafeAreaView style={styles.container}>
      <Top1Body10Bottom1
        tops={[<PrayerReadTop key="top" />]}
        bodies={[<PrayerReadBody key="body" />]}
        bottoms={[
          <PrayerReadBottom 
            key="bottom"
            onPrayerComplete={notifyPrayerCompletion}
            isPending={isPending}
          />
        ]}
      />
      {isPending && <OverlayLoading />}
    </SafeAreaView>
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