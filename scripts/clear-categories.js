const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, deleteDoc, doc } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

// .env 파일에서 환경 변수 읽기
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    });
    return envVars;
  }
  return {};
}

const envVars = loadEnvFile();

// Firebase 설정 (환경 변수에서 가져오기)
const firebaseConfig = {
  apiKey: envVars.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: envVars.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: envVars.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: envVars.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: envVars.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: envVars.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ''
};

// Firebase 설정 검증
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('Firebase configuration is incomplete. Please check your .env file.');
  console.error('Required environment variables:');
  console.error('- NEXT_PUBLIC_FIREBASE_API_KEY');
  console.error('- NEXT_PUBLIC_FIREBASE_PROJECT_ID');
  console.error('- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN');
  console.error('- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET');
  console.error('- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID');
  console.error('- NEXT_PUBLIC_FIREBASE_APP_ID');
  process.exit(1);
}

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function clearAllCategories() {
  try {
    console.log('Starting to clear all categories...');
    
    // categories 컬렉션의 모든 문서 가져오기
    const categoriesRef = collection(db, 'categories');
    const querySnapshot = await getDocs(categoriesRef);
    
    console.log(`Found ${querySnapshot.size} categories to delete`);
    
    // 각 문서 삭제
    const deletePromises = [];
    querySnapshot.forEach((docSnapshot) => {
      console.log(`Deleting category: ${docSnapshot.id} - ${docSnapshot.data().categoryName}`);
      deletePromises.push(deleteDoc(doc(db, 'categories', docSnapshot.id)));
    });
    
    // 모든 삭제 작업 완료 대기
    await Promise.all(deletePromises);
    
    console.log('All categories have been deleted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing categories:', error);
    process.exit(1);
  }
}

// 스크립트 실행
clearAllCategories();
