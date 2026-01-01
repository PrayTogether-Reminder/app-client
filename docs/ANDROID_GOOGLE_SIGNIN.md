# Android Google Sign-In 설정 가이드

## SHA-1이란?

**앱 서명 키(Keystore)의 고유 지문**입니다.

Android 앱은 설치되려면 반드시 **서명(sign)**되어야 합니다.
이 서명에 사용되는 키가 **Keystore**이고, Keystore의 고유 식별자가 **SHA-1**입니다.

```
Keystore (서명 키) → SHA-1 (지문)
```

---

## 왜 SHA-1이 필요한가?

Google은 앱의 신원을 확인하기 위해 **패키지명 + SHA-1** 조합을 사용합니다.

```
1. 앱에서 Google 로그인 요청
2. Google: "이 앱이 등록된 앱인지 확인"
3. 앱의 SHA-1 + 패키지명을 Firebase에 등록된 정보와 비교
4. 일치하면 → 로그인 허용
   불일치하면 → DEVELOPER_ERROR (에러 코드 10)
```

---

## 빌드 방식에 따른 SHA-1 차이

| 빌드 명령어 | 사용하는 Keystore | SHA-1 |
|-------------|-------------------|-------|
| `npx expo run:android` | debug.keystore (내 컴퓨터) | Debug SHA-1 |
| `eas build --local` | EAS keystore (클라우드에서 다운로드) | EAS SHA-1 |
| `eas build` | EAS keystore (클라우드) | EAS SHA-1 |

### 핵심 포인트

- **다른 Keystore = 다른 SHA-1**
- **같은 Keystore = 같은 SHA-1**
- `eas build --local`과 `eas build`는 **같은 Keystore, 같은 SHA-1**
  - 로컬/클라우드는 빌드를 어디서 하느냐의 차이일 뿐, 서명에 사용하는 Keystore는 동일
- `npx expo run:android`는 **다른 Keystore, 다른 SHA-1** (debug.keystore 사용)

---

## 패키지명과 SHA-1의 관계

SHA-1은 **Keystore에 의해 결정**됩니다. 패키지명과는 무관합니다.

```
같은 Keystore로 서명하면:
  - site.praytogether        → 같은 SHA-1
  - site.praytogether.dev    → 같은 SHA-1
  - site.praytogether.preview → 같은 SHA-1
```

단, Firebase에는 **각 패키지명별로 SHA-1을 등록**해야 합니다.

---

## SHA-1 확인 방법

### 1. Debug Keystore (로컬 개발용)

```bash
cd android && ./gradlew signingReport
```

출력 예시:
```
Variant: debug
SHA1: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
```

### 2. EAS Keystore

```bash
eas credentials -p android
```

프로필 선택 후 SHA-1 확인 가능

---

## Firebase Console 설정

### 등록해야 할 SHA-1 목록

| 용도 | SHA-1 | 필요한 경우 |
|------|-------|-------------|
| Debug | `5E:8F:16:...` | `npx expo run:android` 사용 시 |
| EAS | `78:01:A2:...` | `eas build` 사용 시 |

### 등록 방법

1. [Firebase Console](https://console.firebase.google.com) 접속
2. 프로젝트 선택 → 프로젝트 설정 (톱니바퀴)
3. 내 앱 → Android 앱 선택
4. **SHA 인증서 지문** 섹션에서 "지문 추가"
5. SHA-1 값 입력
6. **google-services.json 다시 다운로드**
7. 프로젝트에 복사 후 **앱 재빌드**

---

## DEVELOPER_ERROR 해결 체크리스트

에러가 발생하면 아래 순서로 확인:

### 1. 현재 설치된 앱 확인
```bash
adb shell pm list packages | grep praytogether
```

### 2. 앱의 빌드 타입 확인
- 로컬 빌드? → Debug SHA-1 필요
- EAS 빌드? → EAS SHA-1 필요

### 3. Firebase 등록 확인
해당 패키지명에 올바른 SHA-1이 등록되어 있는지 확인

### 4. google-services.json 확인
```bash
cat google-services.json | grep certificate_hash
```
등록한 SHA-1이 포함되어 있어야 함

### 5. 앱 재빌드
google-services.json 변경 후 반드시 재빌드 필요

---

## 현재 프로젝트 설정

### 패키지명 (app.config.js)
```javascript
production:   'site.praytogether'
development:  'site.praytogether.dev'
preview:      'site.praytogether.preview'
```

### google-services.json 등록 현황

| 패키지명 | Debug SHA-1 | EAS SHA-1 |
|----------|-------------|-----------|
| site.praytogether | 5e8f16... | 추가 필요 |
| site.praytogether.dev | 추가 필요 | 추가 필요 |
| site.praytogether.preview | - | 7801a27d... |

---

## 자주 묻는 질문

### Q: `eas build --local`과 `eas build`의 SHA-1이 같은가요?
**A: 네, 같습니다.** 둘 다 EAS가 관리하는 동일한 keystore를 사용합니다. 로컬/클라우드는 빌드를 어디서 수행하느냐의 차이일 뿐입니다.

### Q: `npx expo run:android`와 `eas build`의 SHA-1이 다른가요?
**A: 네, 다릅니다.** `npx expo run:android`는 로컬의 debug.keystore를 사용하고, `eas build`는 EAS keystore를 사용합니다.

### Q: 패키지명이 다르면 SHA-1도 다른가요?
**A: 아니요.** SHA-1은 Keystore에 의해 결정됩니다. 같은 keystore면 패키지명이 달라도 SHA-1은 같습니다.

### Q: Preview와 Production 빌드의 SHA-1이 같은가요?
**A: 보통 같습니다.** EAS는 기본적으로 하나의 keystore를 공유합니다.

### Q: google-services.json을 수정하면 바로 적용되나요?
**A: 아니요.** 반드시 앱을 재빌드해야 합니다.
