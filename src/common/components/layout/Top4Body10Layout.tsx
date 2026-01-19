import React, { ReactNode } from 'react';
import { ScreenLayout, ScreenLayoutProps } from './ScreenLayout';
import Top4Body10 from './Top4Body10';

interface Top4Body10LayoutProps extends Omit<ScreenLayoutProps, 'children'> {
  tops: ReactNode[];
  bodies: ReactNode[];
}

/**
 * Top4Body10 레이아웃에 ScreenLayout 기능을 결합한 Pre-composed 컴포넌트
 *
 * @example
 * ```tsx
 * <Top4Body10Layout
 *   showBackButton
 *   keyboardAvoiding
 *   scrollable
 *   tops={[<Header />]}
 *   bodies={[<Content />]}
 * />
 * ```
 */
export const Top4Body10Layout: React.FC<Top4Body10LayoutProps> = ({
  tops,
  bodies,
  showBackButton = true,
  onBackPress,
  backButtonDisabled = false,
  keyboardAvoiding = true,
  scrollable = false,
  contentPadding = false, // Top/Body 레이아웃은 자체 구조가 있으므로 기본 false
  headerBackgroundColor,
  contentBackgroundColor,
}) => {
  return (
    <ScreenLayout
      showBackButton={showBackButton}
      onBackPress={onBackPress}
      backButtonDisabled={backButtonDisabled}
      keyboardAvoiding={keyboardAvoiding}
      scrollable={scrollable}
      contentPadding={contentPadding}
      headerBackgroundColor={headerBackgroundColor}
      contentBackgroundColor={contentBackgroundColor}
      justifyContent="flex-start"
    >
      <Top4Body10 tops={tops} bodies={bodies} />
    </ScreenLayout>
  );
};

export default Top4Body10Layout;
