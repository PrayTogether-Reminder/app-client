import React from 'react';
import { StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Button } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { color } from '@/common/styles/color';

export interface TextButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  icon?: string;
  textColor?: string;
  size?: 'small' | 'medium' | 'large';
  underline?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
}

export const TextButton: React.FC<TextButtonProps> = ({
  children,
  onPress,
  disabled = false,
  icon,
  textColor = color.black,
  size = 'medium',
  underline = false,
  style,
  labelStyle,
  fullWidth = false,
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          label: { fontSize: RFValue(12), lineHeight: RFValue(16) },
          content: { paddingVertical: RFValue(4) },
        };
      case 'large':
        return {
          label: { fontSize: RFValue(16), lineHeight: RFValue(20) },
          content: { paddingVertical: RFValue(10) },
        };
      case 'medium':
      default:
        return {
          label: { fontSize: RFValue(14), lineHeight: RFValue(18) },
          content: { paddingVertical: RFValue(6) },
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <Button
      mode="text"
      onPress={onPress}
      style={[
        fullWidth && styles.fullWidth,
        style,
      ]}
      labelStyle={[
        styles.label,
        sizeStyles.label,
        underline && styles.underline,
        labelStyle,
      ]}
      contentStyle={[styles.content, sizeStyles.content]}
      disabled={disabled}
      textColor={textColor}
      icon={icon}
      uppercase={false}
    >
      {children}
    </Button>
  );
};

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  label: {
    textAlign: 'center',
  },
  underline: {
    textDecorationLine: 'underline',
  },
  content: {
    // Base content styles
  },
});
