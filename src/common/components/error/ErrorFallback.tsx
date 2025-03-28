// src/components/common/ErrorFallback.tsx
import React from "react";
import { View, Text } from "react-native";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
      }}
    >
      <Text style={{ marginBottom: 16, fontSize: 18, fontWeight: "bold" }}>
        오류가 발생했습니다
      </Text>
      <Text style={{ marginBottom: 8 }}>{error?.message}</Text>
      <Text>{error?.stack}</Text>
      <View style={{ marginTop: 20 }}>
        <Text
          style={{
            color: "blue",
            textDecorationLine: "underline",
            padding: 8,
          }}
          onPress={resetErrorBoundary}
        >
          다시 시도하기
        </Text>
      </View>
    </View>
  );
};

export default ErrorFallback;
