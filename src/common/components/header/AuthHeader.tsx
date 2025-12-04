import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Text } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { color } from '@/common/styles/color';

export interface AuthHeaderProps {
  icon: string;
  title: string;
  description?: string;
  iconColor?: string;
  iconSize?: number;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  icon,
  title,
  description,
  iconColor = color.primary,
  iconSize = 60,
}) => {
  return (
    <View style={styles.container}>
      <Avatar.Icon
        size={RFValue(iconSize)}
        icon={icon}
        style={styles.icon}
        color={iconColor}
      />
      <Text variant="headlineMedium" style={styles.title}>
        {title}
      </Text>
      {description && (
        <Text variant="bodyMedium" style={styles.description}>
          {description}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: RFValue(10),
  },
  icon: {
    backgroundColor: 'transparent',
    marginBottom: RFValue(10),
  },
  title: {
    fontSize: RFValue(26),
    fontWeight: 'bold',
    textAlign: 'center',
    color: color.primary,
    lineHeight: RFValue(32),
    marginBottom: RFValue(10),
  },
  description: {
    fontSize: RFValue(14),
    textAlign: 'center',
    color: color.black,
    lineHeight: RFValue(20),
  },
});
