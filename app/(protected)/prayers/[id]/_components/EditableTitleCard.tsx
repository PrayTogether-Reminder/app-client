import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Text, TextInput } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "../../../../../src/common/styles/color";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface EditableTitleCardProps {
  title: string;
  isEditMode: boolean;
  onTitleChange: (title: string) => void;
}

export default function EditableTitleCard({ title, isEditMode, onTitleChange }: EditableTitleCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);

  const handleEdit = () => {
    if (isEditMode) {
      setIsEditing(true);
      setTempTitle(title);
    }
  };

  const handleSave = () => {
    if (tempTitle.trim()) {
      onTitleChange(tempTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempTitle(title);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card style={styles.titleCard}>
        <Card.Content style={styles.editingContainer}>
          <TextInput
            value={tempTitle}
            onChangeText={setTempTitle}
            style={styles.titleInput}
            mode="flat"
            placeholder="기도 제목"
            autoFocus
            onSubmitEditing={handleSave}
          />
          <View style={styles.editButtons}>
            <TouchableOpacity onPress={handleSave} style={styles.iconButton}>
              <MaterialCommunityIcons 
                name="check" 
                size={RFValue(20)} 
                color={color.secondary} 
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancel} style={styles.iconButton}>
              <MaterialCommunityIcons 
                name="close" 
                size={RFValue(20)} 
                color="#FF6B6B" 
              />
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>
    );
  }

  return (
    <TouchableOpacity onPress={handleEdit} disabled={!isEditMode}>
      <Card style={[styles.titleCard, isEditMode && styles.editableCard]}>
        <Card.Content style={styles.titleCardContainer}>
          <Text style={styles.titleText}>{title}</Text>
          {isEditMode && (
            <MaterialCommunityIcons 
              name="pencil" 
              size={RFValue(16)} 
              color={color.secondary}
              style={styles.editIcon}
            />
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
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
  editableCard: {
    borderColor: color.secondary + "30",
    borderWidth: 1,
  },
  titleCardContainer: {
    height: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: RFValue(16),
    paddingRight: RFValue(12),
    paddingVertical: RFValue(0),
  },
  editingContainer: {
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: RFValue(8),
    paddingRight: RFValue(8),
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
  titleInput: {
    flex: 1,
    fontSize: RFValue(16),
    backgroundColor: "transparent",
    height: RFValue(40),
    marginRight: RFValue(8),
  },
  editIcon: {
    marginLeft: RFValue(8),
  },
  editButtons: {
    flexDirection: "row",
    gap: RFValue(4),
  },
  iconButton: {
    padding: RFValue(4),
  },
});