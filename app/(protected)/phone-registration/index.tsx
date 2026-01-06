import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import {
  TextInput,
  Button,
  Text,
  HelperText,
  IconButton,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { RFValue } from "react-native-responsive-fontsize";
import { color, backgroundColor } from "@/common/styles/color";
import { useUpdateProfileMutation } from "@/domain/members/hooks/mutations/memberMutations";
import path from "@/common/constants/path";
import { SafeAreaView } from "react-native-safe-area-context";
import { TERMS_OF_SERVICE, PRIVACY_POLICY } from "@/common/constants/terms";

type ModalType = "terms" | "privacy" | null;

export default function PhoneRegistrationScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);
  const [isPrivacyAgreed, setIsPrivacyAgreed] = useState(false);
  const [termsError, setTermsError] = useState("");
  const [privacyError, setPrivacyError] = useState("");
  const [showModal, setShowModal] = useState<ModalType>(null);
  const { mutate: updateProfile, isPending } = useUpdateProfileMutation();

  // 전화번호 포맷팅 (010-0000-0000)
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, "");

    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handlePhoneNumberChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setPhoneNumber(formatted);
    setError("");
  };

  const validatePhoneNumber = () => {
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError("올바른 전화번호 형식이 아니에요 (010-0000-0000)");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    Keyboard.dismiss();
    let hasError = false;

    if (!validatePhoneNumber()) {
      hasError = true;
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

    if (hasError) return;

    updateProfile(
      { phoneNumber },
      {
        onSuccess: () => {
          // 전화번호 등록 완료 후 기도방 목록 화면으로 이동
          router.replace(path.showRoomList());
        },
        onError: () => {
          setError("전화번호 등록 중 오류가 발생했어요. 다시 시도해주세요.");
        },
      }
    );
  };

  const getModalContent = () => {
    if (showModal === "terms") {
      return { title: "서비스 이용약관", content: TERMS_OF_SERVICE };
    } else if (showModal === "privacy") {
      return { title: "개인정보 처리방침", content: PRIVACY_POLICY };
    }
    return { title: "", content: "" };
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* 상단 헤더 */}
            <View style={styles.headerContainer}>
              <Text variant="headlineMedium" style={styles.title}>
                안녕하세요
              </Text>
              <Text style={styles.description}>
                기도방 초대를 더욱 쉽게 하기 위해{"\n"}
                기도자님의 전화번호가 필요해요.{"\n\n"}
                <Text style={styles.highlight}>동명이인을 구분하기 위한 목적으로만 사용</Text>되며,{"\n"}
                전화번호 뒷자리 4자리만{"\n"}
                다른 사용자에게 공개돼요.{"\n\n"}
                소중한 개인정보는 안전하게 보호됩니다.
              </Text>
            </View>

            {/* 입력 폼 영역 */}
            <View style={styles.formContainer}>
              <TextInput
                label="전화번호"
                value={phoneNumber}
                onChangeText={handlePhoneNumberChange}
                placeholder="010-0000-0000"
                keyboardType="phone-pad"
                mode="outlined"
                style={styles.input}
                maxLength={13}
                error={!!error}
                disabled={isPending}
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
                left={<TextInput.Icon icon="cellphone" />}
                theme={{
                  fonts: {
                    bodyLarge: { fontSize: RFValue(16) },
                  },
                }}
              />
              <HelperText type="error" visible={!!error} style={styles.errorText}>
                {error}
              </HelperText>

              {/* 약관 동의 */}
              <View style={styles.agreementContainer}>
                {/* 서비스 이용약관 */}
                <View style={styles.agreementItem}>
                  <View style={styles.checkboxRow}>
                    <TouchableOpacity
                      onPress={() => {
                        setIsTermsAgreed(!isTermsAgreed);
                        if (termsError) setTermsError("");
                      }}
                      disabled={isPending}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          isTermsAgreed && styles.checkboxChecked,
                        ]}
                      >
                        {isTermsAgreed && <Text style={styles.checkmark}>✓</Text>}
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.agreementTextContainer}
                      onPress={() => setShowModal("terms")}
                    >
                      <Text style={styles.agreementText}>
                        <Text style={styles.requiredMark}>[필수] </Text>
                        서비스 이용약관에 동의합니다
                        <Text style={styles.viewTerms}> 보기</Text>
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <HelperText type="error" visible={!!termsError}>
                    {termsError}
                  </HelperText>
                </View>

                {/* 개인정보 처리방침 */}
                <View style={styles.agreementItem}>
                  <View style={styles.checkboxRow}>
                    <TouchableOpacity
                      onPress={() => {
                        setIsPrivacyAgreed(!isPrivacyAgreed);
                        if (privacyError) setPrivacyError("");
                      }}
                      disabled={isPending}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          isPrivacyAgreed && styles.checkboxChecked,
                        ]}
                      >
                        {isPrivacyAgreed && <Text style={styles.checkmark}>✓</Text>}
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.agreementTextContainer}
                      onPress={() => setShowModal("privacy")}
                    >
                      <Text style={styles.agreementText}>
                        <Text style={styles.requiredMark}>[필수] </Text>
                        개인정보 처리방침에 동의합니다
                        <Text style={styles.viewTerms}> 보기</Text>
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <HelperText type="error" visible={!!privacyError}>
                    {privacyError}
                  </HelperText>
                </View>

                {/* 전체 동의 */}
                <TouchableOpacity
                  style={styles.allAgreeButton}
                  onPress={() => {
                    const newValue = !isTermsAgreed || !isPrivacyAgreed;
                    setIsTermsAgreed(newValue);
                    setIsPrivacyAgreed(newValue);
                    if (newValue) {
                      setTermsError("");
                      setPrivacyError("");
                    }
                  }}
                  disabled={isPending}
                >
                  <Text style={styles.allAgreeText}>전체 동의하기</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 하단 액션 버튼 영역 */}
            <View style={styles.actionContainer}>
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.button}
                labelStyle={styles.buttonLabel}
                disabled={isPending || phoneNumber.length === 0}
                loading={isPending}
                uppercase={false}
                contentStyle={styles.buttonContent}
              >
                {isPending ? "등록 중..." : "시작하기"}
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 약관 모달 */}
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
            >
              확인
            </Button>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: backgroundColor.default,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: RFValue(20),
    justifyContent: "space-between",
  },
  headerContainer: {
    alignItems: "center",
    marginTop: RFValue(20),
    marginBottom: RFValue(10),
  },
  title: {
    fontSize: RFValue(22),
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    lineHeight: RFValue(28),
    marginBottom: RFValue(16),
  },
  description: {
    fontSize: RFValue(14),
    color: "#666",
    textAlign: "center",
    lineHeight: RFValue(20),
  },
  highlight: {
    fontWeight: "bold",
    color: color.secondary,
  },
  formContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingTop: RFValue(8),
    paddingBottom: RFValue(10),
  },
  input: {
    marginBottom: RFValue(4),
    backgroundColor: color.white,
    fontSize: RFValue(16),
  },
  errorText: {
    fontSize: RFValue(14),
    textAlign: "left",
    paddingHorizontal: RFValue(5),
  },
  agreementContainer: {
    marginTop: RFValue(8),
  },
  agreementItem: {
    marginBottom: RFValue(2),
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: RFValue(24),
    height: RFValue(24),
    borderWidth: 2,
    borderColor: "#757575",
    borderRadius: RFValue(4),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  checkboxChecked: {
    backgroundColor: color.secondary,
    borderColor: color.secondary,
  },
  checkmark: {
    color: "#fff",
    fontSize: RFValue(16),
    fontWeight: "bold",
  },
  agreementTextContainer: {
    flex: 1,
    marginLeft: RFValue(12),
  },
  agreementText: {
    fontSize: RFValue(14),
    color: "#333",
  },
  requiredMark: {
    color: color.error,
    fontWeight: "500",
  },
  viewTerms: {
    color: color.primary,
    textDecorationLine: "underline",
  },
  allAgreeButton: {
    marginTop: RFValue(8),
    paddingVertical: RFValue(8),
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  allAgreeText: {
    color: color.secondary,
    fontSize: RFValue(14),
    fontWeight: "600",
  },
  actionContainer: {
    paddingBottom: RFValue(10),
  },
  button: {
    height: RFValue(50),
  },
  buttonLabel: {
    fontSize: RFValue(18),
    lineHeight: RFValue(24),
  },
  buttonContent: {
    height: "100%",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: backgroundColor.white,
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
    alignItems: "center",
  },
  modalButton: {
    width: RFValue(120),
  },
});
