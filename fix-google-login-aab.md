# AAB 구글 로그인 DEVELOPER_ERROR 해결 가이드

## 문제 원인
AAB로 배포 시 Google Play App Signing이 앱을 재서명하지만,
새로운 SHA-1 인증서가 Firebase Console에 등록되지 않아 DEVELOPER_ERROR 발생

## 해결 단계

### 1. Google Play Console에서 App Signing 인증서 확인
1. https://play.google.com/console 접속
2. 앱 선택 > 출시 > 설정 > 앱 무결성
3. "앱 서명" 섹션에서 **SHA-1 인증서 지문** 복사

### 2. Firebase Console에 SHA-1 등록
1. https://console.firebase.google.com 접속
2. 프로젝트 선택 > ⚙️ 프로젝트 설정
3. "내 앱" 섹션에서 Android 앱 선택
4. "SHA 인증서 지문" 섹션에서 "지문 추가" 클릭
5. Google Play Console에서 복사한 **App Signing SHA-1** 붙여넣기
6. 저장

### 3. 로컬 키스토어 SHA-1도 함께 등록 (선택사항)

#### 디버그 키 SHA-1 (개발용)
```bash
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android | grep SHA1
```

#### 릴리스 키 SHA-1 (로컬 APK 빌드용)
```bash
# 키스토어 경로를 실제 경로로 변경하세요
keytool -list -v -keystore /path/to/your/release.keystore -alias your-alias | grep SHA1
```

### 4. google-services.json 재다운로드 및 교체
1. Firebase Console > 프로젝트 설정 > Android 앱
2. "google-services.json" 다운로드
3. 프로젝트 루트에 다음 파일들 교체:
   - `google-services.json` (production용)
   - `google-services-preview.json` (preview용 - 동일 파일 복사)
   - `google-services-dev.json` (development용 - 동일 파일 복사)

### 5. 재빌드 및 배포
```bash
# AAB 빌드
npm run build-android-production

# 또는 클라우드 빌드
eas build --platform android --profile production
```

## 확인 사항

### Firebase Console에 등록해야 할 SHA-1 목록
- ✅ Google Play App Signing 키 SHA-1 (AAB 배포용) ⭐ **필수**
- ✅ 로컬 릴리스 키 SHA-1 (로컬 APK 빌드용)
- ✅ 디버그 키 SHA-1 (개발용)

### Google OAuth Client ID 확인 (구글 로그인 사용 시)
1. https://console.cloud.google.com/apis/credentials 접속
2. OAuth 2.0 클라이언트 ID 확인
3. 패키지 이름: `site.praytogether`
4. SHA-1 인증서 지문 확인 (Firebase와 동일해야 함)

## 트러블슈팅

### 여전히 DEVELOPER_ERROR 발생 시
1. Firebase Console에서 변경사항 반영까지 **최대 1시간** 소요
2. google-services.json 재다운로드 확인
3. 앱 완전히 삭제 후 재설치
4. Google Play Console 내부 테스트 트랙에 배포하여 테스트

### 패키지 이름 확인
- app.config.js: `site.praytogether` (production)
- Firebase Console Android 앱 패키지 이름과 일치 확인
- Google Cloud OAuth Client ID 패키지 이름과 일치 확인
