import React, { useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from "react-native";
import {
  Portal,
  Modal,
  Button,
  TextInput as PaperTextInput,
  Text,
  IconButton,
} from "react-native-paper";
import Feather from "@expo/vector-icons/Feather";
import { RFValue } from "react-native-responsive-fontsize";
import useCloseOnBack from "../../../../common/services/back-handler/useCloseOnBack";

type RoomCreationDialogProp = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function RoomCreationDialog({
  open,
  setOpen,
}: RoomCreationDialogProp) {
  const inputValues = useRef({
    title: "",
    description: "",
  });

  const titleInputRef = useRef(null);
  const descriptionInputRef = useRef(null);

  // 모달이 열릴 때 입력값 초기화
  useEffect(() => {
    if (open) {
      inputValues.current = {
        title: "",
        description: "",
      };
    }
  }, [open]);

  const closeModal = () => {
    setOpen(false);
  };

  const handleTitleChange = (text: string) => {
    inputValues.current.title = text;
  };

  const handleDescriptionChange = (text: string) => {
    inputValues.current.description = text;
  };

  const onCreateRoom = () => {
    console.log(
      "방 생성 titld: ",
      inputValues.current.title,
      ", description: ",
      inputValues.current.description
    );
  };

  // 기도방 생성 처리
  const handleCreateRoom = () => {
    const title = inputValues.current.title;
    const description = inputValues.current.description;

    if (!title.trim()) {
      alert("방 제목을 입력해주세요");
      return;
    }

    if (!description.trim()) {
      alert("방 설명을 입력해주세요");
      return;
    }

    onCreateRoom();
    closeModal();
  };

  return (
    <Portal>
      <Modal
        visible={open}
        onDismiss={closeModal}
        contentContainerStyle={styles.modalContainer}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.content}>
            <Text style={styles.title}>기도방 생성</Text>

            <View style={styles.fieldset}>
              <Text style={styles.label}>방 제목</Text>
              <PaperTextInput
                ref={titleInputRef}
                placeholder="방 제목이 무엇인가요?"
                onChangeText={handleTitleChange}
                style={styles.input}
                mode="outlined"
                // value prop을 제공하지 않음 (비제어 방식)
                defaultValue=""
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.fieldsetMultiline}>
              <Text style={styles.label}>방 설명</Text>
              <PaperTextInput
                ref={descriptionInputRef}
                placeholder="어떤 기도를 위한 방인가요?"
                onChangeText={handleDescriptionChange}
                style={styles.inputMultiline}
                mode="outlined"
                multiline
                numberOfLines={4}
                // value prop을 제공하지 않음 (비제어 방식)
                defaultValue=""
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <Button
              mode="contained"
              onPress={handleCreateRoom}
              style={styles.createButton}
              labelStyle={styles.buttonLabel}
            >
              생성
            </Button>

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
  overlay: {
    backgroundColor: "#BEBFC5",
    opacity: 0.6,
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
  },
  fieldset: {
    marginVertical: RFValue(4),
  },
  fieldsetMultiline: {
    marginVertical: RFValue(4),
  },
  label: {
    fontSize: RFValue(14),
    marginBottom: RFValue(4),
  },
  input: {
    width: "100%",
    backgroundColor: "white",
  },
  inputMultiline: {
    width: "100%",
    height: RFValue(100),
    backgroundColor: "white",
  },
  createButton: {
    alignSelf: "center",
    width: windowWidth < 400 ? "70%" : "50%",
    marginTop: RFValue(8),
    marginBottom: RFValue(16),
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
