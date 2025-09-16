# Firebase 연결 문제 해결 가이드

## 현재 문제
- Firestore에서 `400 (Bad Request)` 오류 발생
- 로그인 시 데이터를 가져올 수 없음
- Firebase Security Rules가 너무 제한적

## 해결 방법

### 1. Firestore Security Rules 수정 (필수)

**Firebase 콘솔에서:**
1. [Firebase 콘솔](https://console.firebase.google.com) 접속
2. 프로젝트 선택
3. **Firestore Database** → **Rules** 탭 클릭
4. 현재 규칙을 다음으로 변경:

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

5. **Publish** 버튼 클릭

### 2. AWS Amplify 환경변수 설정

**AWS Amplify 콘솔에서:**
1. [AWS Amplify 콘솔](https://console.aws.amazon.com/amplify) 접속
2. 해당 앱 선택
3. **App settings** → **Environment variables** 클릭
4. 다음 환경변수들 추가:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Firebase 프로젝트 설정 확인

**Firebase 콘솔에서:**
1. **Project Settings** → **General** 탭
2. **Your apps** 섹션에서 웹 앱 설정 확인
3. **Config** 객체의 값들을 복사하여 AWS Amplify 환경변수에 설정

### 4. 테스트 데이터 생성

Firebase 연결이 성공하면 다음 테스트 데이터를 생성:

1. **그룹 생성**: "관리자" 그룹
2. **운영자 생성**: 테스트 계정
3. **메뉴 권한 설정**: 그룹별 권한 설정

## 문제 해결 후 확인사항

- [ ] Firestore Security Rules가 `allow read, write: if true;`로 설정됨
- [ ] AWS Amplify에 모든 Firebase 환경변수가 설정됨
- [ ] 로그인 페이지에서 데이터베이스 연결 성공
- [ ] 테스트 계정으로 로그인 가능
- [ ] 메뉴 권한이 정상적으로 작동

## 보안 고려사항

**개발 환경에서는 위의 설정이 적절하지만, 프로덕션 환경에서는 더 엄격한 보안 규칙을 적용해야 합니다:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 운영자 데이터
    match /operators/{operatorId} {
      allow read, write: if request.auth != null;
    }
    
    // 그룹 데이터
    match /groups/{groupId} {
      allow read, write: if request.auth != null;
    }
    
    // 메뉴 권한 데이터
    match /menuPermissions/{permissionId} {
      allow read, write: if request.auth != null;
    }
  }
}
```
