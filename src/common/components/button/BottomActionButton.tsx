import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { backgroundColor, color } from '@/common/styles/color';

export interface BottomActionButtonProps {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  text: string;
  loadingText?: string;
}

/**
 * Bottom 영역에 고정되는 액션 버튼 공통 컴포넌트
 *
 * @example
 * ```tsx
 * <BottomActionButton
 *   onPress={handleSubmit}
 *   disabled={!isValid}
 *   loading={isLoading}
 *   icon="check"
 *   text="비밀번호 변경"
 *   loadingText="변경 중..."
 * />
 * ```
 */
export const BottomActionButton: React.FC<BottomActionButtonProps> = ({
  onPress,
  disabled = false,
  loading = false,
  icon,
  text,
  loadingText,
}) => {
  const isDisabled = disabled || loading;

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={onPress}
        disabled={isDisabled}
        loading={loading}
        buttonColor={color.secondary}
        style={[styles.button, isDisabled && styles.buttonDisabled]}
        labelStyle={styles.buttonLabel}
        uppercase={false}
        icon={
          icon && !loading
            ? () => (
                <MaterialCommunityIcons
                  name={icon as any}
                  size={RFValue(20)}
                  color={color.white}
                />
              )
            : undefined
        }
      >
        {loading && loadingText ? loadingText : text}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: backgroundColor.white,
    width: '100%',
    height: '100%',
  },
  button: {
    borderRadius: RFValue(30),
    width: '70%',
    paddingVertical: RFValue(5),
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  buttonLabel: {
    fontSize: RFValue(16),
    fontWeight: '500',
    lineHeight: RFValue(22),
  },
});

export default BottomActionButton;
