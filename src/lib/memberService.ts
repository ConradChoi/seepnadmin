import { 
  collection, 
  query, 
  orderBy, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  onSnapshot,
  Unsubscribe,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

// 회원 데이터 타입 정의
export interface Member {
  id: string;
  email: string;
  name: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string; // ISO string format
  lastLogin: string; // ISO string format
  createdAt: Timestamp;
  updatedAt: Timestamp;
  // 추가 필드들
  profileImage?: string;
  department?: string;
  role?: string;
  nickname?: string;
  notes?: string;
  // 약관 동의 필드들
  terms?: string | boolean; // 필수 - Y 또는 true
  privacy?: string | boolean; // 필수 - Y 또는 true
  marketing?: {
    email?: string | boolean; // Y 또는 true
    sms?: string | boolean; // Y 또는 true
  };
}

// 회원 상태 타입
export type MemberStatus = 'active' | 'inactive' | 'suspended';

// 검색 및 필터 옵션
export interface MemberFilterOptions {
  searchTerm?: string;
  status?: MemberStatus | 'all';
  dateType?: 'register' | 'login';
  dateRange?: string;
  startDate?: string;
  endDate?: string;
}

// 회원 목록 가져오기
export const getMembers = async (filterOptions?: MemberFilterOptions): Promise<Member[]> => {
  try {
    if (!db) {
      throw new Error('Firebase is not initialized');
    }

    const membersRef = collection(db, 'users');
    let q = query(membersRef);

    // 상태 필터가 있는 경우와 없는 경우를 분리하여 처리
    if (filterOptions?.status && filterOptions.status !== 'all') {
      // 상태 필터가 있는 경우: 상태로 먼저 필터링
      q = query(q, where('status', '==', filterOptions.status));
    } else {
      // 상태 필터가 없는 경우: 생성일로 정렬
      q = query(q, orderBy('createdAt', 'desc'));
    }

    const querySnapshot = await getDocs(q);
    const members: Member[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const member: Member = {
        id: doc.id,
        email: data.email || '',
        name: data.fullName || data.name || data.displayName || '',
        phone: data.phone || data.phoneNumber || '',
        status: data.status || 'active',
        joinDate: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        lastLogin: data.lastLoginAt?.toDate().toISOString() || new Date().toISOString(),
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        profileImage: data.profileImage || data.photoURL,
        department: data.department,
        role: data.role,
        nickname: data.nickname,
        notes: data.notes,
        terms: data.agreements?.terms,
        privacy: data.agreements?.privacy,
        marketing: {
          email: data.agreements?.marketingEmail,
          sms: data.agreements?.marketingSms
        }
      };
      members.push(member);
    });

    // 클라이언트 사이드 필터링 (검색어, 날짜 범위)
    let filteredMembers = members;

    // 상태 필터가 있는 경우 클라이언트에서 정렬 (최신순)
    if (filterOptions?.status && filterOptions.status !== 'all') {
      filteredMembers = filteredMembers.sort((a, b) => 
        new Date(b.createdAt.toDate()).getTime() - new Date(a.createdAt.toDate()).getTime()
      );
    }

    if (filterOptions?.searchTerm) {
      const searchTerm = filterOptions.searchTerm.toLowerCase();
      filteredMembers = filteredMembers.filter(member => 
        member.name.toLowerCase().includes(searchTerm) ||
        member.email.toLowerCase().includes(searchTerm) ||
        member.phone.includes(searchTerm)
      );
    }

    // 날짜 필터링
    if (filterOptions?.dateRange && filterOptions.dateRange !== 'all') {
      const targetField = filterOptions.dateType === 'login' ? 'lastLogin' : 'joinDate';
      
      if (filterOptions.dateRange === 'custom' && filterOptions.startDate && filterOptions.endDate) {
        filteredMembers = filteredMembers.filter(member => {
          const memberDate = new Date(member[targetField]).toISOString().split('T')[0];
          return memberDate >= filterOptions.startDate! && memberDate <= filterOptions.endDate!;
        });
      } else {
        // 미리 정의된 기간 필터링
        const dateRange = getDateRange(filterOptions.dateRange);
        if (dateRange) {
          filteredMembers = filteredMembers.filter(member => {
            const memberDate = new Date(member[targetField]).toISOString().split('T')[0];
            return memberDate >= dateRange.start && memberDate <= dateRange.end;
          });
        }
      }
    }

    return filteredMembers;
  } catch (error) {
    console.error('Error fetching members:', error);
    throw error;
  }
};

// 날짜 범위 계산 함수
const getDateRange = (range: string) => {
  const today = new Date();
  const start = new Date();
  
  switch (range) {
    case "7days":
      start.setDate(today.getDate() - 7);
      break;
    case "1month":
      start.setMonth(today.getMonth() - 1);
      break;
    case "3months":
      start.setMonth(today.getMonth() - 3);
      break;
    case "6months":
      start.setMonth(today.getMonth() - 6);
      break;
    case "1year":
      start.setFullYear(today.getFullYear() - 1);
      break;
    default:
      return null;
  }
  
  return { 
    start: start.toISOString().split('T')[0], 
    end: today.toISOString().split('T')[0] 
  };
};

// 회원 상태 업데이트 (Firestore만)
export const updateMemberStatus = async (memberId: string, status: MemberStatus): Promise<void> => {
  try {
    if (!db) {
      throw new Error('Firebase is not initialized');
    }

    console.log('Updating member status in Firestore:', memberId, status);
    
    const memberRef = doc(db, 'users', memberId);
    await updateDoc(memberRef, {
      status,
      updatedAt: new Date()
    });
    
    console.log('Member status updated successfully in Firestore');
  } catch (error) {
    console.error('Error updating member status:', error);
    throw error;
  }
};

