import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
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
import { useProfileQuery } from "@/domain/members/hooks/queries/memberQueries";
import { useUpdateProfileMutation } from "@/domain/members/hooks/mutations/memberMutations";

export default function ProfileEditScreen() {
  const router = useRouter();
  const { data: profile } = useProfileQuery();
  const { mutate: updateProfile, isPending } = useUpdateProfileMutation();

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // 프로필 데이터로 초기화
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setPhoneNumber(profile.phoneNumber || "");
    }
  }, [profile]);

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
    setPhoneError("");
  };

  const validatePhoneNumber = () => {
    if (!phoneNumber) {
      setPhoneError("전화번호를 입력해주세요.");
      return false;
    }
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setPhoneError("올바른 전화번호 형식이 아니에요 (010-0000-0000)");
      return false;
    }
    return true;
  };

  const validateName = () => {
    if (!name.trim()) {
      setNameError("이름을 입력해주세요.");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    Keyboard.dismiss();

    let hasError = false;

    if (!validateName()) {
      hasError = true;
    }

    if (!validatePhoneNumber()) {
      hasError = true;
    }

    if (hasError) {
      return;
    }

    updateProfile(
      { name, phoneNumber },
      {
        onSuccess: () => {
          router.back();
        },
        onError: () => {
          setNameError("프로필 수정 중 오류가 발생했어요.");
        },
      }
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {/* 상단 헤더 */}
        <View style={styles.top}>
          <IconButton
            icon="arrow-left"
            size={RFValue(30)}
            onPress={() => router.back()}
            style={styles.backButton}
            disabled={isPending}
            iconColor={color.secondary}
          />
          <Text variant="titleLarge" style={styles.headerTitle}>
            프로필 수정
          </Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          {/* 입력 폼 영역 */}
          <View style={styles.formContainer}>
            <TextInput
              label="이름"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setNameError("");
              }}
              mode="outlined"
              style={styles.input}
              error={!!nameError}
              disabled={isPending}
              left={<TextInput.Icon icon="account" />}
              theme={{
                fonts: {
                  bodyLarge: { fontSize: RFValue(16) },
                },
              }}
            />
            <HelperText type="error" visible={!!nameError} style={styles.errorText}>
              {nameError}
            </HelperText>

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
              disabled={isPending}
              left={<TextInput.Icon icon="cellphone" />}
              theme={{
                fonts: {
                  bodyLarge: { fontSize: RFValue(16) },
                },
              }}
            />
            <HelperText type="error" visible={!!phoneError} style={styles.errorText}>
              {phoneError}
            </HelperText>

            <Text style={styles.infoText}>
              이메일은 변경할 수 없습니다.
            </Text>
          </View>

          {/* 하단 액션 버튼 영역 */}
          <View style={styles.actionContainer}>
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.button}
              labelStyle={styles.buttonLabel}
              disabled={isPending}
              loading={isPending}
              uppercase={false}
              contentStyle={styles.buttonContent}
            >
              {isPending ? "저장 중..." : "저장"}
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: RFValue(4),
    paddingTop: RFValue(16),
    paddingBottom: RFValue(12),
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  backButton: {
    marginLeft: 0,
    paddingLeft: 0,
  },
  headerTitle: {
    fontSize: RFValue(18),
    fontWeight: "bold",
    lineHeight: RFValue(24),
  },
  placeholder: {
    width: RFValue(48),
  },
  content: {
    flex: 1,
    padding: RFValue(20),
    justifyContent: "space-between",
  },
  formContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingTop: RFValue(20),
  },
  input: {
    marginBottom: RFValue(8),
    backgroundColor: color.white,
    fontSize: RFValue(16),
  },
  errorText: {
    fontSize: RFValue(14),
    textAlign: "left",
    paddingHorizontal: RFValue(5),
    marginBottom: RFValue(8),
  },
  infoText: {
    fontSize: RFValue(13),
    color: "#888",
    marginTop: RFValue(12),
    textAlign: "center",
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
});
