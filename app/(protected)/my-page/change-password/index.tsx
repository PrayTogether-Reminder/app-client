// app/(protected)/my-page/change-password/index.tsx
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
} from "react-native";
import {
  Text,
  List,
} from "react-native-paper";
import { FormInput } from "@/common/components/form";
import { PrimaryButton } from "@/common/components/button";
import { BackButtonHeader, AuthHeader } from "@/common/components/header";
import { useRouter } from "expo-router";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "@/common/styles/color";
import { useChangePasswordMutation } from "@/domain/auth/hooks/mutations/useAuthMutation";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const { mutate: changePassword } = useChangePasswordMutation();

  // 비밀번호 유효성 검사
  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "비밀번호는 8자 이상이어야 합니다.";
    }
    return null;
  };

  const handleChangePassword = async () => {
    // 초기화
    setNewPasswordError(null);
    setConfirmPasswordError(null);

    // 빈 값 검사
    if (newPassword.trim() === "") {
      setNewPasswordError("비밀번호를 입력해주세요.");
      return;
    }
    if (confirmPassword.trim() === "") {
      setConfirmPasswordError("비밀번호 확인을 입력해주세요.");
      return;
    }

    // 비밀번호 유효성 검사
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setNewPasswordError(passwordError);
      return;
    }

    // 비밀번호 확인 일치 검사
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);
    changePassword(
      { newPassword },
      {
        onSuccess: (data) => {
          setTimeout(() => {
            router.back();
          }, 1500);
        },
        onError: (error) => {
          setNewPasswordError(error?.message || "비밀번호 변경에 실패했습니다.");
        },
        onSettled: () => {
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <BackButtonHeader disabled={isLoading} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {/* 전체 콘텐츠 영역 */}
          <View style={styles.content}>
            {/* 상단 헤더 */}
            <AuthHeader
              icon="lock-reset"
              title="비밀번호 변경"
              description="새로운 비밀번호를 입력해주세요."
            />

            {/* 비밀번호 규칙 안내 */}
            <View style={styles.rulesContainer}>
              <Text variant="bodySmall" style={styles.rulesTitle}>
                비밀번호 규칙
              </Text>
              <List.Item
                title="8자 이상"
                left={(props) => <List.Icon {...props} icon="check-circle-outline" />}
                titleStyle={styles.ruleText}
                style={styles.ruleItem}
              />
            </View>

            {/* 입력 폼 영역 */}
            <View style={styles.formContainer}>
              <FormInput
                label="새 비밀번호"
                value={newPassword}
                onChangeText={setNewPassword}
                type="password"
                disabled={isLoading}
                icon="lock-outline"
                error={newPasswordError || undefined}
              />

              <FormInput
                label="새 비밀번호 확인"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                type="password"
                disabled={isLoading}
                icon="lock-check-outline"
                error={confirmPasswordError || undefined}
              />
            </View>

            {/* 하단 액션 버튼 영역 */}
            <View style={styles.actionContainer}>
              <PrimaryButton
                onPress={handleChangePassword}
                disabled={isLoading}
                loading={isLoading}
                icon="check"
              >
                {isLoading ? "변경 중..." : "비밀번호 변경"}
              </PrimaryButton>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: color.white,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: RFValue(24),
    justifyContent: "space-between",
  },
  rulesContainer: {
    backgroundColor: "#F5F5F5",
    borderRadius: RFValue(12),
    padding: RFValue(16),
    marginVertical: RFValue(16),
  },
  rulesTitle: {
    fontSize: RFValue(14),
    fontWeight: "bold",
    color: color.secondary,
    marginBottom: RFValue(8),
  },
  ruleItem: {
    paddingVertical: 0,
    minHeight: RFValue(36),
  },
  ruleText: {
    fontSize: RFValue(13),
    color: color.black,
  },
  formContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingTop: RFValue(10),
    paddingBottom: RFValue(20),
  },
  actionContainer: {
    paddingBottom: RFValue(10),
  },
});
