import React, { useCallback } from "react";
import { StyleSheet, View, FlatList, Alert, Platform } from "react-native";
import {
  Appbar,
  Text,
  useTheme,
  ActivityIndicator,
  Button,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RFValue } from "react-native-responsive-fontsize";
import { useInviationsQuery } from "@/domain/invitations/hooks/queries/useInvitationQueries";
import { Invitation } from "@/domain/invitations/types/Intivation";

import { backgroundColor } from "@/common/styles/color";
import EmptyState from "@/common/components/empty/EmptyState";
import Loading from "@/common/components/loading/Loading";
import InvitationItem from "./_components/InvitationItem";
import QUERY_KEYS from "@/common/constants/queryKeys";

// --- 나머지 API 함수들은 그대로 둡니다 (버튼 클릭 시 동작 확인용) ---
const acceptInvitationAPI = async (invitationId: number): Promise<void> => {
  console.log(`API: Accepting invitation ${invitationId}...`);
  await new Promise((resolve) => setTimeout(resolve, 1200));
  // throw new Error("Failed to accept invitation"); // 에러 시뮬레이션
  console.log(`API: Accepted invitation ${invitationId}`);
};

const rejectInvitationAPI = async (invitationId: number): Promise<void> => {
  console.log(`API: Rejecting invitation ${invitationId}...`);
  await new Promise((resolve) => setTimeout(resolve, 800));
  console.log(`API: Rejected invitation ${invitationId}`);
};
// --- End API Function Placeholders ---

export default function InvitationsScreen(): React.ReactElement {
  const router = useRouter();
  const theme = useTheme();
  const queryClient = useQueryClient();

  const {
    data: invitations = [],
    isLoading: isLoadingInvitations,
    isError,
    error,
    refetch,
    isRefetching,
  } = useInviationsQuery();

  // --- Mutations (구현은 동일) ---
  const { mutate: acceptMutate, isPending: isAccepting } = useMutation<
    void,
    Error,
    number
  >({
    mutationFn: acceptInvitationAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.invitations });
      Alert.alert("성공", "초대를 수락했습니다.");
    },
    onError: (err) => {
      console.error("Failed to accept invitation:", err);
      Alert.alert("오류", "초대 수락 중 오류가 발생했습니다.");
    },
  });

  const { mutate: rejectMutate, isPending: isRejecting } = useMutation<
    void,
    Error,
    number
  >({
    mutationFn: rejectInvitationAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.invitations });
      Alert.alert("성공", "초대를 거절했습니다.");
    },
    onError: (err) => {
      console.error("Failed to reject invitation:", err);
      Alert.alert("오류", "초대 거절 중 오류가 발생했습니다.");
    },
  });

  const isMutating = isAccepting || isRejecting;

  const handleAccept = useCallback(
    (invitationId: number) => {
      acceptMutate(invitationId);
    },
    [acceptMutate]
  );

  const handleReject = useCallback(
    (invitationId: number) => {
      rejectMutate(invitationId);
    },
    [rejectMutate]
  );

  const handleRefresh = () => {
    if (isRefetching || isLoadingInvitations || isMutating) return;
    refetch();
  };

  // --- Render Item (구현은 동일) ---
  const renderItem = ({ item }: { item: Invitation }) => (
    <InvitationItem
      invitation={item}
      onAccept={handleAccept}
      onReject={handleReject}
      isMutating={isMutating}
    />
  );

  // --- Render Logic (구현은 동일) ---
  if (isError) {
    // ... (에러 처리 UI는 동일)
    return (
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title="기도방 초대 목록" />
        </Appbar.Header>
        <View style={styles.centerContainer}>
          <Text style={{ marginBottom: 10 }}>
            데이터를 불러오는 중 오류가 발생했습니다.
          </Text>
          <Text style={{ marginBottom: 20 }}>{error?.message}</Text>
          <Button mode="contained" onPress={() => refetch()}>
            다시 시도
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="기도방 초대 목록" />
      </Appbar.Header>

      {/* 초기 로딩 처리 */}
      {isLoadingInvitations && !isRefetching ? (
        <Loading />
      ) : (
        <FlatList
          data={invitations}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.invitationId}`}
          contentContainerStyle={styles.listContentContainer}
          ListEmptyComponent={
            !isLoadingInvitations && !isRefetching ? (
              <EmptyState
                icon="email-off-outline"
                message="받은 초대장이 없습니다."
              />
            ) : null
          }
          onRefresh={handleRefresh}
          refreshing={isRefetching}
          showsVerticalScrollIndicator={true}
        />
      )}

      {/* Mutation 로딩 오버레이 */}
      {isMutating && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator animating={true} size="large" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor.default,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: RFValue(20),
  },
  listContentContainer: {
    padding: RFValue(16),
    paddingBottom: Platform.OS === "ios" ? RFValue(40) : RFValue(16),
    flexGrow: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});
