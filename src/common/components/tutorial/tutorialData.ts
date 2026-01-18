// 튜토리얼 슬라이드 데이터

export interface TutorialSlideData {
  id: string;
  // 슬라이드 컴포넌트 타입
  type: "create-room" | "create-prayer-title" | "create-prayer-content" | "invite-friends";
}

export const tutorialSlides: TutorialSlideData[] = [
  {
    id: "create-room",
    type: "create-room",
  },
  {
    id: "create-prayer-title",
    type: "create-prayer-title",
  },
  {
    id: "create-prayer-content",
    type: "create-prayer-content",
  },
  {
    id: "invite-friends",
    type: "invite-friends",
  },
];
