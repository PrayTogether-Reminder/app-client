import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {
  Portal,
  Modal,
  Text,
  TextInput,
  Button,
  IconButton,
} from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import Feather from "@expo/vector-icons/Feather";
import { showAlert } from "@/common/components/modal/stores/useAlertStore";
import { useRoomMembersQuery } from "@/domain/rooms/hooks/queries/useRoomQueries";
import { useSelectedRoomStore } from "@/domain/rooms/stores/useSelectedRoomStore";
import PrayerMemberSelectionModal from "../../../creation/_components/modal/PrayerMemberSelectionModal";

interface PrayerContentAddDialogProps {
  visible: boolean;
  onDismiss: () => void;
  onAdd: (memberName: string, content: string) => void;
}

export default function PrayerContentAddDialog({
  visible,
  onDismiss,
  onAdd,
}: PrayerContentAddDialogProps) {
  const [memberName, setMemberName] = useState("");
  const [content, setContent] = useState("");
  const [memberSelectionModal, setMemberSelectionModal] = useState(false);
  
  const room = useSelectedRoomStore().selectedRoom;
  const { data: roomMembers } = useRoomMembersQuery(room?.id ?? null);

  const handleAdd = () => {
    if (!memberName.trim()) {
      showAlert({
        title: "입력 확인",
        message: "기도 대상을 선택해주세요.",
      });
      return;
    }

    if (!content.trim()) {
      showAlert({
        title: "입력 확인",
        message: "기도 내용을 입력해주세요.",
      });
      return;
    }

    onAdd(memberName, content);
    setMemberName("");
    setContent("");
  };

  const handleCancel = () => {
    setMemberName("");
    setContent("");
    onDismiss();
  };

  return (
    <>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={handleCancel}
          contentContainerStyle={styles.modalContainer}
          style={styles.modal}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.content}>
              <Text style={styles.title}>기도 내용 추가</Text>

              <View style={styles.fieldset}>
                <Text style={styles.label}>기도 대상</Text>
                <Button
                  mode="outlined"
                  onPress={() => setMemberSelectionModal(true)}
                  style={styles.memberButton}
                >
                  {memberName || "선택하세요"}
                </Button>
              </View>

              <View style={styles.fieldset}>
                <Text style={styles.label}>기도 내용</Text>
                <TextInput
                  placeholder="기도 내용을 입력하세요"
                  value={content}
                  onChangeText={setContent}
                  style={styles.inputMultiline}
                  mode="outlined"
                  multiline
                  numberOfLines={6}
                />
              </View>

              <View style={styles.buttonContainer}>
                <Button
                  mode="outlined"
                  onPress={handleCancel}
                  style={styles.cancelButton}
                  labelStyle={styles.buttonLabel}
                >
                  취소
                </Button>
                <Button
                  mode="contained"
                  onPress={handleAdd}
                  style={styles.addButton}
                  labelStyle={styles.buttonLabel}
                >
                  추가
                </Button>
              </View>

              <IconButton
                icon={() => <Feather name="x" size={RFValue(24)} color="black" />}
                onPress={handleCancel}
                style={styles.closeButton}
                size={24}
              />
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </Portal>

      <PrayerMemberSelectionModal
        visible={memberSelectionModal}
        onDismiss={() => setMemberSelectionModal(false)}
        members={roomMembers || []}
        onSelectMember={(member) => {
          setMemberName(member.name);
          setMemberSelectionModal(false);
        }}
        onCustomNamePress={() => {
          // 직접 입력 기능 구현 필요 시 추가
          setMemberSelectionModal(false);
        }}
      />
    </>
  );
}

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-start",
    paddingTop: RFValue(50),
  },
  modalContainer: {
    backgroundColor: "white",
    width: windowWidth < 600 ? "90%" : "70%",
    alignSelf: "center",
    borderRadius: RFValue(8),
    padding: RFValue(16),
    elevation: 5,
  },
  content: {
    gap: RFValue(16),
    position: "relative",
  },
  title: {
    fontSize: RFValue(18),
    fontWeight: "bold",
    marginBottom: RFValue(8),
  },
  fieldset: {
    marginVertical: RFValue(4),
  },
  label: {
    fontSize: RFValue(14),
    marginBottom: RFValue(4),
  },
  memberButton: {
    width: "100%",
  },
  inputMultiline: {
    width: "100%",
    height: RFValue(120),
    backgroundColor: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: RFValue(12),
    marginTop: RFValue(8),
    marginBottom: RFValue(16),
  },
  cancelButton: {
    width: windowWidth < 400 ? "35%" : "30%",
  },
  addButton: {
    width: windowWidth < 400 ? "35%" : "30%",
  },
  buttonLabel: {
    fontSize: RFValue(16),
  },
  closeButton: {
    position: "absolute",
    top: 0,
    right: 0,
  },
});