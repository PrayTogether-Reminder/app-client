import React from "react";
import { View, Keyboard, StyleSheet } from "react-native";
import { TextInput, Button, HelperText, Text } from "react-native-paper";

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
      />
      <HelperText type="error" visible={!!nameError}>
        {nameError}
      </HelperText>
      <View style={styles.buttonContainer}>
        <View style={styles.button} />
        <Button
          mode="contained"
          onPress={handleGoToEmail}
          style={styles.button}
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
    padding: 20,
  },
  stepTitle: {
    marginBottom: 24,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    paddingVertical: 8,
    minWidth: "48%",
  },
});

export default NameStep;
