// TitleCard.tsx
import React from "react";
import { StyleSheet, View, TouchableOpacity, Platform } from "react-native";
import { Card, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "../../../../../src/common/styles/color";

interface TitleCardProps {
  title: string;
  isEditMode?: boolean;
  onEdit?: () => void;
  onCopy?: () => void;
}

export default function TitleCard({ title, isEditMode, onEdit, onCopy }: TitleCardProps) {
  return (
    <Card style={styles.titleCard}>
      <Card.Content style={styles.titleCardContainer}>
        <Text style={styles.titleText}>{title}</Text>
        <View style={styles.buttonContainer}>
          {!isEditMode && onCopy && (
            <TouchableOpacity
              onPress={onCopy}
              style={styles.copyButton}
              activeOpacity={Platform.OS === 'ios' ? 0.8 : 0.2}
            >
              <MaterialCommunityIcons
                name="content-copy"
                size={RFValue(18)}
                color={color.secondary}
              />
            </TouchableOpacity>
          )}
          {isEditMode && onEdit && (
            <TouchableOpacity onPress={onEdit} style={styles.editButton}>
              <MaterialCommunityIcons
                name="pencil"
                size={RFValue(18)}
                color={color.secondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  titleCard: {
    borderRadius: RFValue(10),
    elevation: 4,
    backgroundColor: color.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    height: RFValue(50),
    borderLeftWidth: RFValue(8),
    borderLeftColor: color.secondary,
  },
  titleCardContainer: {
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: RFValue(16),
    paddingRight: RFValue(12),
    paddingVertical: RFValue(0),
  },
  titleText: {
    fontSize: RFValue(16),
    fontWeight: "bold",
    color: color.secondary,
    letterSpacing: RFValue(0.5),
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    lineHeight: RFValue(22),
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButton: {
    padding: RFValue(6),
    marginLeft: RFValue(8),
    borderRadius: RFValue(20),
    backgroundColor: "#F8F9FA",
  },
  copyButton: {
    padding: RFValue(6),
    marginLeft: RFValue(8),
    borderRadius: RFValue(20),
    backgroundColor: "#F8F9FA",
  },
});
