import { showAlert } from "@/common/components/modal/stores/useAlertStore";
import { useCreatePrayerTitleMutation } from "@/domain/prayers/hooks/mutations/usePrayerMutations";
import { useSelectedRoomStore } from "@/domain/rooms/stores/useSelectedRoomStore";
import Feather from "@expo/vector-icons/Feather";
import React, { useEffect, useRef } from "react";
import {
  Dimensions,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  Button,
  IconButton,
  Modal,
  TextInput as PaperTextInput,
  Portal,
  Text,
} from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";

type PrayerTitleCreationDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function PrayerTitleCreationDialog({
  open,
  setOpen,
}: PrayerTitleCreationDialogProps) {
  const inputValues = useRef({
    title: "",
  });

  const titleInputRef = useRef(null);
  const room = useSelectedRoomStore().selectedRoom;
  const { mutate: createPrayerTitle } = useCreatePrayerTitleMutation();

  // 모달이 열릴 때 입력값 초기화
  useEffect(() => {
    if (open) {
      inputValues.current = {
        title: "",
      };
    }
  }, [open]);

  const closeModal = () => {
    setOpen(false);
  };

  const handleTitleChange = (text: string) => {
    inputValues.current.title = text;
  };

  // 기도 제목 생성 처리
  const handleCreatePrayerTitle = () => {
    const title = inputValues.current.title;

    if (!title.trim()) {
      showAlert({
        title: "기도 제목 생성",
        message: "기도 제목을 입력해주세요.",
      });
      return;
    }

    if (!room?.id) {
      showAlert({
        title: "오류",
        message: "기도방 정보를 찾을 수 없습니다.",
      });
      return;
    }

    createPrayerTitle({
      roomId: room.id,
      title: title.trim(),
    });
    
    closeModal();
  };

  return (
    <Portal>
      <Modal
        visible={open}
        onDismiss={closeModal}
        contentContainerStyle={styles.modalContainer}
        style={styles.modal}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.content}>
            <Text style={styles.title}>기도 제목 작성</Text>

            <View style={styles.fieldset}>
              <Text style={styles.label}>기도 제목</Text>
              <PaperTextInput
                ref={titleInputRef}
                placeholder="무엇을 위해 기도하시나요?"
                onChangeText={handleTitleChange}
                style={styles.input}
                mode="outlined"
                defaultValue=""
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus={true}
              />
            </View>

            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={closeModal}
                style={styles.cancelButton}
                labelStyle={styles.buttonLabel}
              >
                취소
              </Button>
              <Button
                mode="contained"
                onPress={handleCreatePrayerTitle}
                style={styles.createButton}
                labelStyle={styles.buttonLabel}
              >
                생성
              </Button>
            </View>

            <IconButton
              icon={() => <Feather name="x" size={RFValue(24)} color="black" />}
              onPress={closeModal}
              style={styles.closeButton}
              size={24}
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </Portal>
  );
}

// 화면 너비 가져오기 (반응형 계산에 사용)
const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-start",
    paddingTop: RFValue(100), // 화면 상단에서 100px 아래에 위치
  },
  modalContainer: {
    backgroundColor: "white",
    width: windowWidth < 600 ? "85%" : "70%",
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
    lineHeight: RFValue(24),
  },
  fieldset: {
    marginVertical: RFValue(4),
  },
  label: {
    fontSize: RFValue(14),
    marginBottom: RFValue(4),
    lineHeight: RFValue(20),
  },
  input: {
    width: "100%",
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
  createButton: {
    width: windowWidth < 400 ? "35%" : "30%",
  },
  buttonLabel: {
    fontSize: RFValue(16),
    lineHeight: RFValue(22),
  },
  closeButton: {
    position: "absolute",
    top: 0,
    right: 0,
  },
});