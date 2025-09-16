import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ''
};

// Firebase 앱이 이미 초기화되었는지 확인
let app: FirebaseApp | null = null;
let db: Firestore | null = null;

try {
  // Firebase 설정이 완전한지 확인
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
    console.log('Firebase initialized successfully');
  } else {
    console.warn('Firebase configuration is incomplete, skipping initialization');
    app = null;
    db = null;
  }
} catch (error) {
  console.error('Firebase initialization failed:', error);
  // 빌드 시 오류를 방지하기 위해 null로 설정
  app = null;
  db = null;
}

export { db };

// Firebase 설정 검증 (클라이언트 사이드에서만 실행)
if (typeof window !== 'undefined' && (!firebaseConfig.apiKey || !firebaseConfig.projectId)) {
  console.warn('Firebase configuration is missing. Please check your environment variables.');
  // 오류를 던지지 않고 경고만 표시
  // throw new Error('Firebase configuration is incomplete');
}

// 개발 환경에서 에뮬레이터 연결 (선택사항) - 현재 비활성화
// if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined' && db) {
//   try {
//     // 에뮬레이터 연결 시도 (이미 연결된 경우 오류 발생하지만 무시)
//     connectFirestoreEmulator(db, 'localhost', 8080);
//   } catch {
//     // 에뮬레이터 연결 실패는 무시 (프로덕션 환경에서는 정상)
//     console.log('Firestore emulator not available, using production database');
//   }
// }

export default app;
