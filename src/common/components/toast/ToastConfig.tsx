import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "@/common/styles/color";

export const toastConfig = {
  success: (props: any) => (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name="check-circle"
          size={RFValue(24)}
          color={color.secondary}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text1} numberOfLines={2}>
          {props.text1}
        </Text>
        {props.text2 && (
          <Text style={styles.text2} numberOfLines={2}>
            {props.text2}
          </Text>
        )}
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: RFValue(16),
    paddingVertical: RFValue(12),
    paddingHorizontal: RFValue(16),
    marginHorizontal: RFValue(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    borderLeftWidth: RFValue(6),
    borderLeftColor: color.secondary,
  },
  iconContainer: {
    marginRight: RFValue(12),
  },
  textContainer: {
    flex: 1,
  },
  text1: {
    fontSize: RFValue(16),
    fontWeight: "bold",
    color: "#333",
    lineHeight: RFValue(20),
  },
  text2: {
    fontSize: RFValue(14),
    color: "#555",
    lineHeight: RFValue(18),
    marginTop: RFValue(2),
  },
});
