"use client";

import { useState } from "react";
import AdminLayout from "@/components/layout/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function MembersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateType, setDateType] = useState("register"); // 등록일 or 최근 로그인일
  const [dateRange, setDateRange] = useState("all"); // 전체, 7일, 1개월, 3개월, 6개월, 1년, 직접입력
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showPersonalInfo, setShowPersonalInfo] = useState(false); // 개인정보보기 상태

  // 샘플 데이터 (최근 가입자가 위로 오도록 정렬 - 가입일시 기준 내림차순)
  const members = [
    { id: 6, name: "한새봄", email: "han@example.com", phone: "010-9999-8888", status: "active", joinDate: "2024-01-22 10:15:30", lastLogin: "2024-01-22 14:20:15" },
    { id: 5, name: "정현우", email: "jung@example.com", phone: "010-5678-9012", status: "suspended", joinDate: "2024-01-20 14:30:25", lastLogin: "2024-01-19 09:15:42" },
    { id: 4, name: "최지영", email: "choi@example.com", phone: "010-4567-8901", status: "active", joinDate: "2024-01-18 11:22:18", lastLogin: "2024-01-20 16:45:33" },
    { id: 3, name: "박민수", email: "park@example.com", phone: "010-3456-7890", status: "inactive", joinDate: "2024-01-15 16:45:12", lastLogin: "2024-01-14 13:20:55" },
    { id: 2, name: "이영희", email: "lee@example.com", phone: "010-2345-6789", status: "active", joinDate: "2024-01-12 09:30:45", lastLogin: "2024-01-20 10:25:18" },
    { id: 1, name: "김철수", email: "kim@example.com", phone: "010-1234-5678", status: "active", joinDate: "2024-01-10 13:15:30", lastLogin: "2024-01-19 15:40:22" },
  ];

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
    
    return { start: start.toISOString().split('T')[0], end: today.toISOString().split('T')[0] };
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.includes(searchTerm) || member.email.includes(searchTerm) || member.phone.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || member.status === statusFilter;
    
    // 날짜 필터링
    let matchesDate = true;
    if (dateRange !== "all") {
      let targetDate = "";
      if (dateType === "register") {
        targetDate = member.joinDate.split(' ')[0]; // 날짜 부분만 추출
      } else {
        targetDate = member.lastLogin.split(' ')[0]; // 날짜 부분만 추출
      }
      
      if (dateRange === "custom") {
        // 직접입력
        if (startDate && endDate) {
          matchesDate = targetDate >= startDate && targetDate <= endDate;
        }
      } else {
        // 미리 정의된 기간
        const range = getDateRange(dateRange);
        if (range) {
          matchesDate = targetDate >= range.start && targetDate <= range.end;
        }
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">정상</Badge>;
      case "inactive":
        return <Badge variant="secondary">중지</Badge>;
      case "suspended":
        return <Badge variant="destructive">탈퇴</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // 마스킹 함수들
  const maskEmail = (email: string) => {
    if (!showPersonalInfo) {
      const [localPart, domain] = email.split('@');
      if (localPart.length <= 2) {
        return `${localPart[0]}*@${domain}`;
      }
      return `${localPart.substring(0, 2)}***@${domain}`;
    }
    return email;
  };

  const maskName = (name: string) => {
    if (!showPersonalInfo) {
      if (name.length === 1) {
        return name;
      } else if (name.length === 2) {
        return `${name[0]}*`;
      } else {
        return `${name[0]}${'*'.repeat(name.length - 2)}${name[name.length - 1]}`;
      }
    }
    return name;
  };

  const maskPhone = (phone: string) => {
    if (!showPersonalInfo) {
      const parts = phone.split('-');
      if (parts.length === 3) {
        return `${parts[0]}-****-${parts[2]}`;
      }
      return phone;
    }
    return phone;
  };

  // 초기화 함수
  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateType("register");
    setDateRange("all");
    setStartDate("");
    setEndDate("");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">회원 관리</h1>
          <p className="text-gray-600 mt-2">서비스 이용 회원을 관리하고 모니터링하세요</p>
        </div>

        {/* 검색 및 필터 */}
        <Card>
          <CardHeader>
            <CardTitle>검색 및 필터</CardTitle>
            <CardDescription>회원을 검색하고 조건별로 필터링하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* 기간 검색 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="dateType">기간 검색</Label>
                  <Select value={dateType} onValueChange={setDateType}>
                    <SelectTrigger>
                      <SelectValue placeholder="기간 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="register">등록일</SelectItem>
                      <SelectItem value="login">최근 로그인일</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dateRange">기간 범위</Label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="기간 범위" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="7days">7일</SelectItem>
                      <SelectItem value="1month">1개월</SelectItem>
                      <SelectItem value="3months">3개월</SelectItem>
                      <SelectItem value="6months">6개월</SelectItem>
                      <SelectItem value="1year">1년</SelectItem>
                      <SelectItem value="custom">직접입력</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {dateRange === "custom" && (
                  <>
                    <div>
                      <Label htmlFor="startDate">시작일</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">종료일</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* 검색어 및 상태 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="search">검색어</Label>
                  <Input
                    id="search"
                    placeholder="이름, 이메일 또는 전화번호"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="status">상태</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="상태 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="active">정상</SelectItem>
                      <SelectItem value="inactive">중지</SelectItem>
                      <SelectItem value="suspended">탈퇴</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end gap-2">
                  <Button variant="outline" onClick={handleReset} className="flex-1">
                    초기화
                  </Button>
                  <Button className="flex-1">검색</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 회원 목록 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>회원 목록</CardTitle>
                <CardDescription>총 {filteredMembers.length}명의 회원</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={showPersonalInfo ? "default" : "outline"}
                  onClick={() => setShowPersonalInfo(!showPersonalInfo)}
                >
                  {showPersonalInfo ? "개인정보 숨기기" : "개인정보보기"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NO</TableHead>
                  <TableHead>이메일</TableHead>
                  <TableHead>이름</TableHead>
                  <TableHead>휴대번호</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>가입일시</TableHead>
                  <TableHead>최근로그인일시</TableHead>
                  <TableHead>작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member, index) => (
                    <TableRow key={member.id}>
                      <TableCell>{filteredMembers.length - index}</TableCell>
                      <TableCell className="font-medium">{maskEmail(member.email)}</TableCell>
                      <TableCell>{maskName(member.name)}</TableCell>
                      <TableCell>{maskPhone(member.phone)}</TableCell>
                      <TableCell>{getStatusBadge(member.status)}</TableCell>
                      <TableCell>{member.joinDate}</TableCell>
                      <TableCell>{member.lastLogin}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">상세</Button>
                          <Button variant="outline" size="sm">수정</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      검색된 데이터가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
