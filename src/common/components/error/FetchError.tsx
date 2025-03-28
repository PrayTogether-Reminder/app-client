// src/components/common/FetchError.tsx (경로는 예시입니다)
import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";

interface FetchErrorProps {
  /** 표시할 에러 객체 */
  error: Error | null;
  /** 재시도 버튼 클릭 시 호출될 함수 */
  onRetry: () => void;
  /** 재시도 중인지 여부 (버튼 비활성화 및 텍스트 변경용) */
  isRetrying: boolean;
  /** 표시할 기본 메시지 (선택 사항) */
  message?: string;
}

export default function FetchError({
  error,
  onRetry,
  isRetrying,
  message = "데이터를 불러오는 중 오류가 발생했습니다.",
}: FetchErrorProps): React.ReactElement {
  return (
    <View style={styles.centerContainer}>
      <Text style={styles.errorText}>{message}</Text>
      <Text style={[styles.errorText, { marginBottom: RFValue(20) }]}>
        {error?.message || "알 수 없는 오류"}
      </Text>
      <Button mode="contained" onPress={onRetry} disabled={isRetrying}>
        {isRetrying ? "재시도 중..." : "다시 시도"}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1, // 부모 컨테이너(Body 영역) 내에서 가능한 공간을 모두 차지하고 중앙 정렬
    justifyContent: "center",
    alignItems: "center",
    padding: RFValue(20),
  },
  errorText: {
    marginBottom: RFValue(10),
    textAlign: "center",
  },
});
