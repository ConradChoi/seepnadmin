"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  getGroups, 
  createGroup, 
  updateGroup,
  toggleGroupStatus,
  deleteGroup,
  Group 
} from "@/lib/groupService";
import { getOperators, updateOperator, Operator } from "@/lib/operatorService";
import { getMenuPermissionGroups, upsertMenuPermissionGroup, MenuPermissionGroup } from "@/lib/menuPermissionService";

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [menuPermissionGroups, setMenuPermissionGroups] = useState<MenuPermissionGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedGroupForPermission, setSelectedGroupForPermission] = useState<Group | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: {} as Record<string, { create: boolean; view: boolean; edit: boolean; delete: boolean }>,
    status: "active" as "active" | "inactive"
  });

  // 데이터 로딩
  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const [groupsData, operatorsData, menuPermissionData] = await Promise.all([
        getGroups(),
        getOperators(),
        getMenuPermissionGroups()
      ]);
      setGroups(groupsData);
      setOperators(operatorsData);
      setMenuPermissionGroups(menuPermissionData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 상태 토글 핸들러
  const handleToggleStatus = async (id: string, currentStatus: 'active' | 'inactive') => {
    try {
      await toggleGroupStatus(id, currentStatus);
      await loadGroups(); // 데이터 새로고침
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingGroup) {
        // 수정 모드
        await updateGroup(editingGroup.id!, formData);
      } else {
        // 생성 모드
        await createGroup(formData);
      }
      
      // 폼 초기화
      setFormData({
        name: "",
        description: "",
        permissions: {},
        status: "active"
      });
      setEditingGroup(null);
      setIsDialogOpen(false);
      await loadGroups(); // 데이터 새로고침
    } catch (error) {
      console.error('Error saving group:', error);
    }
  };

  // 수정 모드 시작
  const handleEdit = (group: Group) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      description: group.description,
      permissions: group.permissions,
      status: group.status
    });
    setIsDialogOpen(true);
  };

  // 다이얼로그 닫기
  const handleCloseDialog = () => {
    setEditingGroup(null);
    setFormData({
      name: "",
      description: "",
      permissions: {},
      status: "active"
    });
    setIsDialogOpen(false);
  };

  // 멤버 관리 다이얼로그 열기
  const handleMemberManagement = (group: Group) => {
    setSelectedGroup(group);
    setIsMemberDialogOpen(true);
  };

  // 멤버 관리 다이얼로그 닫기
  const handleCloseMemberDialog = () => {
    setSelectedGroup(null);
    setIsMemberDialogOpen(false);
  };

  // 권한 상세 팝업 열기
  const handlePermissionDetail = (group: Group) => {
    setSelectedGroupForPermission(group);
    setIsPermissionDialogOpen(true);
  };

  // 권한 상세 팝업 닫기
  const handleClosePermissionDialog = () => {
    setSelectedGroupForPermission(null);
    setIsPermissionDialogOpen(false);
  };

  // 테스트용 그룹 생성 함수
  const createTestGroup = async () => {
    try {
      const testGroup = {
        name: "관리자",
        description: "시스템 관리자 그룹",
        permissions: {},
        status: "active" as "active" | "inactive"
      };
      
      // 그룹 생성
      const groupId = await createGroup(testGroup);
      await loadGroups();
      
      // 생성된 그룹 ID로 메뉴 권한 설정
      if (groupId) {
        // 모든 메뉴에 대한 권한 설정
        const allMenuPermissions = {
          "dashboard": { create: true, view: true, edit: true, delete: true },
          "members": { create: true, view: true, edit: true, delete: true },
          "suppliers": { create: true, view: true, edit: true, delete: true },
          "items": { create: true, view: true, edit: true, delete: true },
          "recommendations": { create: true, view: true, edit: true, delete: true },
          "discussions": { create: true, view: true, edit: true, delete: true },
          "insights": { create: true, view: true, edit: true, delete: true },
          "inquiries": { create: true, view: true, edit: true, delete: true },
          "notices": { create: true, view: true, edit: true, delete: true },
          "faqs": { create: true, view: true, edit: true, delete: true },
          "banners": { create: true, view: true, edit: true, delete: true },
          "keywords": { create: true, view: true, edit: true, delete: true },
          "statistics": { create: true, view: true, edit: true, delete: true },
          "operators": { create: true, view: true, edit: true, delete: true },
          "groups": { create: true, view: true, edit: true, delete: true }
        };
        
        await upsertMenuPermissionGroup(groupId, "관리자", allMenuPermissions);
      }
      
      alert("테스트 그룹이 생성되었습니다. 그룹명: 관리자 (모든 권한 포함)");
    } catch (error) {
      console.error("Error creating test group:", error);
      alert("테스트 그룹 생성 중 오류가 발생했습니다.");
    }
  };

  // 테스트용 그룹 삭제 함수
  const deleteTestGroup = async () => {
    try {
      // 관리자 그룹 찾기
      const adminGroup = groups.find(g => g.name === "관리자");
      if (!adminGroup) {
        alert("삭제할 테스트 그룹(관리자)을 찾을 수 없습니다.");
        return;
      }

      // 해당 그룹에 속한 운영자가 있는지 확인
      const groupOperators = operators.filter(op => op.role === adminGroup.id);
      if (groupOperators.length > 0) {
        alert(`해당 그룹에 ${groupOperators.length}명의 운영자가 있습니다. 먼저 운영자를 다른 그룹으로 이동하거나 삭제해주세요.`);
        return;
      }

      if (confirm("테스트용 그룹(관리자)을 삭제하시겠습니까? 관련된 메뉴 권한도 함께 삭제됩니다.")) {
        await deleteGroup(adminGroup.id!);
        await loadGroups();
        alert("테스트용 그룹이 삭제되었습니다.");
      }
    } catch (error) {
      console.error("Error deleting test group:", error);
      alert("테스트 그룹 삭제 중 오류가 발생했습니다.");
    }
  };

  // 그룹에 멤버 추가
  const handleAddMember = async (operatorId: string) => {
    try {
      if (selectedGroup) {
        await updateOperator(operatorId, { role: selectedGroup.id! });
        await loadGroups(); // 데이터 새로고침
      }
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  // 그룹에서 멤버 제거
  const handleRemoveMember = async (operatorId: string) => {
    try {
      // 그룹에서 제거할 때는 빈 문자열이나 기본값으로 설정
      await updateOperator(operatorId, { role: "" });
      await loadGroups(); // 데이터 새로고침
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  // 필터링 없이 모든 그룹 표시
  const filteredGroups = groups;

  // 그룹별 멤버 수 계산
  const getMemberCount = (groupId: string) => {
    return operators.filter(operator => operator.role === groupId).length;
  };

  const getMemberCountBadge = (count: number) => {
    if (count === 0) {
      return <Badge variant="outline">0명</Badge>;
    } else if (count < 5) {
      return <Badge variant="secondary">{count}명</Badge>;
    } else {
      return <Badge variant="default">{count}명</Badge>;
    }
  };

  // 그룹별 메뉴 권한 정보 가져오기
  const getGroupMenuPermissions = (groupId: string) => {
    const permissionGroup = menuPermissionGroups.find(pg => pg.groupId === groupId);
    if (!permissionGroup) return [];

    // 권한이 있는 메뉴들만 필터링
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

    return menuItems
      .filter(menu => {
        const permissions = permissionGroup.permissions[menu.key];
        return permissions && (permissions.create || permissions.view || permissions.edit || permissions.delete);
      })
      .map(menu => ({
        ...menu,
        permissions: permissionGroup.permissions[menu.key]
      }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">그룹관리</h1>
          <p className="text-gray-600 mt-2">운영자 역할을 등록하고 관리하세요</p>
        </div>


        {/* 통계 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>그룹 현황</CardTitle>
            <CardDescription>그룹 관리 현황을 한눈에 확인하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{groups.length}</div>
                <div className="text-sm text-gray-600">총 그룹 수</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {groups.filter(g => g.status === "active").length}
                </div>
                <div className="text-sm text-gray-600">활성 그룹</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{operators.length}</div>
                <div className="text-sm text-gray-600">총 멤버 수</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {groups.length > 0 ? Math.round(operators.length / groups.length) : 0}
                </div>
                <div className="text-sm text-gray-600">평균 멤버 수</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 그룹 목록 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>그룹 목록</CardTitle>
                <CardDescription>총 {filteredGroups.length}개의 그룹</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={createTestGroup}
                  variant="outline"
                >
                  테스트 그룹 생성
                </Button>
                <Button 
                  onClick={deleteTestGroup}
                  variant="destructive"
                >
                  테스트 그룹 삭제
                </Button>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                  if (!open) {
                    handleCloseDialog();
                  } else {
                    setIsDialogOpen(true);
                  }
                }}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingGroup(null);
                    setFormData({
                      name: "",
                      description: "",
                      permissions: {},
                      status: "active"
                    });
                  }}>
                    신규 그룹 등록
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingGroup ? "그룹 수정" : "신규 그룹 등록"}</DialogTitle>
                    <DialogDescription>
                      {editingGroup ? "그룹 정보를 수정하세요" : "새로운 운영자 그룹을 등록하세요"}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="groupName">그룹명</Label>
                      <Input 
                        id="groupName" 
                        placeholder="그룹명을 입력하세요" 
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">설명</Label>
                      <Textarea 
                        id="description" 
                        placeholder="그룹에 대한 설명을 입력하세요"
                        className="min-h-[80px]"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">상태</Label>
                      <select 
                        id="status"
                        value={formData.status}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as "active" | "inactive" }))}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      >
                        <option value="active">활성</option>
                        <option value="inactive">비활성</option>
                      </select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={handleCloseDialog}>취소</Button>
                      <Button type="submit">{editingGroup ? "수정" : "등록"}</Button>
                    </div>
                  </form>
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
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NO</TableHead>
                  <TableHead>그룹 코드</TableHead>
                  <TableHead>그룹명</TableHead>
                  <TableHead>설명</TableHead>
                  <TableHead>멤버 수</TableHead>
                  <TableHead>권한</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGroups
                  .sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime())
                  .map((group, index) => (
                  <TableRow key={group.id}>
                    <TableCell>{filteredGroups.length - index}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{group.id?.substring(0, 8) || 'N/A'}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{group.name}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={group.description}>
                        {group.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getMemberCountBadge(getMemberCount(group.id!))}
                    </TableCell>
                    <TableCell>
                      <div 
                        className="flex flex-wrap gap-1 max-w-xs cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                        onClick={() => handlePermissionDetail(group)}
                      >
                        {getGroupMenuPermissions(group.id!).length > 0 ? (
                          getGroupMenuPermissions(group.id!).slice(0, 3).map((menu, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {menu.name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-400 text-xs">권한 없음</span>
                        )}
                        {getGroupMenuPermissions(group.id!).length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{getGroupMenuPermissions(group.id!).length - 3}
                          </Badge>
                        )}
                        <div className="text-xs text-gray-400 ml-1">클릭하여 상세보기</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant={group.status === "active" ? "default" : "secondary"}
                        size="sm"
                        onClick={() => handleToggleStatus(group.id!, group.status)}
                        className="min-w-[80px]"
                      >
                        {group.status === "active" ? "활성" : "비활성"}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(group)}
                        >
                          수정
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleMemberManagement(group)}
                        >
                          멤버 관리
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            )}
          </CardContent>
        </Card>

        {/* 멤버 관리 다이얼로그 */}
        <Dialog open={isMemberDialogOpen} onOpenChange={setIsMemberDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>멤버 관리 - {selectedGroup?.name}</DialogTitle>
              <DialogDescription>
                그룹에 멤버를 추가하거나 제거할 수 있습니다
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* 현재 그룹 멤버 */}
              <div>
                <h4 className="font-medium mb-2">현재 그룹 멤버</h4>
                <div className="border rounded-lg p-4 max-h-40 overflow-y-auto">
                  {selectedGroup ? (
                    operators
                      .filter(operator => operator.role === selectedGroup.id)
                      .map(operator => (
                        <div key={operator.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                          <div>
                            <span className="font-medium">{operator.username}</span>
                            <span className="text-gray-500 ml-2">({operator.name})</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveMember(operator.id!)}
                          >
                            제거
                          </Button>
                        </div>
                      ))
                  ) : null}
                  {selectedGroup && operators.filter(operator => operator.role === selectedGroup.id).length === 0 && (
                    <p className="text-gray-500 text-center py-4">현재 그룹에 멤버가 없습니다</p>
                  )}
                </div>
              </div>

              {/* 사용 가능한 멤버 */}
              <div>
                <h4 className="font-medium mb-2">사용 가능한 멤버</h4>
                <div className="border rounded-lg p-4 max-h-40 overflow-y-auto">
                  {selectedGroup ? (
                    operators
                      .filter(operator => operator.role !== selectedGroup.id)
                      .map(operator => (
                        <div key={operator.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                          <div>
                            <span className="font-medium">{operator.username}</span>
                            <span className="text-gray-500 ml-2">({operator.name})</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddMember(operator.id!)}
                          >
                            추가
                          </Button>
                        </div>
                      ))
                  ) : null}
                  {selectedGroup && operators.filter(operator => operator.role !== selectedGroup.id).length === 0 && (
                    <p className="text-gray-500 text-center py-4">추가할 수 있는 멤버가 없습니다</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={handleCloseMemberDialog}>
                닫기
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* 권한 상세 다이얼로그 */}
        <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>권한 상세 - {selectedGroupForPermission?.name}</DialogTitle>
              <DialogDescription>
                그룹에 설정된 메뉴 권한을 상세히 확인할 수 있습니다
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto space-y-4">
              {selectedGroupForPermission && getGroupMenuPermissions(selectedGroupForPermission.id!).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getGroupMenuPermissions(selectedGroupForPermission.id!).map((menu, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="font-medium text-lg mb-3">{menu.name}</div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">생성 권한</span>
                          <Badge variant={menu.permissions.create ? "default" : "outline"}>
                            {menu.permissions.create ? "허용" : "거부"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">조회 권한</span>
                          <Badge variant={menu.permissions.view ? "default" : "outline"}>
                            {menu.permissions.view ? "허용" : "거부"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">수정 권한</span>
                          <Badge variant={menu.permissions.edit ? "default" : "outline"}>
                            {menu.permissions.edit ? "허용" : "거부"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">삭제 권한</span>
                          <Badge variant={menu.permissions.delete ? "default" : "outline"}>
                            {menu.permissions.delete ? "허용" : "거부"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-lg">설정된 권한이 없습니다</div>
                  <div className="text-gray-400 text-sm mt-2">
                    메뉴 권한 관리에서 권한을 설정해주세요
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
              <Button variant="outline" onClick={handleClosePermissionDialog}>
                닫기
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
