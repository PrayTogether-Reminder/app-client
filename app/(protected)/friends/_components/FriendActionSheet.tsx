import React from "react";
import { StyleSheet, View, TouchableOpacity, Modal, Pressable } from "react-native";
import { Text } from "react-native-paper";
import { color } from "@/common/styles/color";
import { Friend } from "@/domain/friends/types/Friend";

interface FriendActionSheetProps {
  visible: boolean;
  friend: Friend | null;
  onDismiss: () => void;
  onDelete: () => void;
}

export default function FriendActionSheet({
  visible,
  friend,
  onDismiss,
  onDelete,
}: FriendActionSheetProps): React.ReactElement {
  if (!friend) return <></>;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onDismiss}
    >
      <Pressable style={styles.overlay} onPress={onDismiss}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text variant="titleMedium" style={styles.name}>
              {friend.friendName}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              onDismiss();
              onDelete();
            }}
          >
            <Text style={styles.deleteButtonText}>🗑️ 친구 삭제</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onDismiss}>
            <Text style={styles.cancelButtonText}>취소</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: color.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: color.light,
  },
  name: {
    fontWeight: "bold",
    color: color.dark,
  },
  deleteButton: {
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: color.white,
    borderRadius: 8,
    marginBottom: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    color: color.red,
    fontWeight: "500",
  },
  cancelButton: {
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: color.light,
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: color.dark,
    fontWeight: "500",
  },
});