"use client";

import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet } from "react-native";
import {
  Portal,
  Dialog,
  TextInput,
  Button,
  useTheme,
} from "react-native-paper";

import Top1Body10Bottom1 from "../../src/common/layout/Top1Body10Bottom1";
import PrayerReadTop from "../../src/domain/prayerRead/components/PrayerReadTop";
import PrayerReadBody from "../../src/domain/prayerRead/components/PrayerReadBody";
import PrayerReadBottom from "../../src/domain/prayerRead/components/PrayerReadBottom";
import { useSelectedPrayerTitleStore } from "../../src/domain/prayerTitles/stores/useSelectedPrayerTitleStore";
import { usePrayerContentsQuery } from "../../src/domain/prayerRead/hooks/queries/usePrayerReadQuery";

export default function PrayerReadScreen() {
  const title = useSelectedPrayerTitleStore().selectedPrayerTitle;
  const { data: prayers } = usePrayerContentsQuery(title?.id ?? null);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <Top1Body10Bottom1
        tops={[<PrayerReadTop />]}
        bodies={[<PrayerReadBody prayers={prayers ?? []} />]}
        bottoms={[<PrayerReadBottom />]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  input: {
    marginBottom: 12,
  },
});
