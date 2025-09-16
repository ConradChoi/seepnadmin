import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  where
} from 'firebase/firestore';
import { db } from './firebase';

export interface Operator {
  id?: string;
  username: string;
  name: string;
  email: string;
  password: string;
  role: string; // 그룹 ID를 저장
  department: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  createDate: string;
  updateDate?: string;
}

const COLLECTION_NAME = 'operators';

// 모든 운영자 조회
export const getOperators = async (): Promise<Operator[]> => {
  try {
    const operatorsRef = collection(db, COLLECTION_NAME);
    const q = query(operatorsRef, orderBy('createDate', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Operator[];
  } catch (error) {
    console.error('Error getting operators:', error);
    // Firebase 연결 오류 시 빈 배열 반환
    if (error instanceof Error && (error.message.includes('Firestore') || error.message.includes('network'))) {
      console.warn('Firestore connection failed, returning empty array');
      return [];
    }
    throw error;
  }
};

// 운영자 생성
export const createOperator = async (operatorData: Omit<Operator, 'id' | 'createDate' | 'lastLogin'>): Promise<string> => {
  try {
    const operatorsRef = collection(db, COLLECTION_NAME);
    const newOperator = {
      ...operatorData,
      lastLogin: new Date().toISOString(),
      createDate: new Date().toISOString(),
      updateDate: new Date().toISOString()
    };
    
    const docRef = await addDoc(operatorsRef, newOperator);
    return docRef.id;
  } catch (error) {
    console.error('Error creating operator:', error);
    throw error;
  }
};

// 운영자 업데이트
export const updateOperator = async (id: string, operatorData: Partial<Operator>): Promise<void> => {
  try {
    const operatorRef = doc(db, COLLECTION_NAME, id);
    const updateData = {
      ...operatorData,
      updateDate: new Date().toISOString()
    };
    
    await updateDoc(operatorRef, updateData);
  } catch (error) {
    console.error('Error updating operator:', error);
    throw error;
  }
};

// 운영자 삭제
export const deleteOperator = async (id: string): Promise<void> => {
  try {
    const operatorRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(operatorRef);
  } catch (error) {
    console.error('Error deleting operator:', error);
    throw error;
  }
};

// 운영자 상태 토글
export const toggleOperatorStatus = async (id: string, currentStatus: 'active' | 'inactive'): Promise<void> => {
  try {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    await updateOperator(id, { status: newStatus });
  } catch (error) {
    console.error('Error toggling operator status:', error);
    throw error;
  }
};

// 이메일로 운영자 조회
export const getOperatorByEmail = async (email: string): Promise<Operator | null> => {
  try {
    const operatorsRef = collection(db, COLLECTION_NAME);
    const q = query(operatorsRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as Operator;
  } catch (error) {
    console.error('Error getting operator by email:', error);
    throw error;
  }
};
