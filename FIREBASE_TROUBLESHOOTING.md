# Firebase 연결 문제 해결 가이드

## 문제 상황
Firestore 연결 오류 (400 Bad Request)가 발생하는 경우의 해결 방법입니다.

## 해결 방법

### 1. Firebase 콘솔에서 Firestore 보안 규칙 확인

1. [Firebase 콘솔](https://console.firebase.google.com/) 접속
2. 프로젝트 선택: `seepn-4820b`
3. 왼쪽 메뉴에서 "Firestore Database" 클릭
4. "규칙" 탭 클릭
5. 다음 규칙으로 변경:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

6. "게시" 버튼 클릭

### 2. Firebase 프로젝트 설정 확인

1. Firebase 콘솔에서 "프로젝트 설정" 클릭
2. "일반" 탭에서 "내 앱" 섹션 확인
3. 웹 앱이 등록되어 있는지 확인
4. 등록되어 있지 않다면 "웹 앱 추가" 클릭

### 3. 환경변수 확인

`.env.local` 파일이 프로젝트 루트에 있는지 확인:

```bash
# Firebase Configuration for seepn project
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyASzdiCKdch8POhtC-HhV_11PuYrz9bZYQ
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seepn-4820b.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seepn-4820b
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seepn-4820b.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1030435231887
NEXT_PUBLIC_FIREBASE_APP_ID=1:1030435231887:web:bc175d873a5eae1f6678fa
```

### 4. 개발 서버 재시작

```bash
npm run dev
```

### 5. 브라우저 캐시 클리어

1. 개발자 도구 열기 (F12)
2. Network 탭에서 "Disable cache" 체크
3. 페이지 새로고침 (Ctrl+Shift+R)

### 6. Firebase 프로젝트 상태 확인

1. Firebase 콘솔에서 프로젝트가 활성화되어 있는지 확인
2. 결제 계정이 연결되어 있는지 확인 (Blaze 플랜 필요)

## 추가 디버깅

### 콘솔에서 확인할 수 있는 정보:

1. **Firebase 설정 확인**:
   ```javascript
   console.log('Firebase config:', {
     apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
     projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
   });
   ```

2. **Firestore 연결 테스트**:
   ```javascript
   import { db } from '@/lib/firebase';
   console.log('Firestore instance:', db);
   ```

### 일반적인 오류와 해결책:

1. **"Missing or insufficient permissions"**
   - Firestore 보안 규칙을 위의 규칙으로 변경

2. **"Project not found"**
   - Firebase 프로젝트 ID 확인
   - 프로젝트가 활성화되어 있는지 확인

3. **"API key not valid"**
   - Firebase 콘솔에서 새로운 API 키 생성
   - 환경변수 업데이트

4. **네트워크 오류**
   - 방화벽 설정 확인
   - VPN 사용 중이라면 해제 후 시도

## 테스트 방법

1. 로그인 페이지에서 개발자 도구 열기
2. Console 탭에서 오류 메시지 확인
3. Network 탭에서 Firebase 요청 상태 확인
4. 위의 해결 방법을 순서대로 시도

## 연락처

문제가 지속되면 Firebase 지원팀에 문의하거나 프로젝트 관리자에게 연락하세요.
