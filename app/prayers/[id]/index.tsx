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

import Top1Body10Bottom1 from "../../../src/common/layout/Top1Body10Bottom1";
import PrayerReadTop from "./_components/PrayerReadTop";
import PrayerReadBody from "./_components/PrayerReadBody";
import PrayerReadBottom from "./_components/PrayerReadBottom";
import { backgroundColor } from "@/common/styles/color";

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
