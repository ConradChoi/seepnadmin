import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy
} from 'firebase/firestore';
import { db } from './firebase';

export interface Group {
  id?: string;
  name: string;
  description: string;
  permissions: Record<string, { create: boolean; view: boolean; edit: boolean; delete: boolean }>;
  status: 'active' | 'inactive';
  createDate: string;
  updateDate?: string;
}

const COLLECTION_NAME = 'groups';

// 모든 그룹 조회
export const getGroups = async (): Promise<Group[]> => {
  try {
    // Firebase가 초기화되지 않은 경우 빈 배열 반환
    if (!db) {
      console.warn('Firebase not initialized, returning empty array');
      return [];
    }

    const groupsRef = collection(db, COLLECTION_NAME);
    const q = query(groupsRef, orderBy('createDate', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Group[];
  } catch (error) {
    console.error('Error getting groups:', error);
    // Firebase 연결 오류 시 빈 배열 반환
    if (error instanceof Error && (error.message.includes('Firestore') || error.message.includes('network'))) {
      console.warn('Firestore connection failed, returning empty array');
      return [];
    }
    throw error;
  }
};

// 그룹 생성
export const createGroup = async (groupData: Omit<Group, 'id' | 'createDate'>): Promise<string> => {
  try {
    // Firebase가 초기화되지 않은 경우 오류 발생
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    const groupsRef = collection(db, COLLECTION_NAME);
    const newGroup = {
      ...groupData,
      createDate: new Date().toISOString(),
      updateDate: new Date().toISOString()
    };
    
    const docRef = await addDoc(groupsRef, newGroup);
    return docRef.id;
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
};

// 그룹 업데이트
export const updateGroup = async (id: string, groupData: Partial<Group>): Promise<void> => {
  try {
    // Firebase가 초기화되지 않은 경우 오류 발생
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    const groupRef = doc(db, COLLECTION_NAME, id);
    const updateData = {
      ...groupData,
      updateDate: new Date().toISOString()
    };
    
    await updateDoc(groupRef, updateData);
  } catch (error) {
    console.error('Error updating group:', error);
    throw error;
  }
};

// 그룹 삭제
export const deleteGroup = async (id: string): Promise<void> => {
  try {
    // Firebase가 초기화되지 않은 경우 오류 발생
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    const groupRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(groupRef);
  } catch (error) {
    console.error('Error deleting group:', error);
    throw error;
  }
};

// 그룹 상태 토글
export const toggleGroupStatus = async (id: string, currentStatus: 'active' | 'inactive'): Promise<void> => {
  try {
    // Firebase가 초기화되지 않은 경우 오류 발생
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    await updateGroup(id, { status: newStatus });
  } catch (error) {
    console.error('Error toggling group status:', error);
    throw error;
  }
};

// 그룹 권한 업데이트
export const updateGroupPermissions = async (id: string, permissions: Record<string, { create: boolean; view: boolean; edit: boolean; delete: boolean }>): Promise<void> => {
  try {
    // Firebase가 초기화되지 않은 경우 오류 발생
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    await updateGroup(id, { permissions });
  } catch (error) {
    console.error('Error updating group permissions:', error);
    throw error;
  }
};

// 그룹 조회 (ID로)
export const getGroupById = async (id: string): Promise<Group | null> => {
  try {
    // Firebase가 초기화되지 않은 경우 null 반환
    if (!db) {
      console.warn('Firebase not initialized, returning null');
      return null;
    }

    const groups = await getGroups();
    return groups.find(group => group.id === id) || null;
  } catch (error) {
    console.error('Error getting group by id:', error);
    throw error;
  }
};
