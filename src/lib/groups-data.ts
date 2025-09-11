// 그룹 데이터를 공통으로 관리하는 파일

export interface Group {
  id: number;
  name: string;
  code: string;
  description: string;
  memberCount: number;
  status: "active" | "inactive";
  permissions: string[];
  createDate: string;
  lastModified: string;
  modifiedBy: string;
}

// 활성 그룹 데이터 (그룹관리에서 관리)
export const activeGroups: Group[] = [
  {
    id: 1,
    name: "최고관리자",
    code: "SUPER_ADMIN",
    description: "시스템 전체 관리 권한을 가진 최고 관리자 그룹",
    memberCount: 1,
    status: "active",
    permissions: ["모든 권한"],
    createDate: "2023-12-31 23:59:59",
    lastModified: "2024-01-15 09:30:45",
    modifiedBy: "system"
  },
  {
    id: 2,
    name: "관리자",
    code: "ADMIN",
    description: "일반적인 관리 업무를 수행하는 관리자 그룹",
    memberCount: 3,
    status: "active",
    permissions: ["사용자 관리", "콘텐츠 관리", "통계 조회"],
    createDate: "2024-01-01 00:00:00",
    lastModified: "2024-01-20 14:22:10",
    modifiedBy: "admin"
  },
  {
    id: 3,
    name: "운영자",
    code: "OPERATOR",
    description: "일상적인 운영 업무를 담당하는 운영자 그룹",
    memberCount: 8,
    status: "active",
    permissions: ["콘텐츠 관리", "문의 처리", "통계 조회"],
    createDate: "2024-01-05 10:15:30",
    lastModified: "2024-01-18 16:45:12",
    modifiedBy: "admin"
  },
  {
    id: 4,
    name: "검토자",
    code: "REVIEWER",
    description: "콘텐츠 검토 및 승인 업무를 담당하는 그룹",
    memberCount: 5,
    status: "active",
    permissions: ["콘텐츠 검토", "통계 조회"],
    createDate: "2024-01-10 13:20:45",
    lastModified: "2024-01-22 11:30:20",
    modifiedBy: "admin"
  }
  // 테스트 그룹은 비활성 상태이므로 제외
];

// 활성 그룹만 반환하는 함수
export const getActiveGroups = (): Group[] => {
  return activeGroups.filter(group => group.status === "active");
};

// 그룹을 역할 배열로 변환하는 함수
export const getActiveRoles = () => {
  return getActiveGroups().map(group => ({
    value: group.code.toLowerCase(),
    label: group.name
  }));
};

// 기본 권한 설정 (메뉴별)
export const getDefaultPermissions = () => {
  return {
    dashboard: { create: false, view: false, edit: false, delete: false },
    members: { create: false, view: false, edit: false, delete: false },
    suppliers: { create: false, view: false, edit: false, delete: false },
    items: { create: false, view: false, edit: false, delete: false },
    recommendations: { create: false, view: false, edit: false, delete: false },
    discussions: { create: false, view: false, edit: false, delete: false },
    insights: { create: false, view: false, edit: false, delete: false },
    inquiries: { create: false, view: false, edit: false, delete: false },
    notices: { create: false, view: false, edit: false, delete: false },
    faqs: { create: false, view: false, edit: false, delete: false },
    banners: { create: false, view: false, edit: false, delete: false },
    keywords: { create: false, view: false, edit: false, delete: false },
    statistics: { create: false, view: false, edit: false, delete: false },
    operators: { create: false, view: false, edit: false, delete: false },
    groups: { create: false, view: false, edit: false, delete: false },
    operators_management: { create: false, view: false, edit: false, delete: false },
    operators_groups: { create: false, view: false, edit: false, delete: false },
    operators_permissions: { create: false, view: false, edit: false, delete: false },
    keywords_management: { create: false, view: false, edit: false, delete: false },
    keywords_popular: { create: false, view: false, edit: false, delete: false }
  };
};

