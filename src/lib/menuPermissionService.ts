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

export interface MenuPermission {
  id?: string;
  menuPath: string;
  menuName: string;
  parentMenu?: string;
  permissions: {
    create: boolean;
    view: boolean;
    edit: boolean;
    delete: boolean;
  };
  status: 'active' | 'inactive';
  createDate: string;
  updateDate?: string;
}

export interface MenuPermissionGroup {
  id?: string;
  groupId: string;
  groupName: string;
  permissions: Record<string, { create: boolean; view: boolean; edit: boolean; delete: boolean }>;
  createDate: string;
  updateDate?: string;
}

const MENU_PERMISSIONS_COLLECTION = 'menuPermissions';
const MENU_PERMISSION_GROUPS_COLLECTION = 'menuPermissionGroups';

// 모든 메뉴 권한 조회
export const getMenuPermissions = async (): Promise<MenuPermission[]> => {
  try {
    const menuPermissionsRef = collection(db, MENU_PERMISSIONS_COLLECTION);
    const q = query(menuPermissionsRef, orderBy('menuPath', 'asc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as MenuPermission[];
  } catch (error) {
    console.error('Error getting menu permissions:', error);
    throw error;
  }
};

// 메뉴 권한 생성
export const createMenuPermission = async (permissionData: Omit<MenuPermission, 'id' | 'createDate'>): Promise<string> => {
  try {
    const menuPermissionsRef = collection(db, MENU_PERMISSIONS_COLLECTION);
    const newPermission = {
      ...permissionData,
      createDate: new Date().toISOString(),
      updateDate: new Date().toISOString()
    };
    
    const docRef = await addDoc(menuPermissionsRef, newPermission);
    return docRef.id;
  } catch (error) {
    console.error('Error creating menu permission:', error);
    throw error;
  }
};

// 메뉴 권한 업데이트
export const updateMenuPermission = async (id: string, permissionData: Partial<MenuPermission>): Promise<void> => {
  try {
    const permissionRef = doc(db, MENU_PERMISSIONS_COLLECTION, id);
    const updateData = {
      ...permissionData,
      updateDate: new Date().toISOString()
    };
    
    await updateDoc(permissionRef, updateData);
  } catch (error) {
    console.error('Error updating menu permission:', error);
    throw error;
  }
};

// 그룹별 메뉴 권한 조회
export const getMenuPermissionGroups = async (): Promise<MenuPermissionGroup[]> => {
  try {
    const menuPermissionGroupsRef = collection(db, MENU_PERMISSION_GROUPS_COLLECTION);
    const q = query(menuPermissionGroupsRef, orderBy('createDate', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as MenuPermissionGroup[];
  } catch (error) {
    console.error('Error getting menu permission groups:', error);
    throw error;
  }
};

// 그룹별 메뉴 권한 생성/업데이트
export const upsertMenuPermissionGroup = async (groupId: string, groupName: string, permissions: Record<string, { create: boolean; view: boolean; edit: boolean; delete: boolean }>): Promise<string> => {
  try {
    // 기존 그룹 권한 조회
    const menuPermissionGroupsRef = collection(db, MENU_PERMISSION_GROUPS_COLLECTION);
    const q = query(menuPermissionGroupsRef, where('groupId', '==', groupId));
    const querySnapshot = await getDocs(q);
    
    const permissionData = {
      groupId,
      groupName,
      permissions,
      updateDate: new Date().toISOString()
    };
    
    if (querySnapshot.empty) {
      // 새로 생성
      const newPermissionGroup = {
        ...permissionData,
        createDate: new Date().toISOString()
      };
      const docRef = await addDoc(menuPermissionGroupsRef, newPermissionGroup);
      return docRef.id;
    } else {
      // 업데이트
      const doc = querySnapshot.docs[0];
      await updateDoc(doc.ref, permissionData);
      return doc.id;
    }
  } catch (error) {
    console.error('Error upserting menu permission group:', error);
    throw error;
  }
};

// 그룹별 메뉴 권한 삭제
export const deleteMenuPermissionGroup = async (groupId: string): Promise<void> => {
  try {
    const menuPermissionGroupsRef = collection(db, MENU_PERMISSION_GROUPS_COLLECTION);
    const q = query(menuPermissionGroupsRef, where('groupId', '==', groupId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      await deleteDoc(doc.ref);
    }
  } catch (error) {
    console.error('Error deleting menu permission group:', error);
    throw error;
  }
};
