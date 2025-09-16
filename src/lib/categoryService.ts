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

export interface CategoryItem {
  id?: string;
  categoryCode: string;
  categoryName: string;
  category1Depth: string;
  category2Depth: string;
  category3Depth: string;
  status: 'active' | 'inactive';
  createDate: string;
  updateDate?: string;
}

const COLLECTION_NAME = 'categories';

// 모든 카테고리 조회
export const getCategories = async (): Promise<CategoryItem[]> => {
  try {
    // Firebase가 초기화되지 않은 경우 빈 배열 반환
    if (!db) {
      console.warn('Firebase not initialized, returning empty array');
      return [];
    }

    const categoriesRef = collection(db, COLLECTION_NAME);
    const q = query(categoriesRef, orderBy('createDate', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as CategoryItem[];
  } catch (error) {
    console.error('Error getting categories:', error);
    // Firebase 연결 오류 시 빈 배열 반환
    if (error instanceof Error && (error.message.includes('Firestore') || error.message.includes('network'))) {
      console.warn('Firestore connection failed, returning empty array');
      return [];
    }
    throw error;
  }
};

// 카테고리 생성
export const createCategory = async (categoryData: Omit<CategoryItem, 'id' | 'createDate'>): Promise<string> => {
  try {
    // Firebase가 초기화되지 않은 경우 오류 발생
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    const categoriesRef = collection(db, COLLECTION_NAME);
    const newCategory = {
      ...categoryData,
      createDate: new Date().toISOString(),
      updateDate: new Date().toISOString()
    };
    
    const docRef = await addDoc(categoriesRef, newCategory);
    return docRef.id;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

// 카테고리 업데이트
export const updateCategory = async (id: string, categoryData: Partial<CategoryItem>): Promise<void> => {
  try {
    // Firebase가 초기화되지 않은 경우 오류 발생
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    const categoryRef = doc(db, COLLECTION_NAME, id);
    const updateData = {
      ...categoryData,
      updateDate: new Date().toISOString()
    };
    
    await updateDoc(categoryRef, updateData);
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

// 카테고리 삭제
export const deleteCategory = async (id: string): Promise<void> => {
  try {
    // Firebase가 초기화되지 않은 경우 오류 발생
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    const categoryRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(categoryRef);
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

// 카테고리 상태 토글
export const toggleCategoryStatus = async (id: string, currentStatus: 'active' | 'inactive'): Promise<void> => {
  try {
    // Firebase가 초기화되지 않은 경우 오류 발생
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    await updateCategory(id, { status: newStatus });
  } catch (error) {
    console.error('Error toggling category status:', error);
    throw error;
  }
};

// 카테고리 코드 자동 생성
export const generateCategoryCode = async (category1Depth: string, category2Depth: string, category3Depth: string): Promise<string> => {
  try {
    // Firebase가 초기화되지 않은 경우 오류 발생
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    // 1Depth의 첫 글자 + 2Depth의 첫 글자 + 3Depth의 첫 글자 + 3자리 숫자
    const prefix = category1Depth.charAt(0) + category2Depth.charAt(0) + category3Depth.charAt(0);
    
    // 해당 prefix로 시작하는 카테고리 개수 조회
    const categoriesRef = collection(db, COLLECTION_NAME);
    const q = query(categoriesRef, where('categoryCode', '>=', prefix), where('categoryCode', '<', prefix + 'z'));
    const querySnapshot = await getDocs(q);
    
    const count = querySnapshot.size + 1;
    const paddedCount = count.toString().padStart(3, '0');
    
    return `${prefix.toUpperCase()}${paddedCount}`;
  } catch (error) {
    console.error('Error generating category code:', error);
    throw error;
  }
};
