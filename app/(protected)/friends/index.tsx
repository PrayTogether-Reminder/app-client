import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

export default function FriendsScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">친구 목록</Text>
      <Text variant="bodyMedium">친구 관리 화면이 여기에 표시됩니다.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});