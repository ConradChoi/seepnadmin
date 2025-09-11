"use client";

import { useState } from "react";
import AdminLayout from "@/components/layout/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function OperatorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // 샘플 데이터 (최근 등록자가 위로 오도록 정렬 - 등록일 기준 내림차순)
  const operators = [
    {
      id: 5,
      username: "newadmin",
      name: "정신규관리자",
      email: "newadmin@example.com",
      role: "admin",
      department: "마케팅팀",
      status: "active",
      lastLogin: "2024-01-22 16:45:30",
      createDate: "2024-01-22 14:30:25"
    },
    {
      id: 4,
      username: "reviewer1",
      name: "최검토자",
      email: "reviewer1@example.com",
      role: "reviewer",
      department: "검토팀",
      status: "inactive",
      lastLogin: "2024-01-20 11:22:18",
      createDate: "2024-01-20 10:15:30"
    },
    {
      id: 3,
      username: "operator1",
      name: "박운영자",
      email: "operator1@example.com",
      role: "operator",
      department: "고객지원팀",
      status: "active",
      lastLogin: "2024-01-18 16:45:12",
      createDate: "2024-01-18 14:30:25"
    },
    {
      id: 2,
      username: "manager1",
      name: "이매니저",
      email: "manager1@example.com",
      role: "admin",
      department: "운영팀",
      status: "active",
      lastLogin: "2024-01-15 09:30:45",
      createDate: "2024-01-15 08:20:15"
    },
    {
      id: 1,
      username: "admin",
      name: "김관리자",
      email: "admin@example.com",
      role: "super_admin",
      department: "시스템관리팀",
      status: "active",
      lastLogin: "2024-01-12 13:15:30",
      createDate: "2024-01-10 10:30:45"
    }
  ];

  const filteredOperators = operators.filter(operator => {
    const matchesSearch = operator.username.includes(searchTerm) || operator.name.includes(searchTerm) || operator.email.includes(searchTerm);
    const matchesRole = roleFilter === "all" || operator.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "super_admin":
        return <Badge variant="destructive">최고관리자</Badge>;
      case "admin":
        return <Badge variant="default">관리자</Badge>;
      case "operator":
        return <Badge variant="secondary">운영자</Badge>;
      case "reviewer":
        return <Badge variant="outline">검토자</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">활성</Badge>;
      case "inactive":
        return <Badge variant="secondary">비활성</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const roles = [
    { value: "super_admin", label: "최고관리자" },
    { value: "admin", label: "관리자" },
    { value: "operator", label: "운영자" },
    { value: "reviewer", label: "검토자" }
  ];

  const departments = ["시스템관리팀", "운영팀", "고객지원팀", "검토팀", "마케팅팀", "개발팀"];

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
                <Label htmlFor="role">역할</Label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="역할 선택" />
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button>신규 운영자 등록</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>신규 운영자 등록</DialogTitle>
                    <DialogDescription>새로운 운영자 계정을 생성하세요</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="username">아이디</Label>
                        <Input id="username" placeholder="로그인 아이디" />
                      </div>
                      <div>
                        <Label htmlFor="name">이름</Label>
                        <Input id="name" placeholder="실명" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">이메일</Label>
                      <Input id="email" type="email" placeholder="이메일 주소" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="role">역할</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="역할 선택" />
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
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="소속팀 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map(dept => (
                              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="password">비밀번호</Label>
                        <Input id="password" type="password" placeholder="초기 비밀번호" />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                        <Input id="confirmPassword" type="password" placeholder="비밀번호 재입력" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">취소</Button>
                      <Button>등록</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NO</TableHead>
                  <TableHead>아이디</TableHead>
                  <TableHead>이름</TableHead>
                  <TableHead>이메일</TableHead>
                  <TableHead>역할</TableHead>
                  <TableHead>소속팀</TableHead>
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
                    <TableCell className="font-medium">{operator.username}</TableCell>
                    <TableCell>{operator.name}</TableCell>
                    <TableCell>{operator.email}</TableCell>
                    <TableCell>{getRoleBadge(operator.role)}</TableCell>
                    <TableCell>{operator.department}</TableCell>
                    <TableCell>{getStatusBadge(operator.status)}</TableCell>
                    <TableCell>{operator.lastLogin}</TableCell>
                    <TableCell>{operator.createDate}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">상세</Button>
                        <Button variant="outline" size="sm">수정</Button>
                        <Button variant="outline" size="sm">권한설정</Button>
                        {operator.status === "inactive" && (
                          <Button size="sm">활성화</Button>
                        )}
                        {operator.status === "active" && (
                          <Button variant="destructive" size="sm">비활성화</Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
