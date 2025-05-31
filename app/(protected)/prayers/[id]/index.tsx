"use client";

import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";

import { backgroundColor } from "@/common/styles/color";
import Top1Body10Bottom1 from "../../../../src/common/layout/Top1Body10Bottom1";
import PrayerReadBody from "./_components/PrayerReadBody";
import PrayerReadBottom from "./_components/PrayerReadBottom";
import PrayerReadTop from "./_components/PrayerReadTop";

export default function PrayerReadScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Top1Body10Bottom1
        tops={[<PrayerReadTop />]}
        bodies={[<PrayerReadBody />]}
        bottoms={[<PrayerReadBottom />]}
      />
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
