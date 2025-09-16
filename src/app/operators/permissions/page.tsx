"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  getGroups, 
  Group
} from "@/lib/groupService";
import { 
  getMenuPermissionGroups,
  upsertMenuPermissionGroup,
  MenuPermissionGroup 
} from "@/lib/menuPermissionService";

export default function MenuPermissionsPage() {
  const [editingMenu, setEditingMenu] = useState<string | null>(null);
  const [tempPermissions, setTempPermissions] = useState<Record<string, Record<string, { create: boolean; view: boolean; edit: boolean; delete: boolean }>>>({});
  const [activeGroups, setActiveGroups] = useState<Group[]>([]);
  const [menuPermissionGroups, setMenuPermissionGroups] = useState<MenuPermissionGroup[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 권한 일괄 설정 상태
  const [isBatchDialogOpen, setIsBatchDialogOpen] = useState(false);
  const [selectedMenus, setSelectedMenus] = useState<string[]>([]);
  const [batchPermissions, setBatchPermissions] = useState<Record<string, { create: boolean; view: boolean; edit: boolean; delete: boolean }>>({});

  // 데이터 로딩
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [groupsData, permissionGroupsData] = await Promise.all([
        getGroups(),
        getMenuPermissionGroups()
      ]);
      
      const activeGroupsList = groupsData.filter(group => group.status === "active");
      setActiveGroups(activeGroupsList);
      setMenuPermissionGroups(permissionGroupsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 로컬 스토리지 사용을 일시적으로 비활성화
  // useEffect(() => {
  //   // 클라이언트에서만 실행
  //   if (typeof window !== 'undefined') {
  //     // 로컬 스토리지에서 그룹 데이터 로드
  //     const savedGroups = localStorage.getItem('groupsData');
  //     if (savedGroups) {
  //       try {
  //         const groups = JSON.parse(savedGroups);
  //         const activeGroupsList = groups.filter((group: { status: string }) => group.status === "active");
  //         setActiveGroups(activeGroupsList);
  //         setMenuPermissions(getActiveGroupPermissions());
  //       } catch (error) {
  //         console.error('Failed to parse saved groups data:', error);
  //       }
  //     }
  //   }
  // }, []);

  // // 그룹 데이터 변경 감지
  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     const handleStorageChange = () => {
  //       const savedGroups = localStorage.getItem('groupsData');
  //       if (savedGroups) {
  //         try {
  //           const groups = JSON.parse(savedGroups);
  //           const activeGroupsList = groups.filter((group: { status: string }) => group.status === "active");
  //           setActiveGroups(activeGroupsList);
  //           setMenuPermissions(getActiveGroupPermissions());
  //         } catch (error) {
  //           console.error('Failed to parse saved groups data:', error);
  //         }
  //       }
  //     };

  //     window.addEventListener('storage', handleStorageChange);
  //     return () => window.removeEventListener('storage', handleStorageChange);
  //   }
  // }, []);

  const menuItems = [
    { key: "dashboard", name: "대시보드" },
    { key: "members", name: "회원 관리" },
    { key: "suppliers", name: "공급사 관리" },
    { key: "items", name: "표준 품목 카테고리" },
    { key: "recommendations", name: "MD 추천 관리" },
    { key: "discussions", name: "자유 토론방 관리" },
    { key: "insights", name: "인사이트 관리" },
    { key: "inquiries", name: "1:1 문의 관리" },
    { key: "notices", name: "공지사항 관리" },
    { key: "faqs", name: "FAQ 관리" },
    { key: "banners", name: "배너 관리" },
    { key: "keywords", name: "검색 키워드 관리" },
    { key: "statistics", name: "통계" },
    { key: "operators", name: "운영자 관리" },
    { key: "groups", name: "그룹 관리" }
  ];

  // 활성 그룹을 역할 배열로 변환
  const roles = activeGroups.map(group => ({
    value: group.id || '',
    label: group.name
  }));

  // 권한 데이터 가져오기
  const getPermissionForGroup = (groupId: string, menuKey: string) => {
    const permissionGroup = menuPermissionGroups.find(pg => pg.groupId === groupId);
    return permissionGroup?.permissions[menuKey] || { create: false, view: false, edit: false, delete: false };
  };

  const handleSavePermissions = async () => {
    try {
      // 각 그룹별로 권한 저장
      for (const [groupId, permissions] of Object.entries(tempPermissions)) {
        const group = activeGroups.find(g => g.id === groupId);
        if (group) {
          // 모든 메뉴에 대한 권한 데이터 구성
          const allMenuPermissions: Record<string, { create: boolean; view: boolean; edit: boolean; delete: boolean }> = {};
          menuItems.forEach(menu => {
            allMenuPermissions[menu.key] = permissions[menu.key] || { create: false, view: false, edit: false, delete: false };
          });
          
          await upsertMenuPermissionGroup(groupId, group.name, allMenuPermissions);
        }
      }
      
      // 데이터 새로고침
      await loadData();
      setEditingMenu(null);
      setTempPermissions({});
    } catch (error) {
      console.error('Error saving permissions:', error);
    }
  };

  const handlePermissionChange = (role: string, menuKey: string, permissionType: string, checked: boolean) => {
    setTempPermissions((prev: Record<string, Record<string, { create: boolean; view: boolean; edit: boolean; delete: boolean }>>) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [menuKey]: {
          ...prev[role]?.[menuKey],
          [permissionType]: checked
        }
      }
    }));
  };

  // 권한 일괄 설정 관련 핸들러들
  const handleMenuSelection = (menuKey: string, checked: boolean) => {
    if (checked) {
      setSelectedMenus(prev => [...prev, menuKey]);
    } else {
      setSelectedMenus(prev => prev.filter(key => key !== menuKey));
    }
  };

  const handleBatchPermissionChange = (groupId: string, permissionType: string, checked: boolean) => {
    setBatchPermissions(prev => ({
      ...prev,
      [groupId]: {
        ...prev[groupId],
        [permissionType]: checked
      }
    }));
  };

  const handleApplyBatchPermissions = async () => {
    try {
      if (selectedMenus.length === 0) {
        alert('적용할 메뉴를 선택해주세요.');
        return;
      }

      // 선택된 메뉴들에 대해 각 그룹별로 권한 적용
      for (const groupId of Object.keys(batchPermissions)) {
        const group = activeGroups.find(g => g.id === groupId);
        if (group && batchPermissions[groupId]) {
          // 모든 메뉴에 대한 권한 데이터 구성
          const allMenuPermissions: Record<string, { create: boolean; view: boolean; edit: boolean; delete: boolean }> = {};
          menuItems.forEach(menu => {
            if (selectedMenus.includes(menu.key)) {
              allMenuPermissions[menu.key] = { ...batchPermissions[groupId] };
            } else {
              allMenuPermissions[menu.key] = getPermissionForGroup(groupId, menu.key);
            }
          });

          await upsertMenuPermissionGroup(groupId, group.name, allMenuPermissions);
        }
      }

      // 데이터 새로고침
      await loadData();
      setIsBatchDialogOpen(false);
      setSelectedMenus([]);
      setBatchPermissions({});
    } catch (error) {
      console.error('Error applying batch permissions:', error);
    }
  };

  const handleCloseBatchDialog = () => {
    setIsBatchDialogOpen(false);
    setSelectedMenus([]);
    setBatchPermissions({});
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">메뉴 권한 관리</h1>
          <p className="text-gray-600 mt-2">역할별 메뉴 접근 권한을 설정하고 관리하세요</p>
        </div>


        {/* 권한 목록 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>메뉴 권한 목록</CardTitle>
                <CardDescription>메뉴별 역할 권한을 설정하고 관리하세요</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    if (editingMenu) {
                      handleSavePermissions();
                    } else {
                      // 현재 권한을 임시 상태로 복사
                      const currentPermissions: Record<string, Record<string, { create: boolean; view: boolean; edit: boolean; delete: boolean }>> = {};
                      roles.forEach(role => {
                        currentPermissions[role.value] = {};
                        menuItems.forEach(menu => {
                          currentPermissions[role.value][menu.key] = getPermissionForGroup(role.value, menu.key);
                        });
                      });
                      setTempPermissions(currentPermissions);
                      setEditingMenu('all');
                    }
                  }}
                >
                  {editingMenu ? '저장' : '전체 권한 수정'}
                </Button>
                <Dialog open={isBatchDialogOpen} onOpenChange={setIsBatchDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setIsBatchDialogOpen(true)}>권한 일괄 설정</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>권한 일괄 설정</DialogTitle>
                      <DialogDescription>선택한 메뉴들의 권한을 일괄 설정하세요</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-4">
                        <h4 className="font-medium">메뉴 선택</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {menuItems.map(menu => (
                            <div key={menu.key} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`select-${menu.key}`}
                                checked={selectedMenus.includes(menu.key)}
                                onCheckedChange={(checked) => handleMenuSelection(menu.key, checked as boolean)}
                              />
                              <Label htmlFor={`select-${menu.key}`} className="text-sm">{menu.name}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-medium">권한 설정</h4>
                        <div className={`grid gap-4 ${roles.length <= 4 ? `grid-cols-${roles.length}` : 'grid-cols-4'}`}>
                          {roles.map(role => (
                            <div key={role.value} className="space-y-2">
                              <Label className="font-medium">{role.label}</Label>
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    id={`${role.value}-create`}
                                    checked={batchPermissions[role.value]?.create || false}
                                    onCheckedChange={(checked) => handleBatchPermissionChange(role.value, 'create', checked as boolean)}
                                  />
                                  <Label htmlFor={`${role.value}-create`} className="text-sm">생성</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    id={`${role.value}-view`}
                                    checked={batchPermissions[role.value]?.view || false}
                                    onCheckedChange={(checked) => handleBatchPermissionChange(role.value, 'view', checked as boolean)}
                                  />
                                  <Label htmlFor={`${role.value}-view`} className="text-sm">조회</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    id={`${role.value}-edit`}
                                    checked={batchPermissions[role.value]?.edit || false}
                                    onCheckedChange={(checked) => handleBatchPermissionChange(role.value, 'edit', checked as boolean)}
                                  />
                                  <Label htmlFor={`${role.value}-edit`} className="text-sm">수정</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    id={`${role.value}-delete`}
                                    checked={batchPermissions[role.value]?.delete || false}
                                    onCheckedChange={(checked) => handleBatchPermissionChange(role.value, 'delete', checked as boolean)}
                                  />
                                  <Label htmlFor={`${role.value}-delete`} className="text-sm">삭제</Label>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={handleCloseBatchDialog}>취소</Button>
                        <Button onClick={handleApplyBatchPermissions}>적용</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2 text-gray-600">로딩 중...</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32">메뉴명</TableHead>
                    {roles.map(role => (
                      <TableHead key={role.value} className="text-center">
                        {role.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menuItems.map((menu) => (
                    <TableRow key={menu.key}>
                      <TableCell className="font-medium">
                        {menu.name}
                      </TableCell>
                      {roles.map(role => {
                        const menuPermission = getPermissionForGroup(role.value, menu.key);
                        const isEditing = editingMenu === 'all';
                        const currentPermission = isEditing 
                          ? (tempPermissions[role.value] && tempPermissions[role.value][menu.key]) 
                          : menuPermission;
                        
                        return (
                          <TableCell key={role.value} className="text-center">
                            <div className="flex flex-col gap-2">
                              <div className="flex justify-center gap-2">
                                <div className="flex items-center space-x-1">
                                  <Checkbox 
                                    id={`${menu.key}-${role.value}-create`}
                                    checked={currentPermission?.create || false}
                                    disabled={!isEditing}
                                    onCheckedChange={(checked) => {
                                      if (isEditing) {
                                        handlePermissionChange(role.value, menu.key, 'create', checked as boolean);
                                      }
                                    }}
                                  />
                                  <Label htmlFor={`${menu.key}-${role.value}-create`} className="text-xs">C</Label>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Checkbox 
                                    id={`${menu.key}-${role.value}-view`}
                                    checked={currentPermission?.view || false}
                                    disabled={!isEditing}
                                    onCheckedChange={(checked) => {
                                      if (isEditing) {
                                        handlePermissionChange(role.value, menu.key, 'view', checked as boolean);
                                      }
                                    }}
                                  />
                                  <Label htmlFor={`${menu.key}-${role.value}-view`} className="text-xs">R</Label>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Checkbox 
                                    id={`${menu.key}-${role.value}-edit`}
                                    checked={currentPermission?.edit || false}
                                    disabled={!isEditing}
                                    onCheckedChange={(checked) => {
                                      if (isEditing) {
                                        handlePermissionChange(role.value, menu.key, 'edit', checked as boolean);
                                      }
                                    }}
                                  />
                                  <Label htmlFor={`${menu.key}-${role.value}-edit`} className="text-xs">U</Label>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Checkbox 
                                    id={`${menu.key}-${role.value}-delete`}
                                    checked={currentPermission?.delete || false}
                                    disabled={!isEditing}
                                    onCheckedChange={(checked) => {
                                      if (isEditing) {
                                        handlePermissionChange(role.value, menu.key, 'delete', checked as boolean);
                                      }
                                    }}
                                  />
                                  <Label htmlFor={`${menu.key}-${role.value}-delete`} className="text-xs">D</Label>
                                </div>
                              </div>
                              <div className="text-xs text-gray-500">
                                생성/조회/수정/삭제
                              </div>
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
