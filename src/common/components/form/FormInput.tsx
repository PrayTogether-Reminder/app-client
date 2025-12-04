import React, { useState } from 'react';
import { StyleSheet, KeyboardTypeOptions } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { color } from '@/common/styles/color';

export interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  type?: 'text' | 'email' | 'password' | 'phone' | 'number';
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  icon?: string;
  maxLength?: number;
  returnKeyType?: 'done' | 'next' | 'go' | 'search';
  onSubmitEditing?: () => void;
  autoFocus?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  style?: any;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChangeText,
  type = 'text',
  placeholder,
  error,
  disabled = false,
  icon,
  maxLength,
  returnKeyType = 'done',
  onSubmitEditing,
  autoFocus = false,
  multiline = false,
  numberOfLines = 1,
  style,
}) => {
  const [isSecureVisible, setIsSecureVisible] = useState(false);

  // type에 따른 설정
  const getKeyboardType = (): KeyboardTypeOptions => {
    switch (type) {
      case 'email':
        return 'email-address';
      case 'phone':
        return 'phone-pad';
      case 'number':
        return 'numeric';
      default:
        return 'default';
    }
  };

  const getAutoCapitalize = (): 'none' | 'sentences' | 'words' | 'characters' => {
    switch (type) {
      case 'email':
      case 'password':
        return 'none';
      default:
        return 'sentences';
    }
  };

  const renderLeftIcon = () => {
    if (icon) {
      return <TextInput.Icon icon={icon} />;
    }
    return undefined;
  };

  const renderRightIcon = () => {
    if (type === 'password') {
      return (
        <TextInput.Icon
          icon={isSecureVisible ? 'eye-off-outline' : 'eye-outline'}
          onPress={() => setIsSecureVisible(!isSecureVisible)}
          forceTextInputFocus={false}
        />
      );
    }
    return undefined;
  };

  return (
    <>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={[styles.input, style]}
        mode="outlined"
        disabled={disabled}
        secureTextEntry={type === 'password' && !isSecureVisible}
        left={renderLeftIcon()}
        right={renderRightIcon()}
        keyboardType={getKeyboardType()}
        autoCapitalize={getAutoCapitalize()}
        maxLength={maxLength}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        autoFocus={autoFocus}
        multiline={multiline}
        numberOfLines={numberOfLines}
        error={!!error}
      />
      {error && (
        <HelperText type="error" visible={!!error} style={styles.errorText}>
          {error}
        </HelperText>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: RFValue(16),
    backgroundColor: color.white,
  },
  errorText: {
    fontSize: RFValue(13),
    textAlign: 'left',
    marginTop: RFValue(-12),
    marginBottom: RFValue(8),
    paddingHorizontal: RFValue(5),
  },
});
