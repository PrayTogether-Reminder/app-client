import React, { useRef } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  ViewToken,
  Platform,
} from "react-native";
import { Modal, Portal, IconButton, Button } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { color } from "../../styles/color";
import { useTutorialStore } from "./useTutorialStore";

// RFValue는 UI 스레드에서 호출하면 안 되므로 미리 계산
const CLOSE_ICON_SIZE = RFValue(24);
import { tutorialSlides, TutorialSlideData } from "./tutorialData";
import { TutorialIndicator } from "./TutorialIndicator";
import {
  CreateRoomSlide,
  CreatePrayerTitleSlide,
  CreatePrayerContentSlide,
  InviteFriendsSlide,
  DirectInputSlide,
  PrayerCompletionSlide,
} from "./slides";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// 슬라이드 타입에 따라 컴포넌트 렌더링
const renderSlideContent = (
  item: TutorialSlideData,
  isActive: boolean
): React.ReactNode => {
  switch (item.type) {
    case "create-room":
      return <CreateRoomSlide isActive={isActive} />;
    case "create-prayer-title":
      return <CreatePrayerTitleSlide isActive={isActive} />;
    case "create-prayer-content":
      return <CreatePrayerContentSlide isActive={isActive} />;
    case "invite-friends":
      return <InviteFriendsSlide isActive={isActive} />;
    case "direct-input":
      return <DirectInputSlide isActive={isActive} />;
    case "prayer-completion":
      return <PrayerCompletionSlide isActive={isActive} />;
    default:
      return null;
  }
};

export const TutorialModal: React.FC = () => {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);

  const { isVisible, currentSlideIndex, closeTutorial, goToSlide } =
    useTutorialStore();

  const isFirstSlide = currentSlideIndex === 0;
  const isLastSlide = currentSlideIndex === tutorialSlides.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      closeTutorial();
    } else {
      const nextIndex = currentSlideIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      goToSlide(nextIndex);
    }
  };

  const handlePrev = () => {
    if (!isFirstSlide) {
      const prevIndex = currentSlideIndex - 1;
      flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
      goToSlide(prevIndex);
    }
  };

  const handleIndicatorPress = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    goToSlide(index);
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        goToSlide(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <Portal>
      <Modal
        visible={isVisible}
        onDismiss={closeTutorial}
        contentContainerStyle={[
          styles.modalContainer,
          {
            paddingTop: insets.top,
            paddingBottom: Math.max(insets.bottom, Platform.OS === 'android' ? RFValue(24) : RFValue(16)) + RFValue(16),
          },
        ]}
      >
        {/* 닫기 버튼 */}
        <View style={styles.header}>
          <IconButton
            icon="close"
            size={CLOSE_ICON_SIZE}
            onPress={closeTutorial}
            iconColor="#333"
            style={styles.closeButton}
            containerColor="rgba(0, 0, 0, 0.08)"
          />
        </View>

        {/* 슬라이드 영역 */}
        <View style={styles.slideContainer}>
          <FlatList
            ref={flatListRef}
            data={tutorialSlides}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View style={{ width: SCREEN_WIDTH }}>
                {renderSlideContent(item, index === currentSlideIndex)}
              </View>
            )}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            scrollEventThrottle={16}
            getItemLayout={(_, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
          />
        </View>

        {/* 인디케이터 */}
        <TutorialIndicator
          total={tutorialSlides.length}
          current={currentSlideIndex}
          onPress={handleIndicatorPress}
        />

        {/* 네비게이션 버튼 */}
        <View style={styles.navigationContainer}>
          <Button
            mode="outlined"
            onPress={handlePrev}
            style={[styles.navButton, isFirstSlide && styles.navButtonHidden]}
            labelStyle={styles.navButtonLabel}
            disabled={isFirstSlide}
          >
            이전
          </Button>

          <Button
            mode="contained"
            onPress={handleNext}
            style={styles.navButton}
            labelStyle={styles.navButtonLabelPrimary}
            buttonColor={color.secondary}
          >
            {isLastSlide ? "완료" : "다음"}
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: "#fff",
    margin: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: RFValue(8),
    paddingTop: RFValue(8),
  },
  closeButton: {
    margin: 0,
  },
  slideContainer: {
    flex: 1,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: RFValue(20),
    paddingBottom: RFValue(20),
    gap: RFValue(12),
  },
  navButton: {
    flex: 1,
    borderRadius: RFValue(12),
    borderColor: color.secondary,
  },
  navButtonHidden: {
    opacity: 0,
  },
  navButtonLabel: {
    fontSize: RFValue(15),
    color: color.secondary,
    paddingVertical: RFValue(4),
  },
  navButtonLabelPrimary: {
    fontSize: RFValue(15),
    color: "#fff",
    paddingVertical: RFValue(4),
  },
});

export default TutorialModal;
