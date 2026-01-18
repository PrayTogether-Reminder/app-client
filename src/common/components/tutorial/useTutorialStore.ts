import { create } from "zustand";

interface TutorialStore {
  // 튜토리얼 모달 표시 여부
  isVisible: boolean;
  // 현재 슬라이드 인덱스
  currentSlideIndex: number;

  // 액션
  openTutorial: () => void;
  closeTutorial: () => void;
  nextSlide: () => void;
  prevSlide: () => void;
  goToSlide: (index: number) => void;
  resetTutorial: () => void;
}

export const useTutorialStore = create<TutorialStore>((set) => ({
  isVisible: false,
  currentSlideIndex: 0,

  openTutorial: () => set({ isVisible: true, currentSlideIndex: 0 }),

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
}));
