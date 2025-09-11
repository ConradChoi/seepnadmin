"use client";

import { useState } from "react";
import AdminLayout from "@/components/layout/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { getActiveGroups, getActiveGroupPermissions } from "@/lib/groups-data";

export default function MenuPermissionsPage() {
  const [editingMenu, setEditingMenu] = useState<string | null>(null);
  const [tempPermissions, setTempPermissions] = useState<Record<string, Record<string, { create: boolean; view: boolean; edit: boolean; delete: boolean }>>>({});
  const activeGroups = getActiveGroups();
  const menuPermissions = getActiveGroupPermissions();

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
    { key: "items", name: "표준 품목 관리" },
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
    { key: "groups", name: "그룹관리" }
  ];

  // 활성 그룹을 역할 배열로 변환
  const roles = activeGroups.map(group => ({
    value: group.code.toLowerCase(),
    label: group.name
  }));

  const handleSavePermissions = () => {
    // 여기서 실제 권한 저장 로직을 구현
    console.log('Saving permissions:', tempPermissions);
    setEditingMenu(null);
    setTempPermissions({});
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
                        const permission = menuPermissions.find(p => p.role === role.value);
                        if (permission) {
                          currentPermissions[role.value] = {};
                          menuItems.forEach(menu => {
                            currentPermissions[role.value][menu.key] = permission.permissions[menu.key as keyof typeof permission.permissions];
                          });
                        }
                      });
                      setTempPermissions(currentPermissions);
                      setEditingMenu('all');
                    }
                  }}
                >
                  {editingMenu ? '수정 완료' : '권한 수정'}
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>권한 일괄 설정</Button>
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
                              <Checkbox id={`select-${menu.key}`} />
                              <Label htmlFor={`select-${menu.key}`} className="text-sm">{menu.name}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-medium">권한 설정</h4>
                        <div className="grid grid-cols-4 gap-4">
                          {roles.map(role => (
                            <div key={role.value} className="space-y-2">
                              <Label className="font-medium">{role.label}</Label>
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <Checkbox id={`${role.value}-create`} />
                                  <Label htmlFor={`${role.value}-create`} className="text-sm">생성</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox id={`${role.value}-view`} />
                                  <Label htmlFor={`${role.value}-view`} className="text-sm">조회</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox id={`${role.value}-edit`} />
                                  <Label htmlFor={`${role.value}-edit`} className="text-sm">수정</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox id={`${role.value}-delete`} />
                                  <Label htmlFor={`${role.value}-delete`} className="text-sm">삭제</Label>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline">취소</Button>
                        <Button>적용</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32">메뉴명</TableHead>
                    <TableHead className="text-center">최고관리자</TableHead>
                    <TableHead className="text-center">관리자</TableHead>
                    <TableHead className="text-center">운영자</TableHead>
                    <TableHead className="text-center">검토자</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menuItems.map((menu) => (
                    <TableRow key={menu.key}>
                      <TableCell className="font-medium">
                        {menu.name}
                      </TableCell>
                      {roles.map(role => {
                        const permission = menuPermissions.find(p => p.role === role.value);
                        const menuPermission = permission?.permissions[menu.key as keyof typeof permission.permissions];
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
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
