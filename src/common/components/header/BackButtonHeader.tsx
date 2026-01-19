import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { RFValue } from 'react-native-responsive-fontsize';
import { color } from '@/common/styles/color';

export interface BackButtonHeaderProps {
  onPress?: () => void;
  disabled?: boolean;
  iconColor?: string;
  title?: string;
  borderBottom?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const BackButtonHeader: React.FC<BackButtonHeaderProps> = ({
  onPress,
  disabled = false,
  iconColor = color.secondary,
  title,
  borderBottom = true,
  style,
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <View
      style={[
        styles.container,
        borderBottom && styles.borderBottom,
        style,
      ]}
    >
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled}
        style={[styles.backButton, disabled && styles.backButtonDisabled]}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name="arrow-left"
          size={RFValue(24)}
          color={disabled ? color.gray : iconColor}
        />
      </TouchableOpacity>
      {title && (
        <Text style={styles.title}>
          {title}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: RFValue(40),
    paddingHorizontal: RFValue(4),
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    width: RFValue(40),
    height: RFValue(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonDisabled: {
    opacity: 0.5,
  },
  title: {
    marginLeft: RFValue(4),
    fontSize: RFValue(18),
    fontWeight: 'bold',
    color: color.black,
  },
});
