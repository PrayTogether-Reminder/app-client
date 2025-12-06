# 기도함께 (Pray Together) - AI 개발 가이드

> 이 문서는 AI가 프로젝트의 리팩토링 및 새로운 기능 개발 시 참고할 수 있도록 작성된 종합 가이드입니다.
> 현재 코드베이스의 아키텍처, 패턴, 규칙을 정리하여 일관성 있는 개발을 지원합니다.

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [기술 스택](#2-기술-스택)
3. [프로젝트 구조 및 아키텍처](#3-프로젝트-구조-및-아키텍처)
4. [API 통신 아키텍처](#4-api-통신-아키텍처)
5. [상태 관리](#5-상태-관리)
6. [라우팅 및 네비게이션](#6-라우팅-및-네비게이션)
7. [공통 컴포넌트 및 레이아웃](#7-공통-컴포넌트-및-레이아웃)
8. [도메인 별 구조 패턴](#8-도메인-별-구조-패턴)
9. [코드 스타일 및 컨벤션](#9-코드-스타일-및-컨벤션)
10. [개발 시 주의사항 및 베스트 프랙티스](#10-개발-시-주의사항-및-베스트-프랙티스)

---

## 1. 프로젝트 개요

### 프로젝트명
**기도함께** - 기도를 함께 나누고 기도로 응원하는 공간

### 프로젝트 목적
기도방을 만들고, 친구들과 함께 기도 제목을 공유하며 서로의 기도를 응원하는 모바일 애플리케이션

### 플랫폼
- iOS
- Android

### 배포 환경
- **Production**: https://praytogether.site/api
- **Preview** (스테이징)
- **Development**

### 주요 기능

#### 1. 인증 (Auth)
- 이메일/비밀번호 기반 로그인
- 회원가입 (OTP 이메일 인증)
- JWT 토큰 기반 인증 (Access Token + Refresh Token)
- 자동 토큰 갱신
- 전화번호 등록 (필수)

#### 2. 기도방 (Rooms)
- 기도방 생성/삭제
- 기도방 멤버 관리
- 기도방 알림 설정
- 기도방 멤버 초대

#### 3. 기도 (Prayers)
- 기도 제목 생성/수정/삭제
- 기도 내용 생성/수정/삭제
- 기도 완료 처리
- 특정 멤버를 위한 기도 지정

#### 4. 친구 (Friends)
- 친구 검색 및 추가
- 친구 초대 관리 (수락/거절)
- 친구 목록 조회

#### 5. 초대 (Invitations)
- 기도방 멤버 초대
- 초대 수락/거절
- 초대 목록 조회

#### 6. 알림 (Notifications)
- Firebase Cloud Messaging (FCM) 기반 푸시 알림
- FCM 토큰 등록/삭제
- 기도방별 알림 설정

#### 7. 앱 업데이트
- EAS Update를 통한 OTA 업데이트
- 강제 업데이트 모달
- 유지보수 모드

---

## 2. 기술 스택

### 코어 프레임워크
- **React Native**: 0.79.5
- **Expo SDK**: 53.0.16
- **TypeScript**: 5.7.3 (strict mode 활성화)
- **Node.js**: Darwin 환경

### 라우팅
- **Expo Router**: 5.1.2
  - 파일 기반 라우팅 시스템
  - Typed Routes 실험적 기능 활성화
  - (public), (protected) 그룹 라우팅

### 상태 관리
- **Zustand**: 5.0.3 - 전역 상태 관리
- **@tanstack/react-query**: 5.66.9 - 서버 상태 관리

### 서버 통신
- **Axios**: 1.7.9 - HTTP 클라이언트

### UI 라이브러리
- **React Native Paper**: 5.13.1 - Material Design 컴포넌트
- **@expo/vector-icons**: 14.0.2
- **React Native Reanimated**: 3.17.4 - 애니메이션
- **expo-linear-gradient**: 14.1.5

### Firebase
- **@react-native-firebase/app**: 23.4.0
- **@react-native-firebase/messaging**: 23.4.0 - 푸시 알림 (FCM)
- **@react-native-firebase/crashlytics**: 23.4.0 - 크래시 리포팅

### 네비게이션
- **@react-navigation/native**: 7.0.14
- **@react-navigation/native-stack**: 7.2.0
- **@react-navigation/bottom-tabs**: 7.2.0

### 유틸리티
- **date-fns**: 4.1.0 - 날짜 처리
- **expo-secure-store**: 14.0.1 - 보안 저장소 (토큰 저장)
- **expo-notifications**: 0.31.3 - 로컬 알림
- **react-native-keyboard-aware-scroll-view**: 0.9.5
- **react-error-boundary**: 4.0.10 - 에러 핸들링

### 빌드 & 배포
- **EAS (Expo Application Services)**
  - Build: 로컬 및 클라우드 빌드
  - Update: OTA 업데이트
  - Submit: 스토어 제출

---

## 3. 프로젝트 구조 및 아키텍처

### 전체 디렉토리 구조

```
app-client/
├── app/                          # Expo Router 파일 기반 라우팅
│   ├── (public)/                 # 공개 페이지 (인증 불필요)
│   │   ├── login/               # 로그인
│   │   └── signup/              # 회원가입
│   ├── (protected)/             # 인증 필요 페이지
│   │   ├── (tabs)/              # 탭 네비게이션
│   │   │   ├── rooms/          # 기도방 목록
│   │   │   └── my-page/        # 마이페이지
│   │   ├── prayers/             # 기도 관련
│   │   │   ├── creation/       # 기도 생성
│   │   │   └── [id]/           # 기도 상세
│   │   ├── rooms/               # 기도방 관련
│   │   │   └── [id]/           # 기도방 상세
│   │   ├── friends/             # 친구 관련
│   │   ├── my-page/             # 마이페이지 상세
│   │   └── phone-registration/  # 전화번호 등록
│   ├── index.tsx                # 앱 진입점
│   └── _layout.tsx              # 루트 레이아웃
├── src/                          # 소스 코드
│   ├── common/                   # 공통 모듈
│   │   ├── apis/                # API 관련
│   │   │   ├── api.ts           # Axios 인스턴스
│   │   │   ├── apiService.ts    # API 서비스 래퍼
│   │   │   └── apiUrl.ts        # API URL
│   │   ├── components/          # 공통 컴포넌트
│   │   │   ├── loading/         # 로딩 컴포넌트
│   │   │   ├── modal/           # 모달 (Alert, Confirmation 등)
│   │   │   ├── error/           # 에러 컴포넌트
│   │   │   ├── empty/           # Empty State
│   │   │   ├── layout/          # 레이아웃 컴포넌트
│   │   │   ├── header/          # 헤더 컴포넌트
│   │   │   ├── button/          # 버튼 컴포넌트
│   │   │   ├── form/            # 폼 컴포넌트
│   │   │   └── toast/           # 토스트 컴포넌트
│   │   ├── hooks/               # 공통 훅
│   │   ├── services/            # 공통 서비스
│   │   │   ├── fcm/             # FCM 관련
│   │   │   ├── time/            # 시간 관련
│   │   │   ├── keyboard/        # 키보드 관련
│   │   │   └── clear/           # 스토어 초기화
│   │   ├── constants/           # 공통 상수
│   │   ├── styles/              # 공통 스타일
│   │   └── types/               # 공통 타입
│   ├── domain/                   # 도메인별 비즈니스 로직
│   │   ├── auth/                # 인증
│   │   ├── prayers/             # 기도
│   │   ├── rooms/               # 기도방
│   │   ├── friends/             # 친구
│   │   ├── invitations/         # 초대
│   │   ├── members/             # 멤버
│   │   ├── fcmToken/            # FCM 토큰
│   │   ├── navigation/          # 네비게이션 상태
│   │   └── appVersion/          # 앱 버전
│   └── config/                  # 설정
├── assets/                       # 정적 리소스
├── app.config.js                 # Expo 앱 설정
├── eas.json                      # EAS 빌드 설정
└── tsconfig.json                 # TypeScript 설정
```

### 아키텍처 패턴

프로젝트는 **도메인 주도 설계(DDD)** 개념을 일부 차용한 **레이어드 아키텍처**를 따릅니다.

```
┌─────────────────────────────────────────────┐
│         Presentation Layer (UI)             │
│         - React Components (app/)           │
│         - Pages & Screens                   │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│         Application Layer                   │
│         - React Query Hooks (hooks/)        │
│         - Zustand Stores (stores/)          │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│         Domain Layer                        │
│         - Business Logic (services/)        │
│         - Domain Types (types/)             │
│         - Domain Constants                  │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│         Infrastructure Layer                │
│         - API Client (api.ts)               │
│         - External Services (Firebase, etc) │
│         - Utils & Helpers                   │
└─────────────────────────────────────────────┘
```

---

## 4. API 통신 아키텍처

### API 통신 흐름

```
Component
    ↓ (사용)
React Query Hook (queries/mutations)
    ↓ (호출)
Service (도메인별 Service)
    ↓ (사용)
API Service (apiService.ts)
    ↓ (사용)
Axios Instance (api.ts)
    ↓ (Request Interceptor: 토큰 추가)
Backend Server
    ↓ (Response Interceptor: 토큰 갱신)
Component
```

### 인증 처리

#### Request Interceptor (`src/common/apis/api.ts`)

1. **인증 불필요 경로 확인**:
   - `/v1/auth/login`
   - `/v1/auth/signup`
   - `/v1/auth/otp/email`
   - `/v1/auth/otp/email/verification`
   - `/v1/auth/reissue-token`

2. **인증 필요한 경우**:
   - SecureStore에서 Access Token 조회
   - `Authorization: Bearer {token}` 헤더 추가

#### Response Interceptor

1. **성공 응답**: 그대로 반환

2. **401 에러 (토큰 만료)**:
   - Refresh Token으로 새 토큰 발급 시도
   - 성공 시: 새 토큰 저장 후 원래 요청 재시도
   - 실패 시: 로그아웃 처리 및 로그인 화면 이동

3. **네트워크 에러**:
   - "네트워크 연결을 확인해주세요" 메시지
   - `NETWORK_ERROR` 코드 반환

4. **기타 에러**:
   - 서버 응답의 에러 메시지 전달
   - `ApiError` 객체로 변환

### 토큰 관리

#### 저장 위치
- **Expo SecureStore** (암호화된 로컬 저장소)
- Key: `accessToken`, `refreshToken`

#### 토큰 갱신 로직 (Singleton 패턴)

```typescript
let refreshTokenPromise: Promise<AxiosResponse> | null = null;

const fetchNewTokens = async (refreshToken: string) => {
  if (!refreshTokenPromise) {
    refreshTokenPromise = fetchNewTokensBySingletone(refreshToken)
      .finally(() => {
        refreshTokenPromise = null;
      });
  }
  return refreshTokenPromise;
};
```

**중요**: 동시에 여러 API 요청이 401을 받더라도, 토큰 갱신은 단 한 번만 수행됩니다.

### API 엔드포인트 패턴

#### Base URL
- Production: `https://praytogether.site/api`

#### API 버전
- 모든 엔드포인트: `/v1/...`

#### 주요 엔드포인트 예시

**인증 (Auth)**
- `POST /v1/auth/login` - 로그인
- `POST /v1/auth/signup` - 회원가입
- `POST /v1/auth/reissue-token` - 토큰 재발급
- `POST /v1/auth/logout` - 로그아웃

**기도방 (Rooms)**
- `GET /v1/rooms` - 기도방 목록 조회
- `POST /v1/rooms` - 기도방 생성
- `DELETE /v1/rooms/:id` - 기도방 삭제

**기도 (Prayers)**
- `GET /v1/prayer-rooms/:roomId/prayer-titles` - 기도 제목 목록 (무한 스크롤)
- `POST /v1/prayer-rooms/:roomId/prayer-titles` - 기도 제목 생성
- `POST /v1/prayer-contents/:contentId/completion` - 기도 완료 처리

### React Query 설정

#### Query Keys 패턴 (`src/common/constants/queryKeys.ts`)

```typescript
export const QueryKeys = {
  ROOMS: "rooms",
  PRAYER_TITLES: "prayerTitles",
  PRAYER_CONTENTS: "prayerContents",
  FRIENDS: "friends",
  PROFILE: "profile",
  // ...
};
```

#### Cache 정책
- **staleTime**: 기본값 0 (즉시 stale 상태)
- **cacheTime**: 기본값 5분
- **refetchOnWindowFocus**: true
- **retry**: 3회

#### Infinite Query
- 기도 제목 목록에서 사용
- `pageParam`으로 `after` (커서) 전달
- `getNextPageParam`으로 다음 페이지 커서 계산

---

## 5. 상태 관리

프로젝트는 **Zustand**와 **React Query**를 조합하여 상태를 관리합니다.

### 상태 관리 전략

```
┌────────────────────────────────────────────────┐
│  Zustand (Client State)                        │
│  - 인증 상태 (isAuthenticated)                 │
│  - UI 상태 (모달, 토스트, 네비게이션)          │
│  - 임시 폼 데이터 (기도 생성 폼 등)            │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│  React Query (Server State)                    │
│  - API 데이터 (기도방, 기도, 친구 등)          │
│  - 캐싱 & 자동 재시도                          │
│  - Optimistic Updates                          │
└────────────────────────────────────────────────┘
```

### Zustand Store 패턴

각 도메인별로 스토어를 분리하며, 다음 패턴을 따릅니다:

```typescript
// src/domain/[domain]/stores/use[Domain]Store.ts

import { create } from "zustand";

// 1. State 타입 정의
interface MyState {
  data: string | null;
  isLoading: boolean;
}

// 2. Actions 타입 정의
interface MyActions {
  setData: (data: string) => void;
  clear: () => void;
}

// 3. Store 타입 = State + Actions
type MyStore = MyState & MyActions;

// 4. 초기 상태 정의
const initialState: MyState = {
  data: null,
  isLoading: false,
};

// 5. Store 생성
export const useMyStore = create<MyStore>((set) => ({
  ...initialState,

  // Actions
  setData: (data) => set({ data }),
  clear: () => set(initialState),
}));
```

#### 주요 스토어 목록

- **`useAuthStore`** (`src/domain/auth/stores/useAuthStore.ts`)
  - 인증 상태 관리 (`isAuthenticated`, `isLoading`)
  - 로그인/로그아웃 처리
  - 토큰 관리
  - 인증 이벤트 리스너 (pub/sub 패턴)

- **`usePrayerCreationStore`** (`src/domain/prayers/stores/usePrayerCreationStore.ts`)
  - 기도 생성 폼 데이터 임시 저장
  - 멤버별 기도 목록 관리

- **`useSelectedRoomStore`** (`src/domain/rooms/stores/useSelectedRoomStore.ts`)
  - 현재 선택된 기도방 정보 저장

- **`useBottomNaviStatusStore`** (`src/domain/navigation/stores/useBottomNaviStatusStore.ts`)
  - 하단 탭 네비게이션 상태 관리

### React Query 패턴

#### Query Hook 패턴

```typescript
// src/domain/[domain]/hooks/queries/use[Domain]Queries.ts

import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/common/constants/queryKeys";
import { myService } from "../../services/myService";

export const useMyDataQuery = () => {
  return useQuery({
    queryKey: [QueryKeys.MY_DATA],
    queryFn: () => myService.fetchData(),
  });
};
```

#### Mutation Hook 패턴

```typescript
// src/domain/[domain]/hooks/mutations/use[Domain]Mutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/common/constants/queryKeys";
import { myService } from "../../services/myService";

export const useCreateDataMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: myService.create,
    onSuccess: () => {
      // 캐시 무효화 (자동 재조회)
      queryClient.invalidateQueries({ queryKey: [QueryKeys.MY_DATA] });
    },
  });
};
```

#### Infinite Query 패턴

```typescript
export const usePrayerTitlesInfiniteQuery = (roomId: string) => {
  return useInfiniteQuery({
    queryKey: [QueryKeys.PRAYER_TITLES, roomId],
    queryFn: ({ pageParam }) =>
      prayerService.fetchPrayerTitles(roomId, pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.after ?? undefined,
  });
};
```

---

## 6. 라우팅 및 네비게이션

### Expo Router 파일 기반 라우팅

프로젝트는 **Expo Router**를 사용하여 파일 시스템 기반 라우팅을 구현합니다.

#### 라우팅 구조

```
app/
├── _layout.tsx                  # 루트 레이아웃 (Provider 설정)
├── index.tsx                    # 웰컴 화면 ("/")
├── (public)/                    # 인증 불필요 그룹
│   ├── login/index.tsx         # "/login"
│   └── signup/index.tsx        # "/signup"
└── (protected)/                 # 인증 필요 그룹
    ├── _layout.tsx             # Protected 레이아웃 (인증 체크)
    ├── (tabs)/                 # 탭 네비게이션
    │   ├── _layout.tsx         # 탭 레이아웃
    │   ├── rooms/index.tsx     # "/rooms" (탭1)
    │   └── my-page/index.tsx   # "/my-page" (탭2)
    ├── prayers/
    │   ├── creation/index.tsx  # "/prayers/creation"
    │   └── [id]/index.tsx      # "/prayers/:id"
    ├── rooms/
    │   └── [id]/index.tsx      # "/rooms/:id"
    └── friends/index.tsx        # "/friends"
```

#### 루트 레이아웃 (`app/_layout.tsx`)

**주요 책임**:
1. **Provider 설정**:
   - `SafeAreaProvider`: Safe Area 관리
   - `PaperProvider`: React Native Paper 테마
   - `CustomQueryClientProvider`: React Query 설정
   - `ErrorBoundary`: 전역 에러 핸들링

2. **전역 컴포넌트**:
   - `AuthStateListener`: 인증 상태 감시 및 리다이렉트
   - `AuthEventListener`: 인증 이벤트 처리
   - `GlobalAlertModal`: 전역 알림 모달
   - `UpdateModalsManager`: 앱 업데이트 모달 관리
   - `Toast`: 토스트 메시지

3. **알림 처리**:
   - `useNotificationObserver`: FCM 푸시 알림 처리
   - 앱이 종료된 상태에서 알림 탭 시 딥링크 처리
   - 인증 완료 후 pending 알림 처리

#### 탭 네비게이션 (`app/(protected)/(tabs)/_layout.tsx`)

**설정**:
- 2개의 탭: "기도방 목록", "마이페이지"
- 아이콘: FontAwesome6
- 활성화 색상: `color.secondary`
- 애니메이션: 비활성화 (`animation: "none"`)
- 높이: 반응형 (`Top1Body10Bottom1.tsx` 레이아웃과 연동)

### 네비게이션 패턴

#### 1. 프로그래매틱 네비게이션

```typescript
import { router } from "expo-router";

// 페이지 이동
router.push("/rooms/123");

// 파라미터 전달
router.push({
  pathname: "/prayers/[id]",
  params: { id: "456", roomId: "123" },
});

// 뒤로 가기
router.back();

// 교체 (히스토리에 남지 않음)
router.replace("/login");
```

#### 2. 딥링크 처리

**FCM 푸시 알림 → 특정 화면 이동**:

```typescript
// app/_layout.tsx의 useNotificationObserver

const data = notification.request.content.data;

if (data && data.roomId && data.prayerTitleId) {
  // 1. 기도방으로 먼저 이동
  router.push(`/rooms/${roomId}`);

  // 2. 약간의 지연 후 기도 상세로 이동
  setTimeout(() => {
    router.push(`/prayers/${prayerTitleId}?roomId=${roomId}`);
  }, 300);
}
```

#### 3. 인증 기반 리다이렉트

**`AuthStateListener` 컴포넌트**:
- 인증 상태 변화 감지
- 미인증 시: `/login`으로 리다이렉트
- 인증 완료 시: `/rooms`로 리다이렉트

---

## 7. 공통 컴포넌트 및 레이아웃

### 레이아웃 시스템

프로젝트는 **비율 기반 레이아웃 시스템**을 사용합니다.

#### 레이아웃 컴포넌트 (`src/common/components/layout/`)

1. **`Top1Body10Bottom1.tsx`**
   - 상단 (height: 70 RFValue)
   - 본문 (flex: 1)
   - 하단 (height: 50 RFValue)
   - 사용처: 탭 네비게이션이 있는 화면

2. **`Top4Body10.tsx`**
   - 상단 (4배 높이)
   - 본문 (10배 높이)
   - 사용처: 헤더가 큰 화면

3. **`Top1Body10.tsx`**
   - 상단 (1배 높이)
   - 본문 (10배 높이)
   - 사용처: 일반 화면

4. **`ScreenLayout.tsx`**
   - SafeAreaView + KeyboardAvoidingView 조합
   - 전체 화면 레이아웃의 베이스

#### 레이아웃 사용 예시

```typescript
import { Top1Body10 } from "@/common/components/layout";
import { TopHeader } from "@/common/components/header";

export default function MyScreen() {
  return (
    <Top1Body10
      tops={[
        <TopHeader key="header" title="제목" />,
      ]}
      bodies={[
        <View key="body">
          {/* 본문 내용 */}
        </View>,
      ]}
    />
  );
}
```

### 헤더 컴포넌트 (`src/common/components/header/`)

1. **`TopHeader.tsx`**
   - 일반 상단 헤더
   - 제목 표시

2. **`BackButtonHeader.tsx`**
   - 뒤로 가기 버튼 포함 헤더
   - 제목 표시

3. **`AuthHeader.tsx`**
   - 인증 화면용 헤더
   - 로고 및 앱 이름 표시

**사용 예시**:

```typescript
import { BackButtonHeader } from "@/common/components/header";

<BackButtonHeader title="기도 상세" onBack={() => router.back()} />
```

### 모달 컴포넌트 (`src/common/components/modal/`)

1. **`GlobalAlertModal.tsx`**
   - 전역 알림 모달
   - Zustand store로 관리 (`useGlobalAlertModalStore`)
   - 어디서든 호출 가능

2. **`AlertModal.tsx`**
   - 로컬 알림 모달
   - 단일 확인 버튼

3. **`ConfirmationModal.tsx`**
   - 확인/취소 모달
   - 위험한 작업 전 확인용

4. **`ForceUpdateModal.tsx`**
   - 강제 업데이트 모달
   - 앱 버전이 낮을 때 표시

5. **`MaintenanceModal.tsx`**
   - 유지보수 모달
   - 서버 점검 시 표시

**GlobalAlertModal 사용 예시**:

```typescript
import { useGlobalAlertModalStore } from "@/common/components/modal/stores/useGlobalAlertModalStore";

const { open } = useGlobalAlertModalStore();

open({
  title: "알림",
  message: "작업이 완료되었습니다.",
  confirmText: "확인",
});
```

### 로딩 컴포넌트 (`src/common/components/loading/`)

- **`LoadingScreen.tsx`**: 전체 화면 로딩
- **`LoadingSpinner.tsx`**: 인라인 스피너

### Empty State 컴포넌트 (`src/common/components/empty/`)

- 데이터가 없을 때 표시
- 아이콘 + 메시지

### 토스트 컴포넌트 (`src/common/components/toast/`)

- **`react-native-toast-message` 사용**
- 설정: `toastConfig.ts`

**사용 예시**:

```typescript
import Toast from "react-native-toast-message";

Toast.show({
  type: "success",
  text1: "성공",
  text2: "기도방이 생성되었습니다.",
});
```

---

## 8. 도메인 별 구조 패턴

각 도메인(`src/domain/[domain]/`)은 다음과 같은 일관된 구조를 따릅니다:

```
domain/[domain-name]/
├── types/                        # TypeScript 타입 정의
│   ├── request/                 # API 요청 타입
│   ├── response/                # API 응답 타입
│   ├── params/                  # 함수 파라미터 타입
│   └── [domain]Store.ts         # 스토어 타입
├── stores/                       # Zustand 스토어
│   └── use[Domain]Store.ts
├── hooks/                        # React 훅
│   ├── queries/                 # React Query useQuery 훅
│   │   └── use[Domain]Queries.ts
│   └── mutations/               # React Query useMutation 훅
│       └── use[Domain]Mutations.ts
├── services/                     # API 호출 로직
│   └── [domain]Service.ts
├── utils/                        # 유틸리티 함수
├── constants/                    # 도메인 상수
├── events/                       # 이벤트 리스너 (일부 도메인)
└── api/                          # API 엔드포인트 (일부 도메인)
```

### 도메인별 책임 분리

#### 1. Types (`types/`)

**목적**: 타입 안전성 보장

```typescript
// types/request/createRoomRequest.ts
export interface CreateRoomRequest {
  name: string;
  description?: string;
}

// types/response/roomResponse.ts
export interface RoomResponse {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
}

// types/roomStore.ts
export interface RoomState {
  selectedRoom: RoomResponse | null;
}

export interface RoomActions {
  setSelectedRoom: (room: RoomResponse) => void;
  clear: () => void;
}

export type RoomStore = RoomState & RoomActions;
```

#### 2. Services (`services/`)

**목적**: API 호출 로직 캡슐화

```typescript
// services/roomService.ts
import apiService from "@/common/apis/apiService";
import { RoomResponse } from "../types/response/roomResponse";
import { CreateRoomRequest } from "../types/request/createRoomRequest";

export const roomService = {
  fetchRooms: async (): Promise<RoomResponse[]> => {
    const response = await apiService.get<{ data: RoomResponse[] }>(
      "/v1/rooms"
    );
    return response.data.data;
  },

  createRoom: async (data: CreateRoomRequest): Promise<void> => {
    await apiService.post("/v1/rooms", data);
  },

  deleteRoom: async (roomId: string): Promise<void> => {
    await apiService.delete(`/v1/rooms/${roomId}`);
  },
};
```

#### 3. Hooks (`hooks/`)

**목적**: React 컴포넌트와 비즈니스 로직 연결

```typescript
// hooks/queries/useRoomQueries.ts
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/common/constants/queryKeys";
import { roomService } from "../../services/roomService";

export const useRoomsQuery = () => {
  return useQuery({
    queryKey: [QueryKeys.ROOMS],
    queryFn: roomService.fetchRooms,
  });
};

// hooks/mutations/useRoomMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/common/constants/queryKeys";
import { roomService } from "../../services/roomService";

export const useCreateRoomMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: roomService.createRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.ROOMS] });
    },
  });
};
```

#### 4. Stores (`stores/`)

**목적**: 클라이언트 상태 관리

```typescript
// stores/useSelectedRoomStore.ts
import { create } from "zustand";
import { RoomStore, RoomState } from "../types/roomStore";

const initialState: RoomState = {
  selectedRoom: null,
};

export const useSelectedRoomStore = create<RoomStore>((set) => ({
  ...initialState,

  setSelectedRoom: (room) => set({ selectedRoom: room }),
  clear: () => set(initialState),
}));
```

### 도메인 사용 예시

```typescript
// app/(protected)/rooms/index.tsx
import { useRoomsQuery } from "@/domain/rooms/hooks/queries/useRoomQueries";
import { useCreateRoomMutation } from "@/domain/rooms/hooks/mutations/useRoomMutations";
import { useSelectedRoomStore } from "@/domain/rooms/stores/useSelectedRoomStore";

export default function RoomsScreen() {
  // 서버 상태 (React Query)
  const { data: rooms, isLoading } = useRoomsQuery();
  const createRoomMutation = useCreateRoomMutation();

  // 클라이언트 상태 (Zustand)
  const { selectedRoom, setSelectedRoom } = useSelectedRoomStore();

  const handleCreateRoom = () => {
    createRoomMutation.mutate({
      name: "새 기도방",
      description: "설명",
    });
  };

  // ...
}
```

---

## 9. 코드 스타일 및 컨벤션

### TypeScript

- **Strict Mode**: 활성화
- **타입 정의**: 모든 함수, 컴포넌트에 명시적 타입 지정
- **Any 금지**: `any` 타입 사용 지양

### 파일 및 디렉토리 명명

#### 파일명
- **컴포넌트**: PascalCase (예: `PrayerCard.tsx`)
- **훅**: camelCase with "use" prefix (예: `usePrayerQueries.ts`)
- **서비스**: camelCase with "[domain]Service" (예: `prayerService.ts`)
- **스토어**: camelCase with "use[Domain]Store" (예: `useAuthStore.ts`)
- **타입**: camelCase (예: `prayerTitle.ts`)

#### 디렉토리명
- **소문자 kebab-case**: 여러 단어 (예: `phone-registration/`)
- **camelCase**: 단일 도메인명 (예: `prayers/`, `rooms/`)

### 컴포넌트 작성

#### 기본 구조

```typescript
import React from "react";
import { View, StyleSheet } from "react-native";

interface MyComponentProps {
  title: string;
  onPress?: () => void;
}

export default function MyComponent({ title, onPress }: MyComponentProps) {
  return (
    <View style={styles.container}>
      {/* 컴포넌트 내용 */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // 스타일
  },
});
```

#### 규칙
1. **함수형 컴포넌트** 사용
2. **default export** 사용
3. Props는 **인터페이스로 정의**
4. **StyleSheet.create()** 사용하여 스타일 정의
5. 스타일은 컴포넌트 하단에 위치

### 경로 별칭

- **`@/`**: `src/` 디렉토리를 가리킴
- 예: `import { color } from "@/common/styles/color";`

### Import 순서

1. React 및 React Native 관련
2. 서드파티 라이브러리
3. 프로젝트 내부 모듈 (`@/` 경로)
4. 타입 import (필요시)

```typescript
// 1. React
import React from "react";
import { View, Text, StyleSheet } from "react-native";

// 2. 서드파티
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";

// 3. 내부 모듈
import { color } from "@/common/styles/color";
import { useRoomsQuery } from "@/domain/rooms/hooks/queries/useRoomQueries";

// 4. 타입
import type { RoomResponse } from "@/domain/rooms/types/response/roomResponse";
```

### 주석

- **한국어** 주석 사용
- 복잡한 로직에는 설명 주석 추가
- TODO, FIXME, NOTE 등의 태그 활용

```typescript
// TODO: 이 부분은 추후 리팩토링 필요
// FIXME: 에러 처리 로직 개선
// NOTE: 이 함수는 토큰 갱신 시에만 호출됨
```

### 코드 포맷팅

- **들여쓰기**: 2 spaces
- **세미콜론**: 사용
- **따옴표**: 큰따옴표(") 우선, 작은따옴표(') 혼용 가능

---

## 10. 개발 시 주의사항 및 베스트 프랙티스

### 1. 인증 처리

#### ✅ DO

```typescript
// api.ts의 interceptor가 자동으로 토큰을 관리하므로,
// 서비스 레이어에서는 토큰을 직접 다루지 않음
export const roomService = {
  fetchRooms: async () => {
    const response = await apiService.get("/v1/rooms");
    return response.data.data;
  },
};
```

#### ❌ DON'T

```typescript
// 서비스에서 직접 토큰을 가져오지 말 것
import { tokenUtils } from "@/domain/auth/utils/tokenUtils";

export const roomService = {
  fetchRooms: async () => {
    const token = await tokenUtils.getAccessToken(); // ❌
    const response = await apiService.get("/v1/rooms", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },
};
```

### 2. 에러 처리

#### ✅ DO

```typescript
// React Query의 onError 콜백 활용
export const useCreateRoomMutation = () => {
  return useMutation({
    mutationFn: roomService.createRoom,
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "오류",
        text2: error.message || "기도방 생성에 실패했습니다.",
      });
    },
  });
};
```

#### ❌ DON'T

```typescript
// 컴포넌트에서 try-catch로 일일이 처리하지 말 것
const handleCreateRoom = async () => {
  try {
    await createRoomMutation.mutateAsync({ name: "새 기도방" });
  } catch (error) {
    // ❌ 중복된 에러 처리
    alert("오류 발생");
  }
};
```

### 3. 상태 관리

#### ✅ DO

```typescript
// 서버 상태는 React Query로
const { data: rooms } = useRoomsQuery();

// 클라이언트 상태는 Zustand로
const { selectedRoom, setSelectedRoom } = useSelectedRoomStore();
```

#### ❌ DON'T

```typescript
// 서버 데이터를 useState에 저장하지 말 것
const [rooms, setRooms] = useState([]); // ❌

useEffect(() => {
  fetchRooms().then(setRooms); // ❌
}, []);
```

### 4. 캐시 무효화

#### ✅ DO

```typescript
// Mutation 성공 시 관련 쿼리 무효화
export const useCreateRoomMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: roomService.createRoom,
    onSuccess: () => {
      // 기도방 목록 쿼리 무효화 → 자동 재조회
      queryClient.invalidateQueries({ queryKey: [QueryKeys.ROOMS] });
    },
  });
};
```

#### ❌ DON'T

```typescript
// 수동으로 refetch 호출하지 말 것
const { refetch } = useRoomsQuery();

const handleCreateRoom = async () => {
  await createRoomMutation.mutateAsync({ name: "새 기도방" });
  refetch(); // ❌ invalidateQueries를 사용해야 함
};
```

### 5. 레이아웃 일관성

#### ✅ DO

```typescript
// 공통 레이아웃 컴포넌트 사용
import { Top1Body10 } from "@/common/components/layout";
import { BackButtonHeader } from "@/common/components/header";

export default function MyScreen() {
  return (
    <Top1Body10
      tops={[<BackButtonHeader key="header" title="제목" />]}
      bodies={[<View key="body">{/* 내용 */}</View>]}
    />
  );
}
```

#### ❌ DON'T

```typescript
// 레이아웃을 매번 직접 구현하지 말 것
export default function MyScreen() {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: 70 }}>{/* 헤더 */}</View>
      <View style={{ flex: 1 }}>{/* 본문 */}</View>
    </View>
  );
}
```

### 6. 타입 안전성

#### ✅ DO

```typescript
// API 응답 타입 명시
const response = await apiService.get<{ data: RoomResponse[] }>(
  "/v1/rooms"
);
return response.data.data; // RoomResponse[] 타입 보장
```

#### ❌ DON'T

```typescript
// any 타입 사용 금지
const response = await apiService.get("/v1/rooms"); // any
return response.data.data; // any
```

### 7. 컴포넌트 분리

#### ✅ DO

```typescript
// 재사용 가능한 작은 컴포넌트로 분리
function RoomCard({ room }: { room: RoomResponse }) {
  return <View>{/* 카드 내용 */}</View>;
}

export default function RoomsScreen() {
  const { data: rooms } = useRoomsQuery();

  return (
    <View>
      {rooms?.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </View>
  );
}
```

#### ❌ DON'T

```typescript
// 모든 로직을 한 컴포넌트에 넣지 말 것
export default function RoomsScreen() {
  const { data: rooms } = useRoomsQuery();

  return (
    <View>
      {rooms?.map((room) => (
        <View key={room.id}>
          {/* 복잡한 카드 UI가 여기에 모두 들어감 */}
        </View>
      ))}
    </View>
  );
}
```

### 8. 네비게이션

#### ✅ DO

```typescript
import { router } from "expo-router";

// Expo Router 사용
router.push("/rooms/123");
```

#### ❌ DON'T

```typescript
import { useNavigation } from "@react-navigation/native";

// React Navigation의 navigation prop 직접 사용 금지
const navigation = useNavigation();
navigation.navigate("Rooms", { id: "123" }); // ❌
```

### 9. 스타일링

#### ✅ DO

```typescript
// StyleSheet.create 사용
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
  },
});

<View style={styles.container} />
```

#### ❌ DON'T

```typescript
// 인라인 스타일 남발 금지
<View style={{ flex: 1, backgroundColor: "#f0f0f0" }} /> // ❌
```

### 10. 모달 사용

#### ✅ DO

```typescript
import { useGlobalAlertModalStore } from "@/common/components/modal/stores/useGlobalAlertModalStore";

const { open } = useGlobalAlertModalStore();

open({
  title: "알림",
  message: "작업이 완료되었습니다.",
  confirmText: "확인",
});
```

#### ❌ DON'T

```typescript
// 매번 새로운 모달 컴포넌트를 만들지 말 것
const [modalVisible, setModalVisible] = useState(false);

<Modal visible={modalVisible}>
  <Text>작업이 완료되었습니다.</Text>
  <Button onPress={() => setModalVisible(false)}>확인</Button>
</Modal>
```

---

## 추가 참고 사항

### 디버깅 팁

1. **API 요청/응답 로깅**:
   - `src/common/apis/api.ts`의 interceptor에 로그 추가

2. **React Query DevTools**:
   - 개발 중 React Query 상태 확인
   - `CustomQueryClientProvider`에서 활성화 가능

3. **Zustand DevTools**:
   - Redux DevTools로 Zustand 상태 모니터링

### 성능 최적화

1. **React.memo** 사용:
   - 불필요한 리렌더링 방지
   - 리스트 아이템 컴포넌트에 적용

2. **useMemo / useCallback** 사용:
   - 복잡한 계산 결과 메모이제이션
   - 콜백 함수 메모이제이션

3. **FlatList 최적화**:
   - `keyExtractor` 명시
   - `getItemLayout` 사용 (고정 높이일 경우)
   - `removeClippedSubviews` 활성화

### 보안

1. **토큰 저장**:
   - **반드시 SecureStore 사용**
   - AsyncStorage 사용 금지

2. **민감 정보**:
   - 환경 변수 사용 (`app.config.js`)
   - Git에 커밋하지 않을 것

3. **API 키**:
   - Firebase 설정은 `google-services.json` / `GoogleService-Info.plist`
   - Git에 커밋하지 않을 것

---

## 마무리

이 가이드는 **기도함께** 프로젝트의 현재 아키텍처와 패턴을 반영한 종합 문서입니다.

### 새로운 기능 개발 시 체크리스트

- [ ] 도메인 디렉토리 구조 따르기 (`types/`, `services/`, `hooks/`, `stores/`)
- [ ] API 서비스에서 타입 명시
- [ ] React Query로 서버 상태 관리
- [ ] Zustand로 클라이언트 상태 관리
- [ ] 공통 레이아웃 컴포넌트 사용
- [ ] 에러 처리는 React Query의 onError 활용
- [ ] 캐시 무효화 패턴 준수
- [ ] TypeScript strict mode 준수
- [ ] 코드 스타일 컨벤션 준수
- [ ] 주석은 한국어로 작성

### 리팩토링 시 체크리스트

- [ ] 기존 아키텍처 패턴 유지
- [ ] 타입 안전성 개선
- [ ] 중복 코드 제거 (공통 컴포넌트/훅 추출)
- [ ] 성능 최적화 (React.memo, useMemo 등)
- [ ] 에러 처리 개선
- [ ] 테스트 코드 작성 (필요시)

---

**문서 버전**: 1.0
**최종 업데이트**: 2025-12-06