// 회원 정보 업데이트
export const updateMember = async (memberId: string, updateData: Partial<Member>): Promise<void> => {
  try {
    if (!db) {
      throw new Error('Firebase is not initialized');
    }

    const memberRef = doc(db, 'users', memberId);
    await updateDoc(memberRef, {
      ...updateData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating member:', error);
    throw error;
  }
};

// 회원 삭제 (상태를 suspended로 변경)
export const suspendMember = async (memberId: string): Promise<void> => {
  try {
    await updateMemberStatus(memberId, 'suspended');
  } catch (error) {
    console.error('Error suspending member:', error);
    throw error;
  }
};

// 회원 복구 (상태를 active로 변경)
export const restoreMember = async (memberId: string): Promise<void> => {
  try {
    await updateMemberStatus(memberId, 'active');
  } catch (error) {
    console.error('Error restoring member:', error);
    throw error;
  }
};

// 실시간 회원 목록 구독
export const subscribeToMembers = (
  callback: (members: Member[]) => void,
  filterOptions?: MemberFilterOptions
): Unsubscribe | null => {
  try {
    if (!db) {
      throw new Error('Firebase is not initialized');
    }

    const membersRef = collection(db, 'users');
    let q = query(membersRef);

    // 상태 필터가 있는 경우와 없는 경우를 분리하여 처리
    if (filterOptions?.status && filterOptions.status !== 'all') {
      // 상태 필터가 있는 경우: 상태로 먼저 필터링
      q = query(q, where('status', '==', filterOptions.status));
    } else {
      // 상태 필터가 없는 경우: 생성일로 정렬
      q = query(q, orderBy('createdAt', 'desc'));
    }

    return onSnapshot(q, (querySnapshot) => {
      const members: Member[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const member: Member = {
          id: doc.id,
          email: data.email || '',
          name: data.fullName || data.name || data.displayName || '',
          phone: data.phone || data.phoneNumber || '',
          status: data.status || 'active',
          joinDate: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
          lastLogin: data.lastLoginAt?.toDate().toISOString() || new Date().toISOString(),
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          profileImage: data.profileImage || data.photoURL,
          department: data.department,
          role: data.role,
          nickname: data.nickname,
          notes: data.notes,
          terms: data.agreements?.terms,
          privacy: data.agreements?.privacy,
          marketing: {
            email: data.agreements?.marketingEmail,
            sms: data.agreements?.marketingSms
          }
        };
        members.push(member);
      });

      // 클라이언트 사이드 필터링 (검색어, 날짜 범위)
      let filteredMembers = members;

      // 상태 필터가 있는 경우 클라이언트에서 정렬 (최신순)
      if (filterOptions?.status && filterOptions.status !== 'all') {
        filteredMembers = filteredMembers.sort((a, b) => 
          new Date(b.createdAt.toDate()).getTime() - new Date(a.createdAt.toDate()).getTime()
        );
      }

      if (filterOptions?.searchTerm) {
        const searchTerm = filterOptions.searchTerm.toLowerCase();
        filteredMembers = filteredMembers.filter(member => 
          member.name.toLowerCase().includes(searchTerm) ||
          member.email.toLowerCase().includes(searchTerm) ||
          member.phone.includes(searchTerm)
        );
      }

      // 날짜 필터링
      if (filterOptions?.dateRange && filterOptions.dateRange !== 'all') {
        const targetField = filterOptions.dateType === 'login' ? 'lastLogin' : 'joinDate';
        
        if (filterOptions.dateRange === 'custom' && filterOptions.startDate && filterOptions.endDate) {
          filteredMembers = filteredMembers.filter(member => {
            const memberDate = new Date(member[targetField]).toISOString().split('T')[0];
            return memberDate >= filterOptions.startDate! && memberDate <= filterOptions.endDate!;
          });
        } else {
          // 미리 정의된 기간 필터링
          const dateRange = getDateRange(filterOptions.dateRange);
          if (dateRange) {
            filteredMembers = filteredMembers.filter(member => {
              const memberDate = new Date(member[targetField]).toISOString().split('T')[0];
              return memberDate >= dateRange.start && memberDate <= dateRange.end;
            });
          }
        }
      }

      callback(filteredMembers);
    }, (error) => {
      console.error('Error in members subscription:', error);
      callback([]);
    });
  } catch (error) {
    console.error('Error setting up members subscription:', error);
    return null;
  }
};

// 회원 상세 정보 가져오기
export const getMemberById = async (memberId: string): Promise<Member | null> => {
  try {
    if (!db) {
      throw new Error('Firebase is not initialized');
    }

    const memberDoc = await getDocs(query(collection(db, 'users'), where('__name__', '==', memberId)));
    
    if (memberDoc.empty) {
      return null;
    }

    const data = memberDoc.docs[0].data();
    return {
      id: memberDoc.docs[0].id,
      email: data.email || '',
      name: data.fullName || data.name || data.displayName || '',
      phone: data.phone || data.phoneNumber || '',
      status: data.status || 'active',
      joinDate: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
      lastLogin: data.lastLoginAt?.toDate().toISOString() || new Date().toISOString(),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      profileImage: data.profileImage || data.photoURL,
      department: data.department,
      role: data.role,
      nickname: data.nickname,
      notes: data.notes,
      terms: data.agreements?.terms,
      privacy: data.agreements?.privacy,
      marketing: {
        email: data.agreements?.marketingEmail,
        sms: data.agreements?.marketingSms
      }
    };
  } catch (error) {
    console.error('Error fetching member by ID:', error);
    throw error;
  }
};