// 그룹별 권한 설정
export const getGroupPermissions = (groupCode: string) => {
  const defaultPerms = getDefaultPermissions();
  
  switch (groupCode) {
    case "SUPER_ADMIN":
      // 최고관리자: 모든 권한
      return Object.keys(defaultPerms).reduce((acc, key) => {
        acc[key] = { create: true, view: true, edit: true, delete: true };
        return acc;
      }, {} as Record<string, { create: boolean; view: boolean; edit: boolean; delete: boolean }>);
      
    case "ADMIN":
      // 관리자: 대부분 권한 (삭제 제외, 운영자 관리 제외)
      return {
        ...defaultPerms,
        dashboard: { create: false, view: true, edit: false, delete: false },
        suppliers: { create: true, view: true, edit: true, delete: false },
        members: { create: true, view: true, edit: true, delete: false },
        items: { create: true, view: true, edit: true, delete: false },
        inquiries: { create: true, view: true, edit: true, delete: false },
        discussions: { create: true, view: true, edit: true, delete: false },
        notices: { create: true, view: true, edit: true, delete: false },
        faqs: { create: true, view: true, edit: true, delete: false },
        banners: { create: true, view: true, edit: true, delete: false },
        keywords: { create: true, view: true, edit: true, delete: false },
        recommendations: { create: true, view: true, edit: true, delete: false },
        statistics: { create: false, view: true, edit: false, delete: false },
        insights: { create: false, view: true, edit: false, delete: false },
        operators: { create: false, view: false, edit: false, delete: false },
        groups: { create: false, view: false, edit: false, delete: false },
        operators_management: { create: false, view: false, edit: false, delete: false },
        operators_groups: { create: false, view: false, edit: false, delete: false },
        operators_permissions: { create: false, view: false, edit: false, delete: false },
        keywords_management: { create: true, view: true, edit: true, delete: false },
        keywords_popular: { create: true, view: true, edit: true, delete: false }
      };
      
    case "OPERATOR":
      // 운영자: 제한된 권한
      return {
        ...defaultPerms,
        dashboard: { create: false, view: true, edit: false, delete: false },
        suppliers: { create: false, view: true, edit: false, delete: false },
        members: { create: false, view: true, edit: false, delete: false },
        items: { create: false, view: true, edit: false, delete: false },
        inquiries: { create: true, view: true, edit: true, delete: false },
        discussions: { create: false, view: true, edit: false, delete: false },
        notices: { create: false, view: true, edit: false, delete: false },
        faqs: { create: false, view: true, edit: false, delete: false },
        banners: { create: false, view: true, edit: false, delete: false },
        keywords: { create: false, view: true, edit: false, delete: false },
        recommendations: { create: false, view: true, edit: false, delete: false },
        statistics: { create: false, view: false, edit: false, delete: false },
        insights: { create: false, view: false, edit: false, delete: false },
        operators: { create: false, view: false, edit: false, delete: false },
        groups: { create: false, view: false, edit: false, delete: false },
        operators_management: { create: false, view: false, edit: false, delete: false },
        operators_groups: { create: false, view: false, edit: false, delete: false },
        operators_permissions: { create: false, view: false, edit: false, delete: false },
        keywords_management: { create: false, view: true, edit: false, delete: false },
        keywords_popular: { create: false, view: true, edit: false, delete: false }
      };
      
    case "REVIEWER":
      // 검토자: 조회 및 검토 권한만
      return {
        ...defaultPerms,
        dashboard: { create: false, view: true, edit: false, delete: false },
        suppliers: { create: false, view: true, edit: false, delete: false },
        members: { create: false, view: true, edit: false, delete: false },
        items: { create: false, view: true, edit: false, delete: false },
        inquiries: { create: false, view: true, edit: true, delete: false },
        discussions: { create: false, view: true, edit: false, delete: false },
        notices: { create: false, view: true, edit: false, delete: false },
        faqs: { create: false, view: true, edit: false, delete: false },
        banners: { create: false, view: true, edit: false, delete: false },
        keywords: { create: false, view: true, edit: false, delete: false },
        recommendations: { create: false, view: true, edit: false, delete: false },
        statistics: { create: false, view: false, edit: false, delete: false },
        insights: { create: false, view: false, edit: false, delete: false },
        operators: { create: false, view: false, edit: false, delete: false },
        groups: { create: false, view: false, edit: false, delete: false },
        operators_management: { create: false, view: false, edit: false, delete: false },
        operators_groups: { create: false, view: false, edit: false, delete: false },
        operators_permissions: { create: false, view: false, edit: false, delete: false },
        keywords_management: { create: false, view: true, edit: false, delete: false },
        keywords_popular: { create: false, view: true, edit: false, delete: false }
      };
      
    default:
      return defaultPerms;
  }
};

// 활성 그룹의 권한 데이터 생성
export const getActiveGroupPermissions = () => {
  return getActiveGroups().map((group, index) => ({
    id: index + 1,
    role: group.code.toLowerCase(),
    roleName: group.name,
    permissions: getGroupPermissions(group.code),
    lastModified: group.lastModified,
    modifiedBy: group.modifiedBy
  }));
};
