"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  getOperators, 
  createOperator, 
  toggleOperatorStatus,
  deleteOperator,
  Operator 
} from "@/lib/operatorService";
import { getGroups, Group } from "@/lib/groupService";

export default function OperatorManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    role: "",
    department: "",
    status: "active" as "active" | "inactive"
  });

  // 데이터 로딩
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [operatorsData, groupsData] = await Promise.all([
        getOperators(),
        getGroups()
      ]);
      setOperators(operatorsData);
      setGroups(groupsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOperators = async () => {
    try {
      const operatorsData = await getOperators();
      setOperators(operatorsData);
    } catch (error) {
      console.error('Error loading operators:', error);
    }
  };

  // 상태 토글 핸들러
  const handleToggleStatus = async (id: string, currentStatus: 'active' | 'inactive') => {
    try {
      await toggleOperatorStatus(id, currentStatus);
      await loadOperators(); // 데이터 새로고침
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createOperator(formData);
      
      // 폼 초기화
      setFormData({
        username: "",
        name: "",
        email: "",
        password: "",
        role: "",
        department: "",
        status: "active"
      });
      setIsDialogOpen(false);
      await loadOperators(); // 데이터 새로고침
    } catch (error) {
      console.error('Error creating operator:', error);
    }
  };

  // 테스트용 운영자 생성 함수
  const createTestOperator = async () => {
    try {
      // 관리자 그룹 찾기
      const adminGroup = groups.find(g => g.name === "관리자");
      if (!adminGroup) {
        alert("먼저 '관리자' 그룹을 생성해주세요.");
        return;
      }

      const testOperator = {
        username: "admin",
        name: "관리자",
        email: "admin@example.com",
        password: "admin123",
        role: adminGroup.id!,
        department: "IT",
        status: "active" as "active" | "inactive"
      };
      
      await createOperator(testOperator);
      await loadData();
      alert("테스트 운영자가 생성되었습니다. 아이디: admin, 비밀번호: admin123");
    } catch (error) {
      console.error("Error creating test operator:", error);
      alert("테스트 운영자 생성 중 오류가 발생했습니다.");
    }
  };

  // 테스트용 운영자 삭제 함수
  const deleteTestOperator = async () => {
    try {
      // admin 계정 찾기
      const adminOperator = operators.find(op => op.username === "admin");
      if (!adminOperator) {
        alert("삭제할 테스트 계정(admin)을 찾을 수 없습니다.");
        return;
      }

      if (confirm("테스트용 계정(admin)을 삭제하시겠습니까?")) {
        await deleteOperator(adminOperator.id!);
        await loadData();
        alert("테스트용 계정이 삭제되었습니다.");
      }
    } catch (error) {
      console.error("Error deleting test operator:", error);
      alert("테스트 계정 삭제 중 오류가 발생했습니다.");
    }
  };

  // 마스킹 함수들
  const maskUsername = (username: string) => {
    if (showPersonalInfo) return username;
    if (username.length <= 3) return username;
    return username.substring(0, 3) + '*'.repeat(username.length - 3);
  };

  const maskName = (name: string) => {
    if (showPersonalInfo) return name;
    if (name.length <= 1) return name;
    if (name.length === 2) {
      return name[0] + '*';
    }
    return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
  };

  const maskEmail = (email: string) => {
    if (showPersonalInfo) return email;
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 3) return email;
    const maskedLocal = localPart.substring(0, 3) + '*'.repeat(localPart.length - 3);
    return `${maskedLocal}@${domain}`;
  };


  const filteredOperators = operators.filter(operator => {
    const matchesSearch = operator.username.includes(searchTerm) || operator.name.includes(searchTerm) || operator.email.includes(searchTerm);
    const matchesRole = roleFilter === "all" || operator.role === roleFilter;
    return matchesSearch && matchesRole;
  });



  // 활성 그룹을 기반으로 roles 생성
  const roles = groups
    .filter(group => group.status === "active")
    .map(group => ({
      value: group.id || "",
      label: group.name
    }));


  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">운영자 관리</h1>
          <p className="text-gray-600 mt-2">시스템 운영자 계정을 관리하고 권한을 설정하세요</p>
        </div>

        {/* 검색 및 필터 */}
        <Card>
          <CardHeader>
            <CardTitle>검색 및 필터</CardTitle>
            <CardDescription>운영자를 검색하고 역할별로 필터링하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search">검색</Label>
                <Input
                  id="search"
                  placeholder="아이디, 이름 또는 이메일"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="role">그룹</Label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="그룹 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    {roles.map(role => (
                      <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button className="w-full">검색</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 운영자 목록 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>운영자 목록</CardTitle>
                <CardDescription>총 {filteredOperators.length}명의 운영자</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={showPersonalInfo ? "default" : "outline"}
                  onClick={() => setShowPersonalInfo(!showPersonalInfo)}
                >
                  {showPersonalInfo ? "개인정보 숨기기" : "개인정보보기"}
                </Button>
              <Button 
                onClick={createTestOperator}
                variant="outline"
                className="mr-2"
              >
                테스트 운영자 생성
              </Button>
              <Button 
                onClick={deleteTestOperator}
                variant="destructive"
                className="mr-2"
              >
                테스트 계정 삭제
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>신규 운영자 등록</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>신규 운영자 등록</DialogTitle>
                    <DialogDescription>새로운 운영자 계정을 생성하세요</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">이름</Label>
                      <Input 
                        id="name" 
                        placeholder="이름을 입력하세요." 
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">이메일</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="이메일 주소를 입력하세요." 
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="username">아이디</Label>
                      <Input 
                        id="username" 
                        placeholder="로그인 아이디" 
                        value={formData.username}
                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">비밀번호</Label>
                      <Input 
                        id="password" 
                        type="password"
                        placeholder="비밀번호를 입력하세요" 
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">그룹</Label>
                      <Select 
                        value={formData.role}
                        onValueChange={(value: string) => setFormData(prev => ({ ...prev, role: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="그룹 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map(role => (
                            <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="department">소속팀</Label>
                      <Input 
                        id="department" 
                        placeholder="소속팀을 입력하세요" 
                        value={formData.department}
                        onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">상태</Label>
                      <Select 
                        value={formData.status}
                        onValueChange={(value: "active" | "inactive") => setFormData(prev => ({ ...prev, status: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="상태 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">활성</SelectItem>
                          <SelectItem value="inactive">비활성</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>취소</Button>
                      <Button type="submit">등록</Button>
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
                  <TableHead>아이디</TableHead>
                  <TableHead>이름</TableHead>
                  <TableHead>이메일</TableHead>
                  <TableHead>그룹</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>마지막 로그인</TableHead>
                  <TableHead>등록일</TableHead>
                  <TableHead>작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOperators.map((operator, index) => (
                  <TableRow key={operator.id}>
                    <TableCell>{filteredOperators.length - index}</TableCell>
                    <TableCell className="font-medium">{maskUsername(operator.username)}</TableCell>
                    <TableCell>{maskName(operator.name)}</TableCell>
                    <TableCell>{maskEmail(operator.email)}</TableCell>
                    <TableCell>
                      {(() => {
                        const group = groups.find(g => g.id === operator.role);
                        return group ? group.name : operator.role;
                      })()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant={operator.status === "active" ? "default" : "secondary"}
                        size="sm"
                        onClick={() => handleToggleStatus(operator.id!, operator.status)}
                        disabled={operator.role === "super_admin"}
                        className="min-w-[80px]"
                      >
                        {operator.status === "active" ? "활성" : "비활성"}
                      </Button>
                    </TableCell>
                    <TableCell>{operator.lastLogin}</TableCell>
                    <TableCell>{operator.createDate}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">상세</Button>
                        <Button variant="outline" size="sm">수정</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
