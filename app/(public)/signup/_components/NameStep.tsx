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
  Checkbox,
  IconButton,
} from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { backgroundColor, color } from "@/common/styles/color";

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

  const termsOfService = `기도함께 서비스 이용약관

제1조 (목적)
본 약관은 기도함께 앱(이하 "서비스")의 이용과 관련하여 서비스 제공자와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제2조 (서비스 내용)
본 서비스는 다음과 같은 기능을 제공합니다:
• 기도방 생성 및 참여
• 기도제목 작성 및 공유
• 기도 완료 알림 전송
• 기타 관련 부가 서비스

제3조 (회원가입)
1. 서비스 이용을 위해 이름(닉네임), 이메일 주소, 핸드폰 번호를 제공해야 합니다.
2. 허위 정보 제공 시 서비스 이용이 제한될 수 있습니다.

제4조 (이용자 의무)
이용자는 다음 행위를 하여서는 안 됩니다:
• 타인의 개인정보 도용
• 종교적 갈등 유발 또는 타 종교 비방
• 음란하거나 폭력적인 내용 게시
• 스팸성 내용 반복 작성
• 기타 공공질서나 미풍양속 위반 행위

제5조 (서비스 제한)
이용자가 제4조를 위반한 경우 서비스 이용이 제한될 수 있습니다.

제6조 (면책조항)
1. 천재지변, 시스템 장애 등 불가항력으로 인한 서비스 중단에 대해 책임지지 않습니다.
2. 이용자 간 분쟁 및 이용자가 게시한 내용에 대해 책임지지 않습니다.

제7조 (연락처)
서비스 관련 문의: praytogethernoreplay@gmail.com

시행일: 2025년 6월 3일`;

  const privacyPolicy = `개인정보 처리방침

제1조 (개인정보 수집 및 이용목적)
수집항목: 이름(닉네임), 이메일 주소, 핸드폰 번호
이용목적: 회원 식별, 동명이인 구분, 서비스 제공, 기도 완료 알림 발송

제2조 (개인정보 보유 및 이용기간)
회원 탈퇴 시까지 보유하며, 탈퇴 즉시 삭제합니다.

제3조 (개인정보 제3자 제공)
이용자의 개인정보를 외부에 제공하지 않습니다.

제4조 (개인정보 처리 위탁)
개인정보 처리를 외부에 위탁하지 않습니다.

제5조 (이용자 권리)
언제든지 개인정보 열람, 수정, 삭제를 요청할 수 있습니다.
요청방법: praytogethernoreplay@gmail.com으로 연락

제6조 (개인정보 보호책임자)
담당자: 김창현
연락처: praytogethernoreplay@gmail.com

제7조 (권익침해 구제)
개인정보 침해 관련 신고 및 상담은 아래 기관에 문의하시기 바랍니다:
• 개인정보침해신고센터: (국번없이) 118
• 개인정보분쟁조정위원회: (국번없이) 1833-6972

시행일: 2025년 6월 3일`;

  const getModalContent = () => {
    if (showModal === "terms") {
      return {
        title: "서비스 이용약관",
        content: termsOfService,
      };
    } else if (showModal === "privacy") {
      return {
        title: "개인정보 처리방침",
        content: privacyPolicy,
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
              <Checkbox
                status={isTermsAgreed ? "checked" : "unchecked"}
                onPress={handleTermsCheckbox}
                disabled={isSubmitting}
                color={color.secondary || "#FF6B6B"}
                uncheckedColor="#757575"
              />
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
              <Checkbox
                status={isPrivacyAgreed ? "checked" : "unchecked"}
                onPress={handlePrivacyCheckbox}
                disabled={isSubmitting}
                color={color.secondary || "#FF6B6B"}
                uncheckedColor="#757575"
              />
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
            <Button
              mode="text"
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
              compact
              style={styles.allAgreeButton}
              labelStyle={styles.allAgreeText}
            >
              전체 동의하기
            </Button>
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
  agreementTextContainer: {
    flex: 1,
    marginLeft: RFValue(8),
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
    height: RFValue(50),
    justifyContent: "center",
    marginTop: "auto",
  },
  button: {
    height: "100%",
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
