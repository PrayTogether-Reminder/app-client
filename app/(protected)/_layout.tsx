import React from "react";
import { Slot } from "expo-router";
import FcmInitializer from "@/common/services/fcm/fcmInitializer";

export default function ProtectedLayout() {
  return (
    <>
      <FcmInitializer />
      <Slot />
    </>
  );
}
