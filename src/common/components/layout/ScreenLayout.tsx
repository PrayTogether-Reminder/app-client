import React from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
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
  headerBackgroundColor?: string;
  contentBackgroundColor?: string;
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
  headerBackgroundColor = color.third,
  contentBackgroundColor = color.white,
  justifyContent = 'space-between',
}) => {
  const insets = useSafeAreaInsets();

  const content = (
    <View style={[
      styles.content,
      contentPadding && styles.contentPadding,
      { justifyContent, paddingBottom: insets.bottom }
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
    <View style={styles.rootContainer}>
      {/* 상단 SafeArea - 항상 적용 */}
      <SafeAreaView
        style={[styles.topSafeArea, { backgroundColor: headerBackgroundColor }]}
        edges={['top']}
      >
        {showBackButton && (
          <BackButtonHeader
            onPress={onBackPress}
            disabled={backButtonDisabled}
          />
        )}
      </SafeAreaView>

      {/* 콘텐츠 영역 */}
      <View style={[styles.contentContainer, { backgroundColor: contentBackgroundColor }]}>
        {keyboardAvoidingContent}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  topSafeArea: {
    // 상단 SafeArea만 처리
  },
  contentContainer: {
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
