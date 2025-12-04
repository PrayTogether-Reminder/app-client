import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
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
      <IconButton
        icon="arrow-left"
        size={RFValue(30)}
        onPress={handlePress}
        style={styles.backButton}
        disabled={disabled}
        iconColor={iconColor}
      />
      {title && (
        <Text variant="titleLarge" style={styles.title}>
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
    paddingHorizontal: RFValue(4),
    paddingTop: RFValue(8),
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    marginLeft: 0,
    paddingLeft: 0,
  },
  title: {
    marginLeft: RFValue(8),
    fontSize: RFValue(18),
    fontWeight: 'bold',
    color: color.black,
  },
});
