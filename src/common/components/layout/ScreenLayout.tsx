import React from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { BackButtonHeader } from '@/common/components/header';
import { color } from '@/common/styles/color';
import { RFValue } from 'react-native-responsive-fontsize';

export interface ScreenLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  onBackPress?: () => void;
  backButtonDisabled?: boolean;
  keyboardAvoiding?: boolean; // PagerView를 감싸면 버그가 발생합니다. (IOS)
  scrollable?: boolean;
  contentPadding?: boolean;
  backgroundColor?: string;
  justifyContent?: 'flex-start' | 'space-between' | 'center' | 'flex-end';
}

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  children,
  showBackButton = true,
  onBackPress,
  backButtonDisabled = false,
  keyboardAvoiding = true,
  scrollable = false,
  contentPadding = true,
  backgroundColor = color.white,
  justifyContent = 'space-between',
}) => {
  const content = (
    <View style={[
      styles.content,
      contentPadding && styles.contentPadding,
      { justifyContent }
    ]}>
      {children}
    </View>
  );

  const keyboardAvoidingContent = keyboardAvoiding ? (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardView}
    >
      {scrollable ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </KeyboardAvoidingView>
  ) : scrollable ? (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
    >
      {content}
    </ScrollView>
  ) : (
    content
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      {showBackButton && (
        <BackButtonHeader
          onPress={onBackPress}
          disabled={backButtonDisabled}
        />
      )}
      {keyboardAvoidingContent}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    padding: RFValue(24),
  },
});
