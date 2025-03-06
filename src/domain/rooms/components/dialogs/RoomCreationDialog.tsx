import React, { useEffect, useRef, useState } from "react";
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
  TextInput,
  Text,
  IconButton,
} from "react-native-paper";
import Feather from "@expo/vector-icons/Feather";
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";
import { keyboardHideDelFocus } from "../../../../common/services/keyboard/keyboardService";
import useCloseOnBack from "../../../../common/services/back-handler/useCloseOnBack";

type RoomCreationDialogProp = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function RoomCreationDialog({
  open,
  setOpen,
}: RoomCreationDialogProp) {
  if (open) console.log("room creation dialog open");
  else if (!open) console.log("room creation dialog close");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  const handleTitleChange = (title: string) => {
    setTitle(title);
  };
  const handleDescriptionChange = (description: string) => {
    setDescription(description);
  };

  useCloseOnBack(open, setOpen);

  keyboardHideDelFocus([titleRef, descriptionRef]);

  const closeModal = () => {
    setOpen(false);
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
              <TextInput
                ref={titleRef}
                placeholder="방 제목이 무엇인가요?"
                value={title}
                onChangeText={handleTitleChange}
                style={styles.input}
                mode="outlined"
              />
            </View>

            <View style={styles.fieldsetMultiline}>
              <Text style={styles.label}>방 설명</Text>
              <TextInput
                ref={descriptionRef}
                placeholder="어떤 기도를 위한 방인가요?"
                value={description}
                onChangeText={handleDescriptionChange}
                style={styles.inputMultiline}
                mode="outlined"
                multiline
                numberOfLines={4}
              />
            </View>

            <Button
              mode="contained"
              onPress={closeModal}
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
    width: windowWidth < 600 ? "85%" : "70%", // 작은 화면에서 더 넓게
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
  },
  inputMultiline: {
    width: "100%",
    height: RFValue(100),
  },
  createButton: {
    alignSelf: "center",
    width: windowWidth < 400 ? "70%" : "50%", // 작은 화면에서 더 넓게
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
