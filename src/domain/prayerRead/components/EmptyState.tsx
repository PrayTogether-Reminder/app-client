// EmptyState.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "../../../common/styles/color";

export default function EmptyState() {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>기도문을 작성해 주세요.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: RFValue(16),
  },
  emptyText: {
    fontSize: RFValue(16),
    marginBottom: RFValue(16),
    color: color.secondary,
  },
});
