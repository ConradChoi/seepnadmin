# Firebase 연동 설정 가이드

## 1. Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름 입력 (예: suppliers-admin)
4. Google Analytics 설정 (선택사항)
5. 프로젝트 생성 완료

## 2. Firestore 데이터베이스 설정

1. Firebase Console에서 생성한 프로젝트 선택
2. 왼쪽 메뉴에서 "Firestore Database" 클릭
3. "데이터베이스 만들기" 클릭
4. 보안 규칙 설정:
   - 테스트 모드에서 시작 (개발용)
   - 프로덕션용으로는 적절한 보안 규칙 설정 필요
5. 위치 선택 (asia-northeast3 권장)

## 3. 환경 변수 설정

1. `firebase-config.example.txt` 파일을 `.env.local`로 복사
2. Firebase Console에서 프로젝트 설정 > 일반 탭으로 이동
3. "내 앱" 섹션에서 웹 앱 추가 (</> 아이콘)
4. 앱 닉네임 입력 후 등록
5. Firebase SDK 설정에서 config 객체 복사
6. `.env.local` 파일에 실제 값 입력:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_actual_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_actual_app_id
```

## 4. Firestore 컬렉션 구조

### categories 컬렉션
```javascript
{
  categoryCode: string,      // 자동 생성된 카테고리 코드
  categoryName: string,      // 카테고리명
  category1Depth: string,    // 1Depth 카테고리
  category2Depth: string,    // 2Depth 카테고리
  category3Depth: string,    // 3Depth 카테고리
  status: 'active' | 'inactive', // 활성/비활성 상태
  createDate: string,        // 생성일 (ISO string)
  updateDate: string         // 수정일 (ISO string)
}
```

## 5. 보안 규칙 (Firestore)

개발 환경:
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

프로덕션 환경 (권장):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /categories/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 6. 기능 설명

### 구현된 기능
- ✅ 카테고리 목록 조회 (Firestore에서 실시간 로딩)
- ✅ 카테고리 등록 (자동 코드 생성)
- ✅ 카테고리 상태 토글 (활성/비활성)
- ✅ 계층적 카테고리 검색 (1Depth, 2Depth, 3Depth)
- ✅ 카테고리명 검색
- ✅ 로딩 상태 표시

### 자동 코드 생성 규칙
- 형식: `{1Depth첫글자}{2Depth첫글자}{3Depth첫글자}{3자리숫자}`
- 예시: 전자제품 > 컴퓨터 > 데스크톱 → `전컴데001`

## 7. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000/items`로 접속하여 Firebase 연동된 카테고리 관리 기능을 확인할 수 있습니다.

## 8. 문제 해결

### 일반적인 문제
1. **환경 변수 오류**: `.env.local` 파일이 올바르게 설정되었는지 확인
2. **Firestore 권한 오류**: 보안 규칙이 올바르게 설정되었는지 확인
3. **네트워크 오류**: Firebase 프로젝트 ID가 올바른지 확인

### 디버깅
- 브라우저 개발자 도구의 콘솔에서 오류 메시지 확인
- Firebase Console에서 Firestore 데이터 확인
- 네트워크 탭에서 API 호출 상태 확인
