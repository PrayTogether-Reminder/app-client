import React from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Button } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';

export interface PrimaryButtonProps {
  children: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  style?: StyleProp<ViewStyle>;
  mode?: 'contained' | 'outlined';
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  onPress,
  disabled = false,
  loading = false,
  icon,
  style,
  mode = 'contained',
}) => {
  return (
    <Button
      mode={mode}
      onPress={onPress}
      style={[styles.button, style]}
      labelStyle={styles.buttonLabel}
      disabled={disabled || loading}
      loading={loading}
      icon={icon}
      uppercase={false}
      contentStyle={styles.buttonContent}
    >
      {children}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: RFValue(30),
  },
  buttonLabel: {
    fontSize: RFValue(16),
    fontWeight: 'bold',
    lineHeight: RFValue(20),
  },
  buttonContent: {
    paddingVertical: RFValue(8),
  },
});
