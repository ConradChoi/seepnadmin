const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');

// Firebase 설정
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 테스트용 운영자 데이터
const testOperators = [
  {
    username: "admin",
    name: "관리자",
    email: "admin@example.com",
    password: "admin123",
    role: "", // 그룹 ID가 필요하므로 나중에 설정
    department: "IT",
    status: "active",
    lastLogin: null,
    createDate: serverTimestamp()
  },
  {
    username: "manager",
    name: "매니저",
    email: "manager@example.com",
    password: "manager123",
    role: "",
    department: "운영",
    status: "active",
    lastLogin: null,
    createDate: serverTimestamp()
  },
  {
    username: "operator",
    name: "운영자",
    email: "operator@example.com",
    password: "operator123",
    role: "",
    department: "운영",
    status: "active",
    lastLogin: null,
    createDate: serverTimestamp()
  }
];

async function seedOperators() {
  try {
    console.log('테스트 운영자 데이터를 추가하는 중...');
    
    for (const operator of testOperators) {
      await addDoc(collection(db, 'operators'), operator);
      console.log(`운영자 추가됨: ${operator.username}`);
    }
    
    console.log('모든 테스트 운영자 데이터가 성공적으로 추가되었습니다!');
  } catch (error) {
    console.error('오류 발생:', error);
  }
}

seedOperators();
