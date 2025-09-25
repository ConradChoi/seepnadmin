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

    const categoriesRef = collection(db, COLLECTION_NAME);
    
    // 1Depth 카테고리 코드 생성
    if (!category2Depth || category2Depth.trim() === '') {
      // 1Depth: 01, 02, 03...
      // 전체 1Depth 카테고리 개수를 기준으로 순차 번호 생성
      const q1Depth = query(categoriesRef, where('category2Depth', '==', ''), where('category3Depth', '==', ''));
      const snapshot1Depth = await getDocs(q1Depth);
      const count1Depth = snapshot1Depth.size + 1;
      return count1Depth.toString().padStart(2, '0');
    }
    
    // 2Depth 카테고리 코드 생성
    if (!category3Depth || category3Depth.trim() === '') {
      // 2Depth: 01-001, 01-002, 02-001...
      // 부모 1Depth 카테고리 찾기
      const q1Depth = query(categoriesRef, where('category1Depth', '==', category1Depth), where('category2Depth', '==', ''));
      const snapshot1Depth = await getDocs(q1Depth);
      
      if (snapshot1Depth.empty) {
        throw new Error(`Parent 1Depth category not found: ${category1Depth}`);
      }
      
      const parentCategory = snapshot1Depth.docs[0].data() as CategoryItem;
      const parentCode = parentCategory.categoryCode;
      
      // 같은 1Depth 하위의 모든 2Depth 카테고리 개수 조회
      const q2Depth = query(categoriesRef, where('category1Depth', '==', category1Depth), where('category2Depth', '!=', ''), where('category3Depth', '==', ''));
      const snapshot2Depth = await getDocs(q2Depth);
      const count2Depth = snapshot2Depth.size + 1;
      
      return `${parentCode}-${count2Depth.toString().padStart(3, '0')}`;
    }
    
    // 3Depth 카테고리 코드 생성
    if (category3Depth && category3Depth.trim() !== '') {
      // 3Depth: 01-001-001, 01-001-002, 01-002-001...
      // 부모 2Depth 카테고리 찾기
      const q2Depth = query(categoriesRef, where('category1Depth', '==', category1Depth), where('category2Depth', '==', category2Depth), where('category3Depth', '==', ''));
      const snapshot2Depth = await getDocs(q2Depth);
      
      if (snapshot2Depth.empty) {
        throw new Error(`Parent 2Depth category not found: ${category1Depth} > ${category2Depth}`);
      }
      
      const parentCategory = snapshot2Depth.docs[0].data() as CategoryItem;
      const parentCode = parentCategory.categoryCode;
      
      // 같은 2Depth 하위의 모든 3Depth 카테고리 개수 조회
      const q3Depth = query(categoriesRef, where('category1Depth', '==', category1Depth), where('category2Depth', '==', category2Depth), where('category3Depth', '!=', ''));
      const snapshot3Depth = await getDocs(q3Depth);
      const count3Depth = snapshot3Depth.size + 1;
      
      return `${parentCode}-${count3Depth.toString().padStart(3, '0')}`;
    }
    
    throw new Error('Invalid category depth configuration');
  } catch (error) {
    console.error('Error generating category code:', error);
    throw error;
  }
};
