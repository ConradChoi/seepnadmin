// 이 스크립트는 Node.js 환경에서 실행하세요
// Firebase Admin SDK를 사용하여 테스트 운영자를 생성합니다

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Firebase Admin SDK 초기화 (서비스 계정 키가 필요한 경우)
// 또는 Firebase 콘솔에서 직접 데이터를 추가하세요

const testOperator = {
  username: "admin",
  name: "관리자",
  email: "admin@example.com",
  password: "admin123",
  role: "", // 그룹 ID - 나중에 설정
  department: "IT",
  status: "active",
  lastLogin: null,
  createDate: new Date().toISOString()
};

console.log("테스트 운영자 데이터:");
console.log(JSON.stringify(testOperator, null, 2));
console.log("\n이 데이터를 Firebase 콘솔에서 'operators' 컬렉션에 추가하세요.");
console.log("또는 운영자 관리 페이지에서 직접 등록하세요.");
