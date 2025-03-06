import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";

const EmptyRoomList = () => (
  <View style={styles.container}>
    <Text style={styles.text}>방 목록이 없습니다</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: RFValue(16),
  },
  text: {
    fontSize: RFValue(16),
    color: "gray",
  },
});

export default EmptyRoomList;
