import React from "react";
import { View, Keyboard, StyleSheet } from "react-native";
import { TextInput, Button, HelperText, Text } from "react-native-paper";
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

const NameStep: React.FC<NameStepProps> = ({
  name,
  setName,
  nameError,
  setNameError,
  onNext,
  isSubmitting,
}) => {
  const handleGoToEmail = () => {
    Keyboard.dismiss();
    if (!name.trim()) {
      setNameError("이름을 입력해주세요.");
      return;
    }
    setNameError("");
    onNext();
  };

  return (
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
      <HelperText type="error" visible={!!nameError} style={styles.helperText}>
        {nameError}
      </HelperText>
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
  },
  input: {
    fontSize: RFValue(16),
  },
  helperText: {
    fontSize: RFValue(14),
  },
  buttonContainer: {
    height: RFValue(50),
    justifyContent: "center",
  },
  button: {
    height: "100%",
  },
  buttonLabel: {
    fontSize: RFValue(22),
    lineHeight: RFValue(30),
  },
});

export default NameStep;
