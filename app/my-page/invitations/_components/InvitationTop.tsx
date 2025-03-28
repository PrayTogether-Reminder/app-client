// src/screens/invitations/_components/InvitationAppBar.tsx (경로는 예시입니다)
import React from "react";
import { Appbar } from "react-native-paper";
import { useRouter } from "expo-router";

interface InvitationAppBarProps {
  // 필요하다면 title 등을 props로 받을 수 있습니다.
  // title?: string;
}

export default function InvitationAppBar({}: InvitationAppBarProps): React.ReactElement {
  const router = useRouter();

  return (
    <Appbar.Header>
      <Appbar.BackAction onPress={() => router.back()} />
      <Appbar.Content
        title="기도방 초대 목록" /* title={title || "기도방 초대 목록"} */
      />
    </Appbar.Header>
  );
}
