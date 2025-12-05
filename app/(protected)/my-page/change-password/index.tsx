// app/(protected)/my-page/change-password/index.tsx
import React, { useState } from "react";
import {
  View,
  StyleSheet,
} from "react-native";
import {
  Text,
  List,
  Appbar,
} from "react-native-paper";
import { FormInput } from "@/common/components/form";
import { BottomActionButton } from "@/common/components/button";
import { Top1Body10Bottom1Layout } from "@/common/components/layout";
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
        onSuccess: () => {
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
    <Top1Body10Bottom1Layout
      showBackButton={false}
      keyboardAvoiding
      scrollable
      contentPadding={false}
      tops={[
        <Appbar.Header key="header" style={styles.header}>
          <Appbar.BackAction
            onPress={() => router.back()}
            color={color.primary}
            style={styles.headerBackAction}
            disabled={isLoading}
          />
          <Appbar.Content
            title="비밀번호 변경"
            titleStyle={styles.headerTitle}
          />
          <Appbar.Action
            icon=""
            disabled
            style={styles.headerAction}
          />
        </Appbar.Header>,
      ]}
      bodies={[
        <View key="body" style={styles.bodyContainer}>
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
        </View>
      ]}
      bottoms={[
        <BottomActionButton
          key="button"
          onPress={handleChangePassword}
          disabled={isLoading}
          loading={isLoading}
          icon="check"
          text="비밀번호 변경"
          loadingText="변경 중..."
        />
      ]}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: color.third,
    height: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 0,
    elevation: 0,
  },
  headerTitle: {
    color: color.primary,
    fontSize: RFValue(20),
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
    lineHeight: RFValue(26),
  },
  headerBackAction: {
    alignSelf: "center",
    marginLeft: 0,
  },
  headerAction: {
    alignSelf: "center",
    marginRight: 0,
  },
  bodyContainer: {
    flex: 1,
    paddingHorizontal: RFValue(24),
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
    paddingBottom: RFValue(12),
    marginBottom: RFValue(8),
  },
  ruleItem: {
    paddingVertical: 0,
    // minHeight: RFValue(36),
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
});
