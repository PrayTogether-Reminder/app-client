import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "@/common/styles/color";

interface FriendAddFormProps {
  onSubmit: (email: string) => void;
  isPending: boolean;
}

export default function FriendAddForm({
  onSubmit,
  isPending,
}: FriendAddFormProps): React.ReactElement {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (email.trim()) {
      onSubmit(email.trim());
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const canSubmit = email.trim() && isValidEmail(email.trim()) && !isPending;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text variant="titleMedium" style={styles.title}>
          친구의 이메일을 입력하세요
        </Text>

        <TextInput
          mode="outlined"
          label="이메일"
          placeholder="email@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          disabled={isPending}
          style={styles.input}
          outlineColor={color.gray}
          activeOutlineColor={color.secondary}
        />

        <Button
          mode="contained"
          onPress={handleSubmit}
          disabled={!canSubmit}
          loading={isPending}
          style={styles.button}
          buttonColor={color.secondary}
        >
          요청 보내기
        </Button>

        <View style={styles.infoContainer}>
          <Text variant="bodyMedium" style={styles.infoIcon}>
            💡
          </Text>
          <Text variant="bodyMedium" style={styles.infoText}>
            이메일 주소로 친구에게{"\n"}요청을 보낼 수 있어요
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: RFValue(24),
  },
  title: {
    marginBottom: RFValue(24),
    fontWeight: "bold",
    color: color.dark,
    textAlign: "center",
  },
  input: {
    marginBottom: RFValue(16),
    backgroundColor: color.white,
  },
  button: {
    marginTop: RFValue(8),
    paddingVertical: RFValue(4),
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: RFValue(32),
    paddingHorizontal: RFValue(16),
  },
  infoIcon: {
    marginRight: RFValue(8),
    fontSize: RFValue(20),
  },
  infoText: {
    color: color.gray,
    textAlign: "center",
    lineHeight: RFValue(22),
  },
});