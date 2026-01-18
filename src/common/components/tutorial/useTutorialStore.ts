import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

const TUTORIAL_SEEN_KEY = "tutorial_seen";

interface TutorialStore {
  // 튜토리얼 모달 표시 여부
  isVisible: boolean;
  // 현재 슬라이드 인덱스
  currentSlideIndex: number;
  // 스포트라이트 표시 여부
  showSpotlight: boolean;
  // 튜토리얼 본 적 있는지 여부
  hasSeenTutorial: boolean;
  // 로딩 완료 여부
  isLoaded: boolean;

  // 액션
  openTutorial: () => void;
  closeTutorial: () => void;
  nextSlide: () => void;
  prevSlide: () => void;
  goToSlide: (index: number) => void;
  resetTutorial: () => void;
  // 스포트라이트 관련
  checkTutorialStatus: () => Promise<void>;
  markTutorialSeen: () => Promise<void>;
  hideSpotlight: () => void;
}

export const useTutorialStore = create<TutorialStore>((set, get) => ({
  isVisible: false,
  currentSlideIndex: 0,
  showSpotlight: false,
  hasSeenTutorial: true, // 기본값은 true (로딩 전까지 스포트라이트 안 보임)
  isLoaded: false,

  openTutorial: () => {
    // 튜토리얼 열면 스포트라이트 숨기고 본 것으로 표시
    get().markTutorialSeen();
    set({ isVisible: true, currentSlideIndex: 0, showSpotlight: false });
  },

  closeTutorial: () => set({ isVisible: false }),

  nextSlide: () =>
    set((state) => ({
      currentSlideIndex: state.currentSlideIndex + 1,
    })),

  prevSlide: () =>
    set((state) => ({
      currentSlideIndex: Math.max(0, state.currentSlideIndex - 1),
    })),

  goToSlide: (index: number) => set({ currentSlideIndex: index }),

  resetTutorial: () => set({ isVisible: false, currentSlideIndex: 0 }),

  checkTutorialStatus: async () => {
    try {
      const seen = await SecureStore.getItemAsync(TUTORIAL_SEEN_KEY);
      const hasSeenTutorial = seen === "true";
      set({
        hasSeenTutorial,
        showSpotlight: !hasSeenTutorial,
        isLoaded: true,
      });
    } catch (error) {
      console.error("Failed to check tutorial status:", error);
      set({ hasSeenTutorial: true, showSpotlight: false, isLoaded: true });
    }
  },

  markTutorialSeen: async () => {
    try {
      await SecureStore.setItemAsync(TUTORIAL_SEEN_KEY, "true");
      set({ hasSeenTutorial: true, showSpotlight: false });
    } catch (error) {
      console.error("Failed to mark tutorial as seen:", error);
    }
  },

  hideSpotlight: () => set({ showSpotlight: false }),
}));
