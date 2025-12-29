import React, { useState } from "react";
import {
  View,
  Keyboard,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
} from "react-native";
import {
  TextInput,
  Button,
  HelperText,
  Text,
  IconButton,
} from "react-native-paper";
import { TextButton } from "@/common/components/button";
import { RFValue } from "react-native-responsive-fontsize";
import { backgroundColor, color } from "@/common/styles/color";
import { Analytics } from "@/common/services/analytics";
import { TERMS_OF_SERVICE, PRIVACY_POLICY } from "@/common/constants/terms";

export interface NameStepProps {
  name: string;
  setName: (name: string) => void;
  nameError: string;
  setNameError: (error: string) => void;
  onNext: () => void;
  isSubmitting: boolean;
}

type ModalType = "terms" | "privacy" | null;

const NameStep: React.FC<NameStepProps> = ({
  name,
  setName,
  nameError,
  setNameError,
  onNext,
  isSubmitting,
}) => {
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);
  const [isPrivacyAgreed, setIsPrivacyAgreed] = useState(false);
  const [showModal, setShowModal] = useState<ModalType>(null);
  const [termsError, setTermsError] = useState("");
  const [privacyError, setPrivacyError] = useState("");

  const handleGoToEmail = () => {
    Keyboard.dismiss();

    let hasError = false;

    if (!name.trim()) {
      setNameError("이름을 입력해주세요.");
      hasError = true;
    } else {
      setNameError("");
    }

    if (!isTermsAgreed) {
      setTermsError("서비스 이용약관에 동의해주세요.");
      hasError = true;
    } else {
      setTermsError("");
    }

    if (!isPrivacyAgreed) {
      setPrivacyError("개인정보 처리방침에 동의해주세요.");
      hasError = true;
    } else {
      setPrivacyError("");
    }

    if (!hasError) {
      Analytics.logSignUpNameCompleted(); // 이름 입력 완료 이벤트
      onNext();
    }
  };

  const handleTermsCheckbox = () => {
    setIsTermsAgreed(!isTermsAgreed);
    if (termsError) setTermsError("");
  };

  const handlePrivacyCheckbox = () => {
    setIsPrivacyAgreed(!isPrivacyAgreed);
    if (privacyError) setPrivacyError("");
  };

  const getModalContent = () => {
    if (showModal === "terms") {
      return {
        title: "서비스 이용약관",
        content: TERMS_OF_SERVICE,
      };
    } else if (showModal === "privacy") {
      return {
        title: "개인정보 처리방침",
        content: PRIVACY_POLICY,
      };
    }
    return { title: "", content: "" };
  };

  return (
    <>
      <View style={styles.page}>
        <Text variant="titleLarge" style={styles.stepTitle}>
          이름을 입력해주세요
        </Text>
        <TextInput
          label="이름"
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (nameError) setNameError("");
          }}
          mode="outlined"
          style={styles.input}
          error={!!nameError}
          disabled={isSubmitting}
          theme={{
            fonts: {
              bodyLarge: { fontSize: RFValue(16) },
            },
          }}
        />
        <HelperText
          type="error"
          visible={!!nameError}
          style={styles.helperText}
        >
          {nameError}
        </HelperText>

        <View style={styles.agreementContainer}>
          {/* 서비스 이용약관 */}
          <View style={styles.agreementItem}>
            <View style={styles.checkboxRow}>
              <TouchableOpacity
                onPress={handleTermsCheckbox}
                disabled={isSubmitting}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.customCheckbox,
                    isTermsAgreed && styles.customCheckboxChecked,
                  ]}
                >
                  {isTermsAgreed && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.agreementTextContainer}
                onPress={() => setShowModal("terms")}
                activeOpacity={0.7}
              >
                <Text style={styles.agreementText}>
                  <Text style={styles.requiredMark}>[필수] </Text>
                  서비스 이용약관에 동의합니다
                  <Text style={styles.viewTerms}> 보기</Text>
                </Text>
              </TouchableOpacity>
            </View>
            <HelperText
              type="error"
              visible={!!termsError}
              style={styles.agreementError}
            >
              {termsError}
            </HelperText>
          </View>

          {/* 개인정보 처리방침 */}
          <View style={styles.agreementItem}>
            <View style={styles.checkboxRow}>
              <TouchableOpacity
                onPress={handlePrivacyCheckbox}
                disabled={isSubmitting}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.customCheckbox,
                    isPrivacyAgreed && styles.customCheckboxChecked,
                  ]}
                >
                  {isPrivacyAgreed && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.agreementTextContainer}
                onPress={() => setShowModal("privacy")}
                activeOpacity={0.7}
              >
                <Text style={styles.agreementText}>
                  <Text style={styles.requiredMark}>[필수] </Text>
                  개인정보 처리방침에 동의합니다
                  <Text style={styles.viewTerms}> 보기</Text>
                </Text>
              </TouchableOpacity>
            </View>
            <HelperText
              type="error"
              visible={!!privacyError}
              style={styles.agreementError}
            >
              {privacyError}
            </HelperText>
          </View>

          {/* 전체 동의 옵션 (선택사항) */}
          <View style={styles.allAgreeContainer}>
            <TextButton
              onPress={() => {
                const newValue = !isTermsAgreed || !isPrivacyAgreed;
                setIsTermsAgreed(newValue);
                setIsPrivacyAgreed(newValue);
                if (newValue) {
                  setTermsError("");
                  setPrivacyError("");
                }
              }}
              disabled={isSubmitting}
              textColor={color.secondary}
              style={styles.allAgreeButton}
              labelStyle={styles.allAgreeText}
            >
              전체 동의하기
            </TextButton>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleGoToEmail}
            style={styles.button}
            labelStyle={styles.buttonLabel}
            disabled={isSubmitting}
          >
            다음
          </Button>
        </View>
      </View>

      <Modal
        visible={showModal !== null}
        onRequestClose={() => setShowModal(null)}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text variant="titleLarge" style={styles.modalTitle}>
              {getModalContent().title}
            </Text>
            <IconButton
              icon="close"
              size={RFValue(24)}
              onPress={() => setShowModal(null)}
            />
          </View>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.termsText}>{getModalContent().content}</Text>
          </ScrollView>
          <View style={styles.modalFooter}>
            <Button
              mode="contained"
              onPress={() => setShowModal(null)}
              style={styles.modalButton}
              labelStyle={styles.modalButtonLabel}
            >
              확인
            </Button>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    padding: RFValue(20),
  },
  stepTitle: {
    marginBottom: RFValue(16),
    textAlign: "center",
    fontWeight: "bold",
    fontSize: RFValue(22),
    lineHeight: RFValue(28),
  },
  input: {
    fontSize: RFValue(16),
  },
  helperText: {
    fontSize: RFValue(14),
  },
  agreementContainer: {
    marginTop: RFValue(20),
    marginBottom: RFValue(10),
  },
  agreementItem: {
    marginBottom: RFValue(2),
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  customCheckbox: {
    width: RFValue(24),
    height: RFValue(24),
    borderWidth: 2,
    borderColor: "#757575",
    borderRadius: RFValue(4),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  customCheckboxChecked: {
    backgroundColor: color.secondary || "#FF6B6B",
    borderColor: color.secondary || "#FF6B6B",
  },
  checkmark: {
    color: "#fff",
    fontSize: RFValue(18),
    fontWeight: "bold",
  },
  agreementTextContainer: {
    flex: 1,
    marginLeft: RFValue(12),
  },
  agreementText: {
    fontSize: RFValue(14),
    color: "#333",
    lineHeight: RFValue(18),
  },
  requiredMark: {
    color: color.error || "#d32f2f",
    fontWeight: "500",
  },
  viewTerms: {
    color: color.primary || "#1976d2",
    textDecorationLine: "underline",
  },
  agreementError: {
    fontSize: RFValue(12),
    marginTop: RFValue(4),
  },
  allAgreeContainer: {
    marginTop: RFValue(6),
    paddingTop: RFValue(6),
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    alignItems: "center",
  },
  allAgreeButton: {
    paddingHorizontal: RFValue(16),
  },
  allAgreeText: {
    fontSize: RFValue(14),
    fontWeight: "600",
    lineHeight: RFValue(18),
  },
  buttonContainer: {
    justifyContent: "center",
    marginTop: "auto",
  },
  button: {
    paddingVertical: RFValue(4),
  },
  buttonLabel: {
    fontSize: RFValue(22),
    lineHeight: RFValue(28),
  },
  modalContainer: {
    flex: 1,
    backgroundColor: backgroundColor.white || "#ffffff",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: RFValue(16),
    paddingVertical: RFValue(8),
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: RFValue(18),
    fontWeight: "bold",
  },
  modalContent: {
    flex: 1,
    padding: RFValue(20),
  },
  termsText: {
    fontSize: RFValue(14),
    lineHeight: RFValue(22),
    color: "#333",
  },
  modalFooter: {
    padding: RFValue(16),
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  modalButton: {
    height: RFValue(48),
    width: RFValue(120),
    justifyContent: "center",
  },
  modalButtonLabel: {
    fontSize: RFValue(16),
    lineHeight: RFValue(20),
  },
});

export default NameStep;
