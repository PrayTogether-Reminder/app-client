import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Keyboard,
  Platform,
} from "react-native";
import {
  TextInput,
  Text,
  HelperText,
  Button,
  IconButton,
} from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { RFValue } from "react-native-responsive-fontsize";
import { backgroundColor, color } from "@/common/styles/color";
import { BackButtonHeader } from "@/common/components/header";
import { useGoogleSignupMutation } from "@/domain/auth/hooks/mutations/useAuthMutation";
import { useAuthStore } from "@/domain/auth/stores/useAuthStore";
import path from "@/common/constants/path";
import { Analytics } from "@/common/services/analytics";
import { SafeAreaView } from "react-native-safe-area-context";
import { TERMS_OF_SERVICE, PRIVACY_POLICY } from "@/common/constants/terms";

type ModalType = "terms" | "privacy" | null;

export default function GoogleSignupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    idToken: string;
    email: string;
    name: string;
  }>();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);
  const [isPrivacyAgreed, setIsPrivacyAgreed] = useState(false);
  const [termsError, setTermsError] = useState("");
  const [privacyError, setPrivacyError] = useState("");
  const [showModal, setShowModal] = useState<ModalType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: googleSignup } = useGoogleSignupMutation();
  const setLoginState = useAuthStore((state) => state.login);

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
    if (phoneError) setPhoneError("");
  };

  const validatePhoneNumber = () => {
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setPhoneError("올바른 전화번호 형식이 아니에요 (010-0000-0000)");
      return false;
    }
    return true;
  };

  const handleSignup = () => {
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

    setIsSubmitting(true);

    googleSignup(
      {
        idToken: params.idToken,
        email: params.email,
        name: params.name || null,
        phoneNumber: phoneNumber.replace(/-/g, ""),
      },
      {
        onSuccess: (data) => {
          if (!data) {
            setPhoneError("회원가입에 실패했습니다.");
            return;
          }
          Analytics.logSignUp("google");
          setLoginState(data.accessToken, data.refreshToken);
          router.replace(path.showRoomList());
        },
        onError: (error) => {
          setPhoneError(error.message || "회원가입에 실패했습니다.");
        },
        onSettled: () => {
          setIsSubmitting(false);
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
    <SafeAreaView style={styles.container}>
      <BackButtonHeader
        onPress={() => router.back()}
        disabled={isSubmitting}
        style={styles.header}
      />

      <View style={styles.content}>
        <Text variant="titleLarge" style={styles.title}>
          전화번호 입력
        </Text>
        <Text style={styles.description}>
          동명이인을 구분하기 위해 전화번호가 필요해요.{"\n"}
          전화번호 뒷자리 4자리만 다른 사용자에게 공개돼요 😊
        </Text>
        <Text style={styles.subtitle}>
          Google 계정: {params.email}
        </Text>

        <TextInput
          label="전화번호"
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange}
          placeholder="010-0000-0000"
          keyboardType="phone-pad"
          mode="outlined"
          style={styles.input}
          maxLength={13}
          error={!!phoneError}
          disabled={isSubmitting}
          returnKeyType="done"
          left={<TextInput.Icon icon="cellphone" />}
          theme={{
            fonts: {
              bodyLarge: { fontSize: RFValue(16) },
            },
          }}
        />
        <HelperText type="error" visible={!!phoneError}>
          {phoneError}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
            disabled={isSubmitting}
          >
            <Text style={styles.allAgreeText}>전체 동의하기</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSignup}
            style={styles.button}
            labelStyle={styles.buttonLabel}
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            {isSubmitting ? "가입 중..." : "가입 완료"}
          </Button>
        </View>
      </View>

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
  container: {
    flex: 1,
    backgroundColor: backgroundColor.default,
  },
  header: {
    // marginTop 제거하여 상단 잘림 방지
  },
  content: {
    flex: 1,
    padding: RFValue(20),
  },
  title: {
    fontSize: RFValue(22),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: RFValue(12),
    marginTop: RFValue(10),
    paddingVertical: RFValue(1),
  },
  description: {
    fontSize: RFValue(14),
    color: "#666",
    textAlign: "center",
    lineHeight: RFValue(20),
    marginBottom: RFValue(16),
  },
  subtitle: {
    fontSize: RFValue(13),
    color: color.gray,
    textAlign: "center",
    marginBottom: RFValue(20),
  },
  input: {
    backgroundColor: color.white,
  },
  agreementContainer: {
    marginTop: RFValue(16),
  },
  agreementItem: {
    marginBottom: RFValue(4),
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
    marginTop: RFValue(12),
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
  buttonContainer: {
    marginTop: "auto",
  },
  button: {
    paddingVertical: RFValue(4),
  },
  buttonLabel: {
    paddingVertical: Platform.OS === "ios" ? RFValue(2) : RFValue(4),
    fontSize: RFValue(18),
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
