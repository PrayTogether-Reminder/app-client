# 기도함께 - 개발 백로그

> **작성일**: 2025-12-06
> **버전**: 1.0
> **목적**: 추후 개발할 기능들에 대한 구체적인 기획 및 요구사항 정의

---

## 목차

1. [함께 기도한 사람 표시](#1-함께-기도한-사람-표시)
2. [기도 연속 기록 (Streak)](#2-기도-연속-기록-streak)
3. [개인 기도 대시보드](#3-개인-기도-대시보드)
4. [기도 제목 자동 만료](#4-기도-제목-자동-만료)

---

## 1. 함께 기도한 사람 표시

### 1.1 기능 개요

**목적**: 각 기도 제목마다 누가 기도했는지 표시하여 "함께" 기도하는 경험을 강화하고, 기도가 실제로 응원받고 있다는 느낌을 제공합니다.

**핵심 가치**: 응원하는 공동체, 투명성, 감사

### 1.2 사용자 스토리

```
As a 기도 제목 작성자
I want to 누가 내 기도 제목을 위해 기도했는지 보고 싶다
So that 내 기도가 응원받고 있다는 것을 느끼고 감사할 수 있다

As a 기도방 멤버
I want to 내가 기도한 제목들과 기록을 확인하고 싶다
So that 지속적으로 기도 생활을 이어갈 수 있다
```

### 1.3 상세 요구사항

#### 1.3.1 기도 기록 저장

**기능**:
- 사용자가 "기도 완료" 버튼을 누르면 기도 기록이 저장됨
- 기록 정보: 누가(userId), 언제(timestamp), 어떤 기도 제목(prayerId)

**데이터 구조**:
```typescript
interface PrayerLog {
  id: string;
  prayerId: string;        // 기도 제목 ID
  userId: string;          // 기도한 사람 ID
  userName: string;        // 기도한 사람 이름
  prayedAt: Date;          // 기도한 시간
  roomId: string;          // 기도방 ID
}
```

#### 1.3.2 기도한 사람 목록 표시

**위치**: 기도 상세 화면

**표시 방식**:
```
Option A (간단):
✅ 3명이 기도했어요
🙏 철수, 영희, 민수

Option B (상세):
✅ 5명이 기도했어요
👤 철수 (방금 전)
👤 영희 (1시간 전)
👤 민수 (2시간 전)
👤 지영 (어제)
👤 현우 (2일 전)

Option C (아바타):
✅ 5명이 기도했어요
[프로필사진들 겹쳐서 표시]
```

**권장**: Option A로 시작 → Option C로 발전 (프로필 사진 기능 추가 후)

#### 1.3.3 기도 횟수 집계

**표시 정보**:
- 총 기도한 사람 수
- 중복 제거 여부: **중복 제거** (한 사람이 여러 번 기도해도 1명으로 카운트)
- 또는: 총 기도 횟수와 기도한 사람 수 모두 표시

**예시**:
```
✅ 5명이 총 12번 기도했어요
🙏 철수, 영희, 민수, 지영, 현우
```

#### 1.3.4 기도 기록 조회

**조회 옵션**:
1. **전체 기록**: 이 기도 제목을 위해 기도한 모든 사람
2. **최근 기록**: 최근 24시간/7일 내 기도한 사람
3. **나의 기록**: 내가 언제 기도했는지

**정렬 기준**:
- 최근 기도한 순서
- 이름 가나다순

### 1.4 UI/UX 설계

#### 1.4.1 기도 목록 화면 (기도방 상세)

```
┌─────────────────────────────────┐
│ 건강을 위한 기도                │
│ 작성자: 철수 · 2일 전           │
│ ✅ 5명이 기도했어요              │
└─────────────────────────────────┘
```

#### 1.4.2 기도 상세 화면

```
┌─────────────────────────────────┐
│ 건강을 위한 기도                │
│ 작성자: 철수 · 2025-12-01       │
├─────────────────────────────────┤
│                                 │
│ 💬 기도 내용                    │
│ - 영희님을 위해: 감기가...      │
│ - 민수님을 위해: 건강검진...    │
│                                 │
├─────────────────────────────────┤
│ ✅ 5명이 기도했어요              │
│                                 │
│ 🙏 기도한 사람들                │
│ 👤 철수 (방금 전)               │
│ 👤 영희 (1시간 전)              │
│ 👤 민수 (2시간 전)              │
│ 👤 지영 (어제)                  │
│ 👤 현우 (2일 전)                │
│                                 │
│ [더 보기 v]                     │
│                                 │
├─────────────────────────────────┤
│           [기도 알림]            │
└─────────────────────────────────┘
```

#### 1.4.3 기도 기록 더보기 모달

```
┌─────────────────────────────────┐
│      기도한 사람들               │
├─────────────────────────────────┤
│                                 │
│ 📊 총 5명이 12번 기도했어요      │
│                                 │
│ 👤 철수님                       │
│    3번 기도 · 마지막: 방금 전   │
│                                 │
│ 👤 영희님                       │
│    2번 기도 · 마지막: 1시간 전  │
│                                 │
│ 👤 민수님                       │
│    4번 기도 · 마지막: 2시간 전  │
│                                 │
│ 👤 지영님                       │
│    2번 기도 · 마지막: 어제      │
│                                 │
│ 👤 현우님                       │
│    1번 기도 · 마지막: 2일 전    │
│                                 │
│           [닫기]                │
└─────────────────────────────────┘
```

### 1.5 API 요구사항

#### 1.5.1 기도 기록 생성

```
POST /v1/prayers/{prayerId}/logs

Request Body:
{
  "prayedAt": "2025-12-06T10:30:00Z"
}

Response:
{
  "success": true,
  "data": {
    "logId": "log_123",
    "prayerId": "prayer_456",
    "userId": "user_789",
    "prayedAt": "2025-12-06T10:30:00Z"
  }
}
```

#### 1.5.2 기도 기록 조회

```
GET /v1/prayers/{prayerId}/logs?limit=10&offset=0

Response:
{
  "success": true,
  "data": {
    "totalCount": 12,
    "uniqueUserCount": 5,
    "logs": [
      {
        "userId": "user_1",
        "userName": "철수",
        "prayedAt": "2025-12-06T10:30:00Z",
        "prayCount": 3  // 이 사람이 이 기도 제목을 위해 기도한 총 횟수
      },
      {
        "userId": "user_2",
        "userName": "영희",
        "prayedAt": "2025-12-06T09:00:00Z",
        "prayCount": 2
      }
    ]
  }
}
```

#### 1.5.3 내 기도 기록 조회

```
GET /v1/users/me/prayer-logs?roomId={roomId}&startDate=2025-12-01

Response:
{
  "success": true,
  "data": {
    "totalPrayerCount": 25,
    "logs": [
      {
        "prayerId": "prayer_1",
        "prayerTitle": "건강을 위한 기도",
        "prayedAt": "2025-12-06T10:30:00Z",
        "roomName": "가족 기도방"
      }
    ]
  }
}
```

### 1.6 데이터베이스 스키마

```sql
CREATE TABLE prayer_logs (
  id VARCHAR(36) PRIMARY KEY,
  prayer_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  room_id VARCHAR(36) NOT NULL,
  prayed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_prayer_id (prayer_id),
  INDEX idx_user_id (user_id),
  INDEX idx_room_id (room_id),
  INDEX idx_prayed_at (prayed_at),

  FOREIGN KEY (prayer_id) REFERENCES prayers(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);
```

### 1.7 비즈니스 규칙

1. **기도 기록 생성**:
   - 기도방 멤버만 기도 기록 생성 가능
   - 하루에 같은 기도 제목을 여러 번 기도 가능
   - 기도 기록은 삭제 불가 (통계 유지)

2. **기도 기록 조회**:
   - 기도방 멤버만 조회 가능
   - 기도한 사람의 이름만 표시 (프라이버시)
   - 기도 횟수는 공개

3. **알림 연동**:
   - 기도 완료 알림을 보낼 때 자동으로 기도 기록 생성
   - 알림 없이 조용히 기도 기록만 남기는 옵션 제공 (선택)

### 1.8 예외 처리

1. **기도 제목이 삭제된 경우**:
   - 기도 기록은 유지 (통계 목적)
   - 삭제된 기도 제목 표시: "삭제된 기도 제목"

2. **사용자가 기도방을 나간 경우**:
   - 기존 기도 기록은 유지
   - 이름은 표시하되 프로필 접근 불가

3. **네트워크 오류**:
   - 로컬에 임시 저장 후 나중에 동기화
   - 중복 방지 로직 필요

### 1.9 개발 우선순위

- **Phase 1** (MVP):
  - 기도 기록 저장
  - 기도한 사람 수 표시 (숫자만)
  - 기도한 사람 이름 목록 표시 (최대 5명)

- **Phase 2**:
  - 기도 횟수 집계
  - 기도한 시간 표시
  - 더보기 기능

- **Phase 3**:
  - 내 기도 기록 조회
  - 통계 및 분석

---

## 2. 기도 연속 기록 (Streak)

### 2.1 기능 개요

**목적**: 연속으로 기도한 날짜를 표시하여 지속적인 기도 생활을 동기부여하고, 기도 습관 형성을 돕습니다.

**핵심 가치**: 지속성, 성장, 동기부여

### 2.2 사용자 스토리

```
As a 사용자
I want to 내가 며칠 연속으로 기도했는지 보고 싶다
So that 기도 습관을 유지하고 동기부여를 받을 수 있다

As a 기도방 멤버
I want to 우리 기도방의 연속 기도 기록을 보고 싶다
So that 함께 기도하는 공동체의 성장을 느낄 수 있다
```

### 2.3 상세 요구사항

#### 2.3.1 연속 기도 계산 로직

**정의**:
- "연속 기도": 매일 최소 1번 이상 기도한 경우
- 하루 기준: 자정(00:00) ~ 23:59
- 시간대: 사용자 로컬 타임존 기준

**계산 방식**:
```
- 오늘 기도함: 연속 기록 +1
- 오늘 기도 안 함: 연속 기록 유지 (내일까지 기회)
- 1일 건너뜀: 연속 기록 초기화 (0으로 리셋)
```

**예시**:
```
12/1 (토): 기도 → 1일 연속 🔥
12/2 (일): 기도 → 2일 연속 🔥🔥
12/3 (월): 기도 안 함 → 2일 연속 유지
12/4 (화): 기도 안 함 → 0일 연속 (초기화)
12/5 (수): 기도 → 1일 연속 🔥
```

#### 2.3.2 개인 연속 기록

**표시 위치**:
- 마이페이지 상단
- 기도 완료 후 축하 화면

**표시 정보**:
```
🔥 현재 연속 기도: 7일
📅 최장 연속 기록: 21일
📊 총 기도 일수: 45일 (지난 60일 중)
```

**아이콘**:
- 1-6일: 🔥
- 7-13일: 🔥🔥
- 14-20일: 🔥🔥🔥
- 21일 이상: 🔥🔥🔥🔥

#### 2.3.3 기도방 연속 기록

**정의**: 기도방 멤버 중 최소 1명이 기도한 날짜를 기준으로 계산

**표시 위치**:
- 기도방 상세 화면 상단

**표시 정보**:
```
✨ 우리 기도방: 15일 연속 기도중!
📅 최장 기록: 30일
```

#### 2.3.4 마일스톤 배지

**배지 종류**:
```
🥉 청동: 7일 연속
🥈 은메달: 14일 연속
🥇 금메달: 21일 연속
💎 다이아몬드: 30일 연속
👑 왕관: 50일 연속
⭐ 별: 100일 연속
```

**획득 시**:
- 축하 팝업 표시
- (선택) 기도방 멤버들에게 알림

### 2.4 UI/UX 설계

#### 2.4.1 마이페이지 연속 기록 섹션

```
┌─────────────────────────────────┐
│         마이페이지               │
├─────────────────────────────────┤
│                                 │
│ 👤 철수님                       │
│                                 │
│ ┌─────────────────────────────┐ │
│ │   🔥 기도 연속 기록          │ │
│ │                             │ │
│ │   현재: 7일 연속             │ │
│ │   최장: 21일 연속            │ │
│ │                             │ │
│ │   🥉 청동 배지 획득!         │ │
│ │                             │ │
│ │   [상세 보기]               │ │
│ └─────────────────────────────┘ │
│                                 │
│ 📋 프로필 수정                  │
│ 🔒 비밀번호 변경                │
│ ...                             │
└─────────────────────────────────┘
```

#### 2.4.2 기도 완료 축하 화면

```
┌─────────────────────────────────┐
│                                 │
│         🙏                      │
│    기도를 완료했어요!            │
│                                 │
│    🔥 7일 연속 기도중            │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  🎉 축하합니다!              │ │
│ │  청동 배지를 획득했어요!     │ │
│ │         🥉                   │ │
│ └─────────────────────────────┘ │
│                                 │
│  알림을 보내시겠어요?           │
│                                 │
│    [아니요]    [알림 보내기]    │
│                                 │
└─────────────────────────────────┘
```

#### 2.4.3 연속 기록 상세 화면

```
┌─────────────────────────────────┐
│      기도 연속 기록              │
├─────────────────────────────────┤
│                                 │
│ 🔥 현재 연속: 7일                │
│ 📅 최장 연속: 21일               │
│ 📊 총 기도 일수: 45일            │
│    (지난 60일 중)               │
│                                 │
├─────────────────────────────────┤
│                                 │
│ 📅 기도 캘린더                  │
│                                 │
│   월  화  수  목  금  토  일     │
│ [✓] [✓] [✓] [✓] [✓] [✓] [✓]    │
│ [✓] [✓] [ ] [✓] [✓] [✓] [✓]    │
│ [✓] [ ] [ ] [✓] [✓] [✓] [✓]    │
│                                 │
│ ✓ = 기도한 날                   │
│                                 │
├─────────────────────────────────┤
│                                 │
│ 🏆 획득한 배지                  │
│                                 │
│ 🥉 청동 (7일)  ✅               │
│ 🥈 은메달 (14일) ❌             │
│ 🥇 금메달 (21일) ❌             │
│ 💎 다이아몬드 (30일) ❌         │
│                                 │
└─────────────────────────────────┘
```

### 2.5 API 요구사항

#### 2.5.1 연속 기록 조회

```
GET /v1/users/me/streak

Response:
{
  "success": true,
  "data": {
    "currentStreak": 7,        // 현재 연속 일수
    "longestStreak": 21,       // 최장 연속 일수
    "totalPrayerDays": 45,     // 총 기도 일수
    "lastPrayedAt": "2025-12-06T10:30:00Z",
    "badges": [
      {
        "type": "BRONZE",
        "name": "청동",
        "requiredDays": 7,
        "achieved": true,
        "achievedAt": "2025-12-05T08:00:00Z"
      }
    ]
  }
}
```

#### 2.5.2 기도방 연속 기록 조회

```
GET /v1/rooms/{roomId}/streak

Response:
{
  "success": true,
  "data": {
    "currentStreak": 15,
    "longestStreak": 30,
    "totalPrayerDays": 60
  }
}
```

#### 2.5.3 기도 캘린더 조회

```
GET /v1/users/me/prayer-calendar?year=2025&month=12

Response:
{
  "success": true,
  "data": {
    "year": 2025,
    "month": 12,
    "days": [
      {
        "date": "2025-12-01",
        "prayerCount": 3,
        "prayed": true
      },
      {
        "date": "2025-12-02",
        "prayerCount": 0,
        "prayed": false
      }
    ]
  }
}
```

### 2.6 데이터베이스 스키마

```sql
-- 사용자별 연속 기록 (캐시 테이블)
CREATE TABLE user_streaks (
  user_id VARCHAR(36) PRIMARY KEY,
  current_streak INT NOT NULL DEFAULT 0,
  longest_streak INT NOT NULL DEFAULT 0,
  last_prayed_date DATE,
  total_prayer_days INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 기도방별 연속 기록 (캐시 테이블)
CREATE TABLE room_streaks (
  room_id VARCHAR(36) PRIMARY KEY,
  current_streak INT NOT NULL DEFAULT 0,
  longest_streak INT NOT NULL DEFAULT 0,
  last_prayed_date DATE,
  total_prayer_days INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

-- 배지 획득 기록
CREATE TABLE user_badges (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  badge_type ENUM('BRONZE', 'SILVER', 'GOLD', 'DIAMOND', 'CROWN', 'STAR') NOT NULL,
  achieved_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_user_id (user_id),
  UNIQUE KEY unique_user_badge (user_id, badge_type),

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 2.7 비즈니스 규칙

1. **연속 기록 계산**:
   - 매일 자정(00:00)에 전날 기도하지 않은 사용자의 연속 기록 확인
   - 2일 연속 기도하지 않으면 연속 기록 초기화
   - 기도 로그 테이블에서 실시간 계산

2. **배지 획득**:
   - 연속 기록 달성 시 자동으로 배지 부여
   - 한 번 획득한 배지는 연속 기록이 끊겨도 유지
   - 배지 획득 시 축하 팝업 표시

3. **기도 인정 기준**:
   - "기도 알림" 버튼 클릭 시 기도로 인정
   - 하루에 여러 번 기도해도 1일로 계산
   - 어떤 기도방에서든 기도하면 개인 연속 기록에 반영

4. **기도방 연속 기록**:
   - 멤버 중 1명이라도 기도하면 카운트
   - 모든 멤버가 기도하지 않은 날이 2일 연속이면 초기화

### 2.8 예외 처리

1. **시간대 변경**:
   - 사용자의 로컬 타임존 기준으로 계산
   - 여행 등으로 시간대 변경 시에도 정확히 계산

2. **데이터 불일치**:
   - 캐시 테이블(user_streaks)과 실제 기도 로그 불일치 시 재계산
   - 매일 자정에 일괄 검증 및 수정

3. **서버 오류**:
   - 연속 기록 계산 실패 시 기존 값 유지
   - 다음 계산 주기에 재시도

### 2.9 개발 우선순위

- **Phase 1** (MVP):
  - 개인 연속 기록 계산 및 표시
  - 기본 배지 시스템 (청동, 은메달, 금메달)

- **Phase 2**:
  - 기도 캘린더
  - 기도방 연속 기록

- **Phase 3**:
  - 추가 배지 (다이아몬드, 왕관, 별)
  - 배지 획득 알림 및 공유 기능

---

## 3. 개인 기도 대시보드

### 3.1 기능 개요

**목적**: 사용자 자신의 기도 생활을 한눈에 파악하고, 기도 패턴을 분석하여 더 나은 기도 생활을 돕습니다.

**핵심 가치**: 자기 성찰, 성장, 동기부여

### 3.2 사용자 스토리

```
As a 사용자
I want to 내 기도 생활을 통계로 보고 싶다
So that 나의 기도 습관을 파악하고 개선할 수 있다

As a 사용자
I want to 어떤 기도방에서 얼마나 활동했는지 보고 싶다
So that 더 관심을 가져야 할 기도방을 알 수 있다
```

### 3.3 상세 요구사항

#### 3.3.1 대시보드 주요 지표

**기본 통계**:
```
- 총 기도 횟수 (전체 기간)
- 이번 주 기도 횟수
- 이번 달 기도 횟수
- 평균 하루 기도 횟수 (지난 30일)
```

**연속 기록**:
```
- 현재 연속 기도 일수
- 최장 연속 기도 일수
- 총 기도한 일수
```

**기도방별 통계**:
```
- 가장 활발한 기도방
- 기도방별 기도 횟수
- 기도방별 기도 비율
```

**기도 시간대 분석**:
```
- 주로 기도하는 시간대 (아침/점심/저녁/밤)
- 시간대별 기도 횟수 분포
```

**주간/월간 트렌드**:
```
- 지난 7일간 기도 횟수 그래프
- 지난 30일간 기도 횟수 그래프
- 전월 대비 증감률
```

#### 3.3.2 기간별 조회

**기간 옵션**:
- 오늘
- 이번 주
- 이번 달
- 지난 30일
- 지난 3개월
- 전체

#### 3.3.3 기도 활동 타임라인

**표시 정보**:
```
최근 기도 활동:
- 12/6 10:30 - "건강을 위한 기도" (가족 기도방)
- 12/6 08:00 - "시험 합격을 위한 기도" (친구 기도방)
- 12/5 21:00 - "새 직장을 위한 기도" (개인 기도방)
```

### 3.4 UI/UX 설계

#### 3.4.1 대시보드 메인 화면

```
┌─────────────────────────────────┐
│      나의 기도 대시보드          │
├─────────────────────────────────┤
│                                 │
│ 📊 이번 달 통계                 │
│                                 │
│ ┌─────┐ ┌─────┐ ┌─────┐        │
│ │ 25  │ │  7  │ │ 3.2 │        │
│ │기도 │ │ 일  │ │평균 │        │
│ └─────┘ └─────┘ └─────┘        │
│  총 횟수  연속    하루           │
│                                 │
├─────────────────────────────────┤
│                                 │
│ 📈 주간 기도 트렌드             │
│                                 │
│ 기도                            │
│ 횟수                            │
│  5│     ┌─┐                    │
│  4│     │ │     ┌─┐            │
│  3│ ┌─┐ │ │ ┌─┐│ │            │
│  2│ │ │ │ │ │ ││ │┌─┐        │
│  1│ │ │ │ │ │ ││ ││ │┌─┐    │
│  0└─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─>    │
│    월 화 수 목 금 토 일          │
│                                 │
├─────────────────────────────────┤
│                                 │
│ 🏠 기도방별 활동                │
│                                 │
│ 가족 기도방        12번 (48%)   │
│ ████████████░░░░░░░░░░░░░       │
│                                 │
│ 친구 기도방         8번 (32%)   │
│ ████████░░░░░░░░░░░░░░░░        │
│                                 │
│ 교회 기도방         5번 (20%)   │
│ █████░░░░░░░░░░░░░░░░░░░        │
│                                 │
├─────────────────────────────────┤
│                                 │
│ 🕐 주로 기도하는 시간           │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 아침 (6-12시)    30%        │ │
│ │ 점심 (12-18시)   20%        │ │
│ │ 저녁 (18-22시)   40%  ⭐    │ │
│ │ 밤 (22-6시)      10%        │ │
│ └─────────────────────────────┘ │
│                                 │
├─────────────────────────────────┤
│                                 │
│ 📜 최근 기도 활동               │
│                                 │
│ 12/6 10:30                      │
│ 건강을 위한 기도 (가족 기도방)  │
│                                 │
│ 12/6 08:00                      │
│ 시험 합격 (친구 기도방)         │
│                                 │
│ 12/5 21:00                      │
│ 새 직장 (개인 기도방)           │
│                                 │
│ [더 보기]                       │
│                                 │
└─────────────────────────────────┘
```

#### 3.4.2 대시보드 접근 방법

**옵션 1**: 마이페이지에 새 탭 추가
```
[기도방 목록] [마이페이지]
              ↓
      [프로필] [통계]
```

**옵션 2**: 마이페이지 상단에 카드 형태로 배치
```
마이페이지
├─ 나의 기도 통계 (카드)
├─ 프로필 수정
├─ 비밀번호 변경
└─ ...
```

**권장**: 옵션 2 (접근성 좋음)

#### 3.4.3 상세 통계 화면

```
┌─────────────────────────────────┐
│    상세 통계 (12월)              │
├─────────────────────────────────┤
│                                 │
│ 기간 선택:                      │
│ [오늘] [이번주] [이번달] [전체] │
│                                 │
├─────────────────────────────────┤
│                                 │
│ 📊 전체 통계                    │
│                                 │
│ 총 기도 횟수: 128번             │
│ 평균 하루: 4.1번                │
│ 가장 많이 기도한 날: 12/15 (8번)│
│                                 │
├─────────────────────────────────┤
│                                 │
│ 📈 월간 트렌드                  │
│                                 │
│ [그래프 표시]                   │
│                                 │
│ 전월 대비: +15% ⬆️              │
│                                 │
├─────────────────────────────────┤
│                                 │
│ 🏆 이번 달 성과                 │
│                                 │
│ ✅ 청동 배지 획득 (7일 연속)     │
│ ✅ 누적 100번 기도 달성          │
│ ✅ 5개 기도방에서 활동           │
│                                 │
└─────────────────────────────────┘
```

### 3.5 API 요구사항

#### 3.5.1 대시보드 데이터 조회

```
GET /v1/users/me/dashboard?period=month

Request Parameters:
- period: today | week | month | last30days | last3months | all

Response:
{
  "success": true,
  "data": {
    "period": "month",
    "summary": {
      "totalPrayerCount": 25,
      "averageDailyPrayers": 3.2,
      "currentStreak": 7,
      "longestStreak": 21
    },
    "weeklyTrend": [
      { "date": "2025-12-01", "count": 3 },
      { "date": "2025-12-02", "count": 4 },
      { "date": "2025-12-03", "count": 2 }
    ],
    "roomStats": [
      {
        "roomId": "room_1",
        "roomName": "가족 기도방",
        "prayerCount": 12,
        "percentage": 48
      }
    ],
    "timeDistribution": {
      "morning": 30,    // 6-12시
      "afternoon": 20,  // 12-18시
      "evening": 40,    // 18-22시
      "night": 10       // 22-6시
    },
    "recentActivities": [
      {
        "prayerId": "prayer_1",
        "prayerTitle": "건강을 위한 기도",
        "roomName": "가족 기도방",
        "prayedAt": "2025-12-06T10:30:00Z"
      }
    ]
  }
}
```

#### 3.5.2 월간 비교 데이터

```
GET /v1/users/me/dashboard/comparison?currentMonth=2025-12&previousMonth=2025-11

Response:
{
  "success": true,
  "data": {
    "current": {
      "month": "2025-12",
      "totalPrayers": 25,
      "activeDays": 15
    },
    "previous": {
      "month": "2025-11",
      "totalPrayers": 20,
      "activeDays": 12
    },
    "change": {
      "prayerCountChange": 5,
      "prayerCountChangePercent": 25,
      "activeDaysChange": 3,
      "activeDaysChangePercent": 25
    }
  }
}
```

### 3.6 데이터베이스 스키마

```sql
-- 사용자별 일일 통계 (집계 테이블)
CREATE TABLE user_daily_stats (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  date DATE NOT NULL,
  prayer_count INT NOT NULL DEFAULT 0,
  room_count INT NOT NULL DEFAULT 0,  -- 활동한 기도방 수
  morning_count INT NOT NULL DEFAULT 0,
  afternoon_count INT NOT NULL DEFAULT 0,
  evening_count INT NOT NULL DEFAULT 0,
  night_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY unique_user_date (user_id, date),
  INDEX idx_user_id (user_id),
  INDEX idx_date (date),

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 사용자별 월간 통계 (집계 테이블)
CREATE TABLE user_monthly_stats (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  year INT NOT NULL,
  month INT NOT NULL,
  total_prayer_count INT NOT NULL DEFAULT 0,
  active_days INT NOT NULL DEFAULT 0,
  average_daily_prayers DECIMAL(4, 2) NOT NULL DEFAULT 0,
  most_active_room_id VARCHAR(36),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY unique_user_month (user_id, year, month),
  INDEX idx_user_id (user_id),

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (most_active_room_id) REFERENCES rooms(id) ON DELETE SET NULL
);
```

### 3.7 비즈니스 규칙

1. **데이터 집계**:
   - 매일 자정에 전날 데이터 집계하여 `user_daily_stats` 저장
   - 매월 1일에 전월 데이터 집계하여 `user_monthly_stats` 저장
   - 실시간 데이터는 `prayer_logs` 테이블에서 조회

2. **통계 기간**:
   - 기본 기간: 이번 달
   - 최대 조회 기간: 1년
   - 전체 기간은 월간 통계 테이블에서 집계

3. **프라이버시**:
   - 개인 대시보드는 본인만 조회 가능
   - 다른 사용자의 통계는 공개하지 않음

4. **성능 최적화**:
   - 일일/월간 집계 테이블 활용
   - 캐싱 적용 (1시간 TTL)

### 3.8 예외 처리

1. **데이터 없음**:
   - 기도 기록이 없는 경우 빈 상태 화면 표시
   - 안내 메시지: "첫 기도를 시작해보세요!"

2. **집계 오류**:
   - 집계 실패 시 실시간 계산으로 대체
   - 다음 집계 주기에 재시도

3. **대용량 데이터**:
   - 페이지네이션 적용 (최근 활동)
   - 그래프는 최대 90일로 제한

### 3.9 개발 우선순위

- **Phase 1** (MVP):
  - 기본 통계 (총 횟수, 연속 기록)
  - 주간 트렌드 그래프
  - 기도방별 통계

- **Phase 2**:
  - 시간대별 분석
  - 월간 비교
  - 최근 활동 타임라인

- **Phase 3**:
  - 월간 리포트 생성
  - 목표 설정 및 달성률
  - 개인화된 인사이트 제공

---

## 4. 기도 제목 자동 만료

### 4.1 기능 개요

**목적**: 특정 날짜까지 기도할 제목을 설정하고, 기간이 지나면 자동으로 정리하여 기도 제목 관리를 용이하게 합니다.

**핵심 가치**: 관리 편의성, 정리정돈, 목표 지향

### 4.2 사용자 스토리

```
As a 기도 제목 작성자
I want to 기도 제목에 만료일을 설정하고 싶다
So that 특정 기간까지만 기도할 제목을 자동으로 관리할 수 있다

As a 기도 제목 작성자
I want to 만료된 기도 제목을 따로 보관하고 싶다
So that 나중에 기도 응답 여부를 확인할 수 있다
```

### 4.3 상세 요구사항

#### 4.3.1 만료일 설정

**설정 옵션**:
```
- 만료일 없음 (기본값)
- 오늘
- 내일
- 1주일 후
- 1개월 후
- 사용자 지정 날짜
```

**설정 위치**:
- 기도 제목 작성 시
- 기도 제목 수정 시

**입력 방식**:
- 캘린더 UI
- 날짜 선택 피커

#### 4.3.2 만료 처리

**만료 시점**:
- 설정한 날짜의 23:59:59에 만료
- 또는: 다음 날 00:00:00에 만료 (권장)

**만료 후 처리**:
```
Option A (아카이브):
- "완료된 기도" 섹션으로 자동 이동
- 조회는 가능하지만 수정 불가
- 기도 알림은 불가

Option B (숨김):
- 기본 목록에서 숨김
- "만료된 기도" 필터로 조회 가능
- 복원 가능

Option C (삭제):
- 자동 삭제 (권장하지 않음)
```

**권장**: Option A (아카이브 방식)

#### 4.3.3 만료 알림

**알림 시점**:
- 만료 1일 전
- 만료 당일 아침 (08:00)
- 만료 직후

**알림 내용**:
```
1일 전: "내일 만료되는 기도 제목이 있어요: '시험 합격을 위한 기도'"
당일: "오늘 만료되는 기도 제목이 있어요: '시험 합격을 위한 기도'"
만료 후: "'시험 합격을 위한 기도'가 만료되었어요. 응답받으셨나요?"
```

**알림 수신자**:
- 기도 제목 작성자만

#### 4.3.4 만료일 표시

**기도 목록 화면**:
```
┌─────────────────────────────────┐
│ 시험 합격을 위한 기도            │
│ 작성자: 철수 · D-3 ⏰           │
└─────────────────────────────────┘
```

**기도 상세 화면**:
```
시험 합격을 위한 기도
작성자: 철수 · 2025-12-01

⏰ 만료일: 2025-12-10 (D-3)
```

**만료 임박 표시**:
- D-7 이상: 일반 표시
- D-3 ~ D-6: 노란색 표시 🟡
- D-0 ~ D-2: 빨간색 표시 🔴
- 만료됨: 회색 표시 ⚪

#### 4.3.5 기도 응답 기록

**만료 시 선택**:
```
┌─────────────────────────────────┐
│ 기도 제목이 만료되었어요         │
├─────────────────────────────────┤
│                                 │
│ '시험 합격을 위한 기도'         │
│                                 │
│ 기도 응답을 받으셨나요?         │
│                                 │
│    [응답받음 ✅]                │
│    [아직 기다리는 중]            │
│    [나중에 답변]                │
│                                 │
└─────────────────────────────────┘
```

**응답 기록 시**:
- 응답받음: "응답받음" 배지 표시
- 아직 기다리는 중: 만료일 연장 옵션 제공
- 나중에 답변: 나중에 다시 물어봄

#### 4.3.6 완료된 기도 보기

**위치**: 기도방 상세 화면

**필터**:
```
[진행중] [완료됨] [전체]
```

**완료된 기도 목록**:
```
┌─────────────────────────────────┐
│       완료된 기도 제목           │
├─────────────────────────────────┤
│                                 │
│ ✅ 시험 합격을 위한 기도         │
│    응답받음 · 12/10 완료         │
│                                 │
│ ⏰ 건강을 위한 기도              │
│    기다리는 중 · 12/05 완료      │
│                                 │
│ 📌 새 직장을 위한 기도           │
│    만료됨 · 11/30 완료           │
│                                 │
└─────────────────────────────────┘
```

### 4.4 UI/UX 설계

#### 4.4.1 기도 제목 작성 시 만료일 설정

```
┌─────────────────────────────────┐
│    기도 제목 작성하기            │
├─────────────────────────────────┤
│                                 │
│ 제목                            │
│ ┌─────────────────────────────┐ │
│ │ 시험 합격을 위한 기도        │ │
│ └─────────────────────────────┘ │
│                                 │
│ ⏰ 만료일 설정 (선택)            │
│ ┌─────────────────────────────┐ │
│ │ 만료일 없음        [변경] ▼ │ │
│ └─────────────────────────────┘ │
│                                 │
│ [변경] 클릭 시:                 │
│ ┌─────────────────────────────┐ │
│ │ ○ 만료일 없음                │ │
│ │ ○ 오늘                       │ │
│ │ ○ 내일                       │ │
│ │ ○ 1주일 후                   │ │
│ │ ○ 1개월 후                   │ │
│ │ ○ 사용자 지정 📅            │ │
│ └─────────────────────────────┘ │
│                                 │
│ 기도할 멤버 선택                │
│ ...                             │
│                                 │
│         [취소]  [저장]          │
└─────────────────────────────────┘
```

#### 4.4.2 만료일 선택 캘린더

```
┌─────────────────────────────────┐
│      만료일 선택                 │
├─────────────────────────────────┤
│                                 │
│      2025년 12월                │
│   < ─────────────────── >       │
│                                 │
│  일  월  화  수  목  금  토      │
│   1   2   3   4   5   6   7     │
│   8   9  10  11  12  13  14     │
│  15  16  17  18  19  20  21     │
│  22  23  24  25  26  27  28     │
│  29  30  31                     │
│                                 │
│ 선택된 날짜: 2025-12-10          │
│ (오늘로부터 3일 후)              │
│                                 │
│         [취소]  [확인]          │
└─────────────────────────────────┘
```

#### 4.4.3 만료 임박 알림

```
┌─────────────────────────────────┐
│         🔔 알림                 │
├─────────────────────────────────┤
│                                 │
│ ⏰ 내일 만료되는 기도 제목        │
│                                 │
│ '시험 합격을 위한 기도'가        │
│ 내일(12/10) 만료됩니다.          │
│                                 │
│ 만료일을 연장하시겠어요?         │
│                                 │
│    [아니요]    [연장하기]        │
│                                 │
└─────────────────────────────────┘
```

#### 4.4.4 만료 후 응답 기록

```
┌─────────────────────────────────┐
│    🙏 기도 응답 기록             │
├─────────────────────────────────┤
│                                 │
│ '시험 합격을 위한 기도'가        │
│ 만료되었습니다.                  │
│                                 │
│ 기도 응답을 받으셨나요?         │
│                                 │
│ ┌─────────────────────────────┐ │
│ │   ✅ 응답받음                │ │
│ │   감사와 간증을 남겨주세요   │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │   ⏰ 아직 기다리는 중         │ │
│ │   만료일을 연장할 수 있어요  │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │   📝 나중에 답변             │ │
│ │   다음에 다시 물어볼게요     │ │
│ └─────────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

#### 4.4.5 완료된 기도 목록

```
┌─────────────────────────────────┐
│         가족 기도방              │
├─────────────────────────────────┤
│                                 │
│ [진행중] [완료됨] [전체]         │
│           ▔▔▔▔▔                 │
│                                 │
│ ✅ 시험 합격을 위한 기도         │
│    응답받음 · 12/10 완료         │
│    ───────────────────────      │
│    "합격했습니다! 감사해요 🙏"   │
│                                 │
│ ⏰ 건강을 위한 기도              │
│    기다리는 중 · 12/05 완료      │
│                                 │
│ 📌 새 직장을 위한 기도           │
│    답변 없음 · 11/30 완료        │
│                                 │
└─────────────────────────────────┘
```

### 4.5 API 요구사항

#### 4.5.1 만료일 설정/수정

```
PATCH /v1/prayers/{prayerId}/expiration

Request Body:
{
  "expiresAt": "2025-12-10T23:59:59Z"  // null이면 만료일 제거
}

Response:
{
  "success": true,
  "data": {
    "prayerId": "prayer_123",
    "expiresAt": "2025-12-10T23:59:59Z",
    "daysRemaining": 3
  }
}
```

#### 4.5.2 만료 처리

```
POST /v1/prayers/{prayerId}/expire

Request Body:
{
  "answerStatus": "ANSWERED" | "WAITING" | "NO_ANSWER",
  "testimony": "합격했습니다! 감사해요"  // answerStatus가 ANSWERED일 때만
}

Response:
{
  "success": true,
  "data": {
    "prayerId": "prayer_123",
    "status": "EXPIRED",
    "answerStatus": "ANSWERED",
    "expiredAt": "2025-12-10T23:59:59Z"
  }
}
```

#### 4.5.3 만료된 기도 목록 조회

```
GET /v1/rooms/{roomId}/prayers?status=expired&limit=20&offset=0

Request Parameters:
- status: active | expired | all
- limit: 페이지 크기 (기본 20)
- offset: 오프셋 (기본 0)

Response:
{
  "success": true,
  "data": {
    "total": 15,
    "prayers": [
      {
        "prayerId": "prayer_123",
        "title": "시험 합격을 위한 기도",
        "authorName": "철수",
        "expiresAt": "2025-12-10T23:59:59Z",
        "expiredAt": "2025-12-10T23:59:59Z",
        "status": "EXPIRED",
        "answerStatus": "ANSWERED",
        "testimony": "합격했습니다!"
      }
    ]
  }
}
```

#### 4.5.4 만료 임박 기도 조회

```
GET /v1/users/me/prayers/expiring-soon?days=3

Request Parameters:
- days: 며칠 이내 만료 (기본 3일)

Response:
{
  "success": true,
  "data": {
    "prayers": [
      {
        "prayerId": "prayer_123",
        "title": "시험 합격을 위한 기도",
        "expiresAt": "2025-12-10T23:59:59Z",
        "daysRemaining": 2,
        "roomName": "가족 기도방"
      }
    ]
  }
}
```

### 4.6 데이터베이스 스키마

```sql
-- prayers 테이블에 컬럼 추가
ALTER TABLE prayers ADD COLUMN expires_at TIMESTAMP NULL;
ALTER TABLE prayers ADD COLUMN status ENUM('ACTIVE', 'EXPIRED') NOT NULL DEFAULT 'ACTIVE';
ALTER TABLE prayers ADD COLUMN answer_status ENUM('ANSWERED', 'WAITING', 'NO_ANSWER') NULL;
ALTER TABLE prayers ADD COLUMN testimony TEXT NULL;
ALTER TABLE prayers ADD COLUMN expired_at TIMESTAMP NULL;

-- 인덱스 추가
CREATE INDEX idx_expires_at ON prayers(expires_at);
CREATE INDEX idx_status ON prayers(status);

-- 만료 알림 기록 테이블
CREATE TABLE prayer_expiration_notifications (
  id VARCHAR(36) PRIMARY KEY,
  prayer_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  notification_type ENUM('ONE_DAY_BEFORE', 'EXPIRATION_DAY', 'EXPIRED') NOT NULL,
  sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_prayer_id (prayer_id),
  INDEX idx_user_id (user_id),

  FOREIGN KEY (prayer_id) REFERENCES prayers(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 4.7 비즈니스 규칙

1. **만료일 설정**:
   - 작성자만 만료일 설정/수정 가능
   - 과거 날짜는 설정 불가
   - 만료일은 언제든 변경/제거 가능

2. **만료 처리**:
   - 매일 자정(00:00)에 배치 작업으로 만료 처리
   - 만료된 기도는 `status = 'EXPIRED'`로 변경
   - 만료된 기도는 기본 목록에서 숨김

3. **만료 알림**:
   - 만료 1일 전, 당일, 만료 후 총 3번 알림
   - 각 알림은 한 번만 발송 (중복 방지)
   - 알림 수신 여부는 기도방 알림 설정 따름

4. **기도 응답 기록**:
   - 만료 후 7일 이내에 응답 기록 가능
   - 응답 기록은 선택 사항 (강제 아님)
   - 응답 기록 후에도 수정 가능

5. **완료된 기도 조회**:
   - 기도방 멤버만 조회 가능
   - 삭제되지 않고 아카이브로 보관
   - 만료 후 1년 이상 지나면 자동 삭제 (선택)

### 4.8 예외 처리

1. **만료일 연장**:
   - 만료 후에도 연장 가능
   - 연장 시 `status = 'ACTIVE'`로 복원

2. **기도방 나가기**:
   - 기도방을 나가도 내가 작성한 기도 제목의 만료 알림은 받음

3. **네트워크 오류**:
   - 만료 처리 실패 시 다음 배치 작업에서 재시도
   - 알림 발송 실패 시 재시도 (최대 3번)

4. **사용자 삭제**:
   - 사용자 탈퇴 시 작성한 기도 제목도 삭제
   - 또는: 작성자 이름을 "알 수 없음"으로 변경하고 보관

### 4.9 개발 우선순위

- **Phase 1** (MVP):
  - 만료일 설정 UI
  - 만료 처리 배치 작업
  - 만료된 기도 필터

- **Phase 2**:
  - 만료 알림
  - 만료일 연장 기능
  - D-Day 표시

- **Phase 3**:
  - 기도 응답 기록
  - 간증 작성 및 공유
  - 완료된 기도 통계

---

## 5. 개발 일정 제안

### 5.1 전체 일정 (예상)

```
Phase 1 (4주):
- Week 1-2: 함께 기도한 사람 표시
- Week 3-4: 기도 제목 자동 만료

Phase 2 (6주):
- Week 5-7: 기도 연속 기록
- Week 8-10: 개인 기도 대시보드

Phase 3 (4주):
- Week 11-12: 통합 테스트 및 버그 수정
- Week 13-14: 배포 및 모니터링
```

### 5.2 우선순위

**높음**:
1. 함께 기도한 사람 표시 (Phase 1)
2. 기도 제목 자동 만료 (Phase 1)

**중간**:
3. 기도 연속 기록 (Phase 1-2)

**낮음**:
4. 개인 기도 대시보드 (Phase 2-3)

### 5.3 의존성

```
함께 기도한 사람 표시
  └─> 기도 연속 기록 (기도 로그 활용)
      └─> 개인 기도 대시보드 (연속 기록 표시)

기도 제목 자동 만료
  └─> 독립적 (다른 기능과 의존성 없음)
```

---

## 6. 기술 스택 및 고려사항

### 6.1 프론트엔드

- **UI 라이브러리**: React Native 기존 컴포넌트 활용
- **차트**: `react-native-chart-kit` 또는 `victory-native` (대시보드용)
- **캘린더**: `react-native-calendars` (만료일 선택용)
- **날짜 처리**: `date-fns` (이미 사용 중인지 확인)

### 6.2 백엔드

- **배치 작업**: Cron 또는 Node.js 스케줄러
  - 만료 처리: 매일 00:00
  - 통계 집계: 매일 00:30
  - 알림 발송: 매일 08:00

- **캐싱**: Redis (대시보드 데이터 캐싱)

### 6.3 알림

- **푸시 알림**: Firebase Cloud Messaging (FCM)
  - 만료 알림
  - 배지 획득 알림 (선택)

### 6.4 성능 최적화

- **데이터 집계**: 일일/월간 통계 테이블 활용
- **페이지네이션**: 목록 조회 시 필수
- **캐싱**: 대시보드 데이터 1시간 캐시
- **인덱스**: 날짜, 사용자ID 등 자주 조회하는 컬럼에 인덱스 추가

---

## 7. 테스트 계획

### 7.1 단위 테스트

- 연속 기록 계산 로직
- 만료일 처리 로직
- 통계 집계 로직

### 7.2 통합 테스트

- API 엔드포인트
- 배치 작업
- 알림 발송

### 7.3 E2E 테스트

- 기도 작성 → 기도 완료 → 기록 확인
- 만료일 설정 → 만료 처리 → 응답 기록
- 대시보드 조회

---

## 5. 재참여 유도 알림

### 5.1 기능 개요

**목적**: 일정 기간 동안 앱에 접속하지 않거나 기도하지 않은 사용자에게 알림을 보내어 다시 기도 생활에 참여하도록 유도합니다.

**핵심 가치**: 지속적인 참여, 습관 형성, 공동체 유지

### 5.2 사용자 스토리

```
As a 사용자
I want to 한동안 기도하지 않았을 때 알림을 받고 싶다
So that 기도 습관을 잃지 않고 지속할 수 있다

As a 기도방 운영자
I want to 비활성 멤버들이 다시 참여하도록 유도하고 싶다
So that 기도방이 활성화되고 공동체가 유지될 수 있다
```

### 5.3 상세 요구사항

#### 5.3.1 재참여 조건

**트리거 조건**:
```
조건 A: 마지막 접속 후 2주 경과
조건 B: 마지막 기도 완료 후 2주 경과

→ 둘 중 하나라도 만족 시 알림 발송
```

**제외 조건**:
- 앱을 삭제한 사용자 (FCM 토큰 무효화)
- 알림을 끈 사용자
- 이미 재참여 알림을 받은 후 7일 이내인 사용자 (중복 방지)

#### 5.3.2 알림 내용

**메시지 종류**:

```
Option A (단순):
제목: "기도 시간이에요 🙏"
내용: "오랜만이에요! 함께 기도해요"

Option B (통계 포함):
제목: "기도 시간이에요 🙏"
내용: "2주간 기도방에서 15개의 새 기도 제목이 올라왔어요"

Option C (개인화):
제목: "기도 시간이에요 🙏"
내용: "철수님, 가족 기도방에서 기다리고 있어요"

Option D (연속 기록):
제목: "7일 연속 기록이 끊어질 뻔했어요 😢"
내용: "다시 시작해볼까요?"
```

**권장**: Option B (통계 포함) - 구체적인 정보로 참여 동기 부여

#### 5.3.3 알림 발송 시점

**발송 시각**:
- 매일 오전 8시 (사용자 로컬 시간대 기준)
- 또는: 사용자가 가장 활발했던 시간대 (개인화)

**발송 주기**:
```
1차: 마지막 활동 후 14일
2차: 1차 알림 후 7일 (여전히 비활성 시)
3차: 2차 알림 후 7일 (여전히 비활성 시)
→ 이후 발송 중단 (스팸 방지)
```

#### 5.3.4 사용자 활동 추적

**추적 데이터**:
```typescript
interface UserActivity {
  userId: string;
  lastLoginAt: Date;           // 마지막 접속 시각
  lastPrayerAt: Date;          // 마지막 기도 완료 시각
  lastNotificationSentAt: Date; // 마지막 재참여 알림 발송 시각
  notificationCount: number;   // 재참여 알림 발송 횟수 (최대 3회)
  isActive: boolean;           // 활성 상태
}
```

**활동 업데이트**:
- 앱 접속 시 `lastLoginAt` 업데이트
- 기도 완료 시 `lastPrayerAt` 업데이트
- 알림 발송 시 `lastNotificationSentAt`, `notificationCount` 업데이트

#### 5.3.5 알림 클릭 시 동작

**딥링크 설정**:
```
pray-together://reengagement

→ 앱 실행 후 기도방 목록 화면으로 이동
→ (선택) 웰컴백 메시지 표시
```

**웰컴백 메시지**:
```
┌─────────────────────────────────┐
│                                 │
│         🙏                      │
│    다시 오신 것을 환영해요!      │
│                                 │
│  2주간 기도방에서 일어난 일:     │
│  • 15개의 새 기도 제목           │
│  • 38번의 기도 완료              │
│  • 3명의 새 멤버                 │
│                                 │
│         [시작하기]               │
│                                 │
└─────────────────────────────────┘
```

### 5.4 UI/UX 설계

#### 5.4.1 푸시 알림

```
┌─────────────────────────────────┐
│ 🙏 기도함께                     │
├─────────────────────────────────┤
│ 기도 시간이에요 🙏               │
│                                 │
│ 2주간 기도방에서 15개의 새      │
│ 기도 제목이 올라왔어요           │
│                                 │
│ 5분 전                          │
└─────────────────────────────────┘
```

#### 5.4.2 웰컴백 화면 (선택사항)

```
┌─────────────────────────────────┐
│                                 │
│         🙏                      │
│    다시 오신 것을 환영해요!      │
│                                 │
├─────────────────────────────────┤
│                                 │
│ 📊 지난 2주간 활동               │
│                                 │
│ 가족 기도방                      │
│ • 8개의 새 기도 제목             │
│ • 철수님, 영희님이 기도했어요    │
│                                 │
│ 친구 기도방                      │
│ • 5개의 새 기도 제목             │
│ • 민수님이 새로 참여했어요       │
│                                 │
│ 교회 기도방                      │
│ • 2개의 새 기도 제목             │
│                                 │
├─────────────────────────────────┤
│                                 │
│ 🔥 연속 기도 기록이              │
│    초기화되었어요                │
│                                 │
│    다시 시작해볼까요?            │
│                                 │
│         [기도하러 가기]          │
│                                 │
└─────────────────────────────────┘
```

#### 5.4.3 알림 설정

**마이페이지 > 알림 설정**:
```
┌─────────────────────────────────┐
│       알림 설정                  │
├─────────────────────────────────┤
│                                 │
│ 기도 알림              [ON ]    │
│ 새 기도 제목           [ON ]    │
│                                 │
│ 재참여 알림            [ON ]    │
│ 한동안 기도하지 않을 때          │
│ 알림을 받습니다                  │
│                                 │
│ 기도방 활동 알림       [ON ]    │
│ ...                             │
│                                 │
└─────────────────────────────────┘
```

### 5.5 API 요구사항

#### 5.5.1 사용자 활동 업데이트

```
POST /v1/users/me/activity

Request Body:
{
  "activityType": "LOGIN" | "PRAYER_COMPLETE"
}

Response:
{
  "success": true,
  "data": {
    "userId": "user_123",
    "lastLoginAt": "2025-12-14T08:00:00Z",
    "lastPrayerAt": "2025-12-14T08:05:00Z"
  }
}
```

#### 5.5.2 재참여 대상 사용자 조회 (배치 작업용)

```
GET /v1/admin/users/inactive?days=14

Request Parameters:
- days: 비활성 기준 일수 (기본 14일)

Response:
{
  "success": true,
  "data": {
    "total": 50,
    "users": [
      {
        "userId": "user_123",
        "fcmToken": "fcm_token_xxx",
        "lastLoginAt": "2025-11-30T10:00:00Z",
        "lastPrayerAt": "2025-11-30T10:05:00Z",
        "lastNotificationSentAt": null,
        "notificationCount": 0,
        "preferredLanguage": "ko",
        "timezone": "Asia/Seoul"
      }
    ]
  }
}
```

#### 5.5.3 재참여 알림 발송 기록

```
POST /v1/users/{userId}/reengagement-notifications

Request Body:
{
  "sentAt": "2025-12-14T08:00:00Z",
  "messageType": "FIRST_REMINDER" | "SECOND_REMINDER" | "THIRD_REMINDER"
}

Response:
{
  "success": true,
  "data": {
    "notificationId": "notif_123",
    "userId": "user_123",
    "sentAt": "2025-12-14T08:00:00Z",
    "notificationCount": 1
  }
}
```

#### 5.5.4 웰컴백 통계 조회

```
GET /v1/users/me/welcome-back-stats?since=2025-11-30

Request Parameters:
- since: 통계 시작 날짜

Response:
{
  "success": true,
  "data": {
    "period": {
      "from": "2025-11-30T00:00:00Z",
      "to": "2025-12-14T00:00:00Z",
      "days": 14
    },
    "rooms": [
      {
        "roomId": "room_1",
        "roomName": "가족 기도방",
        "newPrayersCount": 8,
        "totalPrayersCount": 38,
        "newMembersCount": 0,
        "activeMembersNames": ["철수", "영희"]
      }
    ],
    "totalNewPrayers": 15,
    "totalNewMembers": 1
  }
}
```

### 5.6 데이터베이스 스키마

```sql
-- users 테이블에 컬럼 추가
ALTER TABLE users ADD COLUMN last_login_at TIMESTAMP NULL;
ALTER TABLE users ADD COLUMN last_prayer_at TIMESTAMP NULL;

-- 인덱스 추가
CREATE INDEX idx_last_login_at ON users(last_login_at);
CREATE INDEX idx_last_prayer_at ON users(last_prayer_at);

-- 재참여 알림 발송 기록 테이블
CREATE TABLE reengagement_notifications (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  message_type ENUM('FIRST_REMINDER', 'SECOND_REMINDER', 'THIRD_REMINDER') NOT NULL,
  sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  clicked_at TIMESTAMP NULL,

  INDEX idx_user_id (user_id),
  INDEX idx_sent_at (sent_at),

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- FCM 토큰 테이블 (기존에 없다면)
CREATE TABLE fcm_tokens (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  token VARCHAR(255) NOT NULL,
  device_type ENUM('IOS', 'ANDROID') NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,

  UNIQUE KEY unique_token (token),
  INDEX idx_user_id (user_id),
  INDEX idx_is_active (is_active),

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 5.7 비즈니스 규칙

1. **활동 추적**:
   - 앱 실행 시 `last_login_at` 자동 업데이트
   - 기도 완료 버튼 클릭 시 `last_prayer_at` 자동 업데이트
   - 두 시각 중 더 최근 것을 기준으로 비활성 판단

2. **알림 발송 조건**:
   - 마지막 활동 후 정확히 14일째 되는 날 발송
   - 이미 3회 발송했다면 더 이상 발송 안 함
   - 마지막 알림 발송 후 7일 이내면 발송 안 함
   - FCM 토큰이 유효한 사용자만 발송

3. **알림 설정 존중**:
   - 사용자가 재참여 알림을 꺼놨다면 발송 안 함
   - 전체 알림을 꺼놨다면 발송 안 함
   - 방해 금지 시간대에는 발송 안 함

4. **FCM 토큰 관리**:
   - NotRegistered 에러 발생 시 토큰 비활성화
   - InvalidRegistration 에러 발생 시 토큰 삭제
   - 사용자 재로그인 시 토큰 갱신

5. **재활성화 처리**:
   - 알림 클릭 후 앱 접속 시 `notificationCount` 초기화
   - 스스로 돌아온 경우도 `notificationCount` 초기화

### 5.8 배치 작업

#### 5.8.1 재참여 알림 발송 스케줄러

```javascript
// 매일 오전 8시 실행 (Cron: 0 8 * * *)
async function sendReengagementNotifications() {
  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // 비활성 사용자 조회
  const inactiveUsers = await db.query(`
    SELECT u.id, u.last_login_at, u.last_prayer_at, f.token as fcm_token
    FROM users u
    INNER JOIN fcm_tokens f ON u.id = f.user_id AND f.is_active = TRUE
    LEFT JOIN reengagement_notifications rn ON u.id = rn.user_id
    WHERE (u.last_login_at < ? OR u.last_prayer_at < ?)
      AND (rn.sent_at IS NULL OR rn.sent_at < ?)
      AND (
        SELECT COUNT(*)
        FROM reengagement_notifications
        WHERE user_id = u.id
      ) < 3
  `, [fourteenDaysAgo, fourteenDaysAgo, sevenDaysAgo]);

  // 사용자별로 통계 조회 및 푸시 발송
  for (const user of inactiveUsers) {
    try {
      // 웰컴백 통계 조회
      const stats = await getWelcomeBackStats(user.id);

      // FCM 푸시 발송
      await admin.messaging().send({
        token: user.fcm_token,
        notification: {
          title: "기도 시간이에요 🙏",
          body: `2주간 기도방에서 ${stats.totalNewPrayers}개의 새 기도 제목이 올라왔어요`
        },
        data: {
          type: "REENGAGEMENT",
          deeplink: "pray-together://reengagement"
        }
      });

      // 알림 발송 기록
      await recordNotification(user.id);

    } catch (error) {
      if (error.code === 'messaging/registration-token-not-registered') {
        // FCM 토큰 비활성화
        await deactivateFcmToken(user.fcm_token);
      }
      console.error(`Failed to send notification to user ${user.id}:`, error);
    }
  }
}
```

#### 5.8.2 활동 업데이트 트리거

```javascript
// 앱 실행 시 (App.tsx)
useEffect(() => {
  updateUserActivity('LOGIN');
}, []);

// 기도 완료 시
const handlePrayerComplete = async () => {
  await updateUserActivity('PRAYER_COMPLETE');
  // ... 기존 로직
};
```

### 5.9 예외 처리

1. **FCM 토큰 관련**:
   - 토큰이 없는 사용자: 알림 발송 건너뜀
   - 토큰 무효화: 자동으로 비활성화 후 다음 로그인 시 재등록
   - 여러 기기: 모든 활성 토큰에 발송

2. **시간대 처리**:
   - 사용자의 로컬 시간대 기준으로 오전 8시 계산
   - 시간대 정보 없으면 서버 시간대 사용

3. **통계 조회 실패**:
   - 통계 조회 실패 시 기본 메시지로 발송
   - "오랜만이에요! 함께 기도해요"

4. **네트워크 오류**:
   - 발송 실패 시 재시도 (최대 3번)
   - 계속 실패 시 로그 기록 후 건너뜀

5. **사용자 탈퇴**:
   - 탈퇴한 사용자는 자동으로 제외
   - FCM 토큰도 함께 삭제

### 5.10 분석 및 모니터링

#### 5.10.1 추적 지표

```
- 알림 발송 수 (일별)
- 알림 클릭율
- 재활성화율 (알림 후 7일 내 활동)
- 발송 실패 수 (토큰 무효화 등)
```

#### 5.10.2 대시보드 (어드민용)

```
┌─────────────────────────────────┐
│   재참여 알림 현황               │
├─────────────────────────────────┤
│                                 │
│ 📊 이번 주 통계                 │
│                                 │
│ 발송 수: 150건                  │
│ 클릭율: 35% (53건)               │
│ 재활성화율: 28% (42건)           │
│ 실패율: 5% (8건)                │
│                                 │
├─────────────────────────────────┤
│                                 │
│ 📈 주간 트렌드                  │
│ [그래프]                        │
│                                 │
└─────────────────────────────────┘
```

### 5.11 개발 우선순위

- **Phase 1** (MVP):
  - 사용자 활동 추적 (`last_login_at`, `last_prayer_at`)
  - 재참여 알림 배치 작업
  - 기본 푸시 알림 발송

- **Phase 2**:
  - 웰컴백 통계 API
  - 개인화된 메시지
  - 알림 클릭 딥링크

- **Phase 3**:
  - 웰컴백 화면 UI
  - 분석 및 모니터링 대시보드
  - A/B 테스트 (메시지 최적화)

### 5.12 A/B 테스트 제안

**테스트 항목**:
1. 메시지 톤앤매너 (친근함 vs 격식)
2. 통계 포함 여부
3. 발송 시각 (아침 vs 저녁)
4. 발송 주기 (2주 vs 1주)

**측정 지표**:
- 클릭율 (CTR)
- 재활성화율
- 7일 리텐션

---

## 6. 개발 일정 제안 (업데이트)

### 6.1 전체 일정 (예상)

```
Phase 1 (5주):
- Week 1-2: 함께 기도한 사람 표시
- Week 3-4: 기도 제목 자동 만료
- Week 5: 재참여 유도 알림 (MVP)

Phase 2 (6주):
- Week 6-8: 기도 연속 기록
- Week 9-11: 개인 기도 대시보드

Phase 3 (4주):
- Week 12-13: 통합 테스트 및 버그 수정
- Week 14-15: 배포 및 모니터링
```

### 6.2 우선순위 (업데이트)

**높음**:
1. 함께 기도한 사람 표시 (Phase 1)
2. 기도 제목 자동 만료 (Phase 1)
3. 재참여 유도 알림 (Phase 1) ⭐ NEW

**중간**:
4. 기도 연속 기록 (Phase 1-2)

**낮음**:
5. 개인 기도 대시보드 (Phase 2-3)

### 6.3 의존성 (업데이트)

```
함께 기도한 사람 표시
  └─> 기도 연속 기록 (기도 로그 활용)
      └─> 개인 기도 대시보드 (연속 기록 표시)

기도 제목 자동 만료
  └─> 독립적

재참여 유도 알림
  └─> 기도 로그 활용 (last_prayer_at)
  └─> FCM 토큰 관리 (기존)
```

---

## 7. 기술 스택 및 고려사항 (업데이트)

### 7.1 프론트엔드

- **UI 라이브러리**: React Native 기존 컴포넌트 활용
- **차트**: `react-native-chart-kit` 또는 `victory-native` (대시보드용)
- **캘린더**: `react-native-calendars` (만료일 선택용)
- **날짜 처리**: `date-fns` (이미 사용 중)
- **딥링크**: `expo-linking` (재참여 알림용) ⭐ NEW

### 7.2 백엔드

- **배치 작업**: Cron 또는 Node.js 스케줄러
  - 만료 처리: 매일 00:00
  - 통계 집계: 매일 00:30
  - 재참여 알림: 매일 08:00 ⭐ NEW

- **캐싱**: Redis (대시보드 데이터 캐싱)

### 7.3 알림

- **푸시 알림**: Firebase Cloud Messaging (FCM)
  - 만료 알림
  - 재참여 알림 ⭐ NEW
  - 배지 획득 알림 (선택)

- **딥링크**: Custom URL Scheme ⭐ NEW
  - `pray-together://reengagement`
  - `pray-together://room/{roomId}`

### 7.4 성능 최적화

- **데이터 집계**: 일일/월간 통계 테이블 활용
- **페이지네이션**: 목록 조회 시 필수
- **캐싱**: 대시보드 데이터 1시간 캐시
- **인덱스**: 날짜, 사용자ID 등 자주 조회하는 컬럼에 인덱스 추가
- **배치 크기**: 재참여 알림 발송 시 100명씩 처리 ⭐ NEW

---

## 8. 테스트 계획 (업데이트)

### 8.1 단위 테스트

- 연속 기록 계산 로직
- 만료일 처리 로직
- 통계 집계 로직
- 재참여 조건 판단 로직 ⭐ NEW
- FCM 토큰 무효화 처리 ⭐ NEW

### 8.2 통합 테스트

- API 엔드포인트
- 배치 작업
- 알림 발송
- 딥링크 동작 ⭐ NEW

### 8.3 E2E 테스트

- 기도 작성 → 기도 완료 → 기록 확인
- 만료일 설정 → 만료 처리 → 응답 기록
- 대시보드 조회
- 14일 비활성 → 알림 수신 → 앱 재접속 ⭐ NEW

---

## 9. 변경 이력

| 버전 | 날짜       | 작성자 | 변경 내용 |
| ---- | ---------- | ------ | --------- |
| 1.0  | 2025-12-06 | AI     | 초안 작성 |
| 1.1  | 2025-12-14 | AI     | 재참여 유도 알림 기능 추가 |

---

**문서 끝**
