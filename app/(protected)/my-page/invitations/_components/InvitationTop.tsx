import React from "react";
import { useRouter } from "expo-router";
import { TopHeader } from "@/common/components/header/TopHeader";

interface InvitationAppBarProps {}

export default function InvitationAppBar({}: InvitationAppBarProps): React.ReactElement {
  const router = useRouter();

  return (
    <TopHeader
      title="기도방 초대 목록"
      onBackPress={() => router.navigate("/(protected)/(tabs)/my-page" as any)}
    />
  );
}
