// 이 스크립트는 브라우저 콘솔에서 실행하세요
// Firebase 콘솔에서 직접 실행하거나, 개발자 도구에서 실행

const testOperator = {
  username: "admin",
  name: "관리자",
  email: "admin@example.com",
  password: "admin123",
  role: "", // 그룹 ID가 필요하므로 나중에 설정
  department: "IT",
  status: "active",
  lastLogin: null,
  createDate: new Date().toISOString()
};

console.log("테스트 운영자 데이터:", testOperator);
console.log("이 데이터를 Firebase 콘솔에서 'operators' 컬렉션에 추가하세요.");
console.log("또는 운영자 관리 페이지에서 직접 등록하세요.");
