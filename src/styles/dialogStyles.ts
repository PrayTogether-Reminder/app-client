import { StyleSheet, Dimensions } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const windowWidth = Dimensions.get("window").width;

export const dialogStyles = StyleSheet.create({
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
    marginBottom: RFValue(8),
    fontWeight: "600",
  },
  input: {
    width: "100%",
    backgroundColor: "white",
    fontSize: RFValue(16),
  },
  inputMultiline: {
    width: "100%",
    height: RFValue(150),
    backgroundColor: "white",
  },
  inputMultilineSmall: {
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
  saveButton: {
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
  memberButton: {
    width: "100%",
  },
});

// 다이얼로그별 커스터마이징 가능한 스타일 생성 함수
export const createDialogStyles = (config?: {
  modalPaddingTop?: number;
  containerWidth?: { small: string; large: string };
  inputHeight?: number;
}) => {
  const customStyles = { ...dialogStyles };
  
  if (config?.modalPaddingTop) {
    customStyles.modal = {
      ...dialogStyles.modal,
      paddingTop: RFValue(config.modalPaddingTop),
    };
  }
  
  if (config?.containerWidth) {
    customStyles.modalContainer = {
      ...dialogStyles.modalContainer,
      width: windowWidth < 600 ? config.containerWidth.small : config.containerWidth.large,
    };
  }
  
  if (config?.inputHeight) {
    customStyles.inputMultiline = {
      ...dialogStyles.inputMultiline,
      height: RFValue(config.inputHeight),
    };
  }
  
  return StyleSheet.create(customStyles);
};