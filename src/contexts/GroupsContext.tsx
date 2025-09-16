"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Group, activeGroups } from '@/lib/groups-data';

interface GroupsContextType {
  groups: Group[];
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
  activeGroups: Group[];
  getActiveGroupPermissions: () => Array<{
    id: number;
    role: string;
    roleName: string;
    permissions: Record<string, { create: boolean; view: boolean; edit: boolean; delete: boolean }>;
    lastModified: string;
    modifiedBy: string;
  }>;
}

const GroupsContext = createContext<GroupsContextType | undefined>(undefined);

export function GroupsProvider({ children }: { children: React.ReactNode }) {
  const [groups, setGroups] = useState<Group[]>(activeGroups);

  // 활성 그룹만 필터링
  const activeGroupsList = groups.filter(group => group.status === "active");

  // 그룹 상태가 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('groupsData', JSON.stringify(groups));
  }, [groups]);

  // 컴포넌트 마운트 시 로컬 스토리지에서 데이터 로드
  useEffect(() => {
    const savedGroups = localStorage.getItem('groupsData');
    if (savedGroups) {
      try {
        setGroups(JSON.parse(savedGroups));
      } catch (error) {
        console.error('Failed to parse saved groups data:', error);
      }
    }
  }, []);

  const value = {
    groups,
    setGroups,
    activeGroups: activeGroupsList,
    getActiveGroupPermissions: () => {
      return activeGroupsList.map((group, index) => ({
        id: index + 1,
        role: group.code.toLowerCase(),
        roleName: group.name,
        permissions: getGroupPermissions(group.code),
        lastModified: group.lastModified,
        modifiedBy: group.modifiedBy
      }));
    }
  };

  return (
    <GroupsContext.Provider value={value}>
      {children}
    </GroupsContext.Provider>
  );
}

// 그룹별 권한 설정 함수 (groups-data.ts에서 가져옴)
const getGroupPermissions = (groupCode: string) => {
  const defaultPerms = {
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
    groups: { create: false, view: false, edit: false, delete: false }
  };
  
  switch (groupCode) {
    case "SUPER_ADMIN":
      return Object.keys(defaultPerms).reduce((acc, key) => {
        acc[key] = { create: true, view: true, edit: true, delete: true };
        return acc;
      }, {} as Record<string, { create: boolean; view: boolean; edit: boolean; delete: boolean }>);
      
    case "ADMIN":
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
        operators: { create: false, view: true, edit: false, delete: false },
        groups: { create: false, view: true, edit: false, delete: false }
      };
      
    case "OPERATOR":
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
        groups: { create: false, view: false, edit: false, delete: false }
      };
      
    case "REVIEWER":
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
        groups: { create: false, view: false, edit: false, delete: false }
      };
      
    default:
      return defaultPerms;
  }
};

export function useGroups() {
  const context = useContext(GroupsContext);
  if (context === undefined) {
    throw new Error('useGroups must be used within a GroupsProvider');
  }
  return context;
}
