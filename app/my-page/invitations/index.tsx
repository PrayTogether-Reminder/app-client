import React, { useState, useCallback } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { Appbar, Text, useTheme, ActivityIndicator } from "react-native-paper";
import { useRouter } from "expo-router";
import { backgroundColor } from "@/common/styles/color";
import InvitationItem, { Invitation } from "./_components/InvitationItem"; // 개별 아이템 컴포넌트 경로
import EmptyState from "@/common/components/empty/EmptyState"; // 비어있을 때 보여줄 컴포넌트 (새로 생성 추천)

// Mock 데이터 (실제로는 API 호출 등을 통해 가져옵니다)
const MOCK_INVITATIONS: Invitation[] = [
  {
    id: "1",
    prayerRoomName: "새벽기도 모임",
    inviterName: "김철수",
    invitedAt: new Date(2023, 10, 15, 8, 0, 0),
  },
  {
    id: "2",
    prayerRoomName: "청년부 기도회",
    inviterName: "박영희",
    invitedAt: new Date(2023, 10, 14, 15, 30, 0),
  },
  {
    id: "3",
    prayerRoomName: "가정을 위한 중보기도",
    inviterName: "이민준",
    invitedAt: new Date(2023, 10, 13, 21, 0, 0),
  },
];

export default function InvitationsScreen(): React.ReactElement {
  const router = useRouter();
  const theme = useTheme();
  const [invitations, setInvitations] =
    useState<Invitation[]>(MOCK_INVITATIONS); // 실제 앱에서는 API 호출 결과로 초기화
  const [loading, setLoading] = useState(false); // 로딩 상태

  // 초대 수락 처리 함수
  const handleAccept = useCallback((invitationId: string) => {
    console.log("Accept invitation:", invitationId);
    setLoading(true);
    // --- API 호출 (수락) ---
    // 예시: await acceptInvitationAPI(invitationId);
    // 성공 시 목록에서 제거
    setTimeout(() => {
      // Simulate API delay
      setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
      setLoading(false);
      // TODO: 성공 메시지 표시 (Snackbar 등)
    }, 1000);
    // 실패 시 에러 처리 및 메시지 표시
    // setLoading(false);
  }, []);

  // 초대 거절 처리 함수
  const handleReject = useCallback((invitationId: string) => {
    console.log("Reject invitation:", invitationId);
    setLoading(true);
    // --- API 호출 (거절) ---
    // 예시: await rejectInvitationAPI(invitationId);
    // 성공 시 목록에서 제거
    setTimeout(() => {
      // Simulate API delay
      setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
      setLoading(false);
      // TODO: 성공 메시지 표시 (Snackbar 등)
    }, 1000);
    // 실패 시 에러 처리 및 메시지 표시
    // setLoading(false);
  }, []);

  const renderItem = ({ item }: { item: Invitation }) => (
    <InvitationItem
      invitation={item}
      onAccept={handleAccept}
      onReject={handleReject}
    />
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="기도방 초대 목록" />
      </Appbar.Header>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator animating={true} size="large" />
        </View>
      )}

      <FlatList
        data={invitations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContentContainer}
        ListEmptyComponent={
          !loading ? ( // 로딩 중이 아닐 때만 EmptyState 표시
            <EmptyState
              icon="email-off-outline"
              message="받은 초대장이 없습니다."
            />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor.default, // 기존 배경색 사용
  },
  listContentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexGrow: 1, // 내용이 적어도 화면 채우도록
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject, // 화면 전체를 덮음
    backgroundColor: "rgba(255, 255, 255, 0.7)", // 반투명 배경
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10, // 다른 요소들 위에 오도록
  },
});
