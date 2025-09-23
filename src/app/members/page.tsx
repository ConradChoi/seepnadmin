"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/layout/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { getMembers, subscribeToMembers, updateMemberStatus, Member, MemberFilterOptions, MemberStatus } from "@/lib/memberService";

export default function MembersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<MemberStatus | "all">("all");
  const [dateType, setDateType] = useState<"register" | "login">("register"); // 등록일 or 최근 로그인일
  const [dateRange, setDateRange] = useState("all"); // 전체, 7일, 1개월, 3개월, 6개월, 1년, 직접입력
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showPersonalInfo, setShowPersonalInfo] = useState(false); // 개인정보보기 상태
  
  // Firebase 데이터 상태
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unsubscribe, setUnsubscribe] = useState<(() => void) | null>(null);
  const [updating, setUpdating] = useState<string | null>(null); // 업데이트 중인 회원 ID

  // Firebase에서 회원 데이터 가져오기 (일회성)
  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filterOptions: MemberFilterOptions = {
        searchTerm: searchTerm || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
        dateType,
        dateRange: dateRange === "all" ? undefined : dateRange,
        startDate: dateRange === "custom" ? startDate : undefined,
        endDate: dateRange === "custom" ? endDate : undefined,
      };
      
      const membersData = await getMembers(filterOptions);
      setMembers(membersData);
    } catch (err) {
      console.error('Error fetching members:', err);
      setError('회원 데이터를 가져오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 실시간 구독 설정
  const setupRealtimeSubscription = () => {
    // 기존 구독 해제
    if (unsubscribe) {
      unsubscribe();
    }

    const filterOptions: MemberFilterOptions = {
      searchTerm: searchTerm || undefined,
      status: statusFilter === "all" ? undefined : statusFilter,
      dateType,
      dateRange: dateRange === "all" ? undefined : dateRange,
      startDate: dateRange === "custom" ? startDate : undefined,
      endDate: dateRange === "custom" ? endDate : undefined,
    };

    const unsubscribeFn = subscribeToMembers((membersData) => {
      setMembers(membersData);
      setLoading(false);
      setError(null);
    }, filterOptions);

    if (unsubscribeFn) {
      setUnsubscribe(() => unsubscribeFn);
    } else {
      // 실시간 구독이 실패한 경우 일회성 데이터 가져오기로 폴백
      fetchMembers();
    }
  };

  // 컴포넌트 마운트 시 실시간 구독 설정
  useEffect(() => {
    setupRealtimeSubscription();

    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // 필터 변경 시 실시간 구독 재설정
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setupRealtimeSubscription();
    }, 300); // 300ms 디바운스

    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter, dateType, dateRange, startDate, endDate]);

  // 상세 페이지로 이동
  const handleViewDetail = (memberId: string) => {
    router.push(`/members/${memberId}`);
  };

  // 회원 상태 업데이트
  const handleStatusUpdate = async (memberId: string, newStatus: MemberStatus) => {
    try {
      setUpdating(memberId);
      console.log('Updating member status:', memberId, newStatus);
      await updateMemberStatus(memberId, newStatus);
      console.log('Member status updated successfully');
      // 실시간 구독이 자동으로 데이터를 업데이트하므로 별도로 fetchMembers 호출 불필요
    } catch (err) {
      console.error('Error updating member status:', err);
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(`회원 상태를 업데이트하는 중 오류가 발생했습니다: ${errorMessage}`);
    } finally {
      setUpdating(null);
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
        return `${name[0]}${'*'.repeat(Math.max(0, name.length - 2))}${name[name.length - 1]}`;
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

  // 날짜 포맷팅 함수
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
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
                  <Select value={dateType} onValueChange={(value: "register" | "login") => setDateType(value)}>
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
                  <Select value={statusFilter} onValueChange={(value: MemberStatus | "all") => setStatusFilter(value)}>
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

        {/* 에러 메시지 */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* 회원 목록 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>회원 목록</CardTitle>
                <CardDescription>
                  {loading ? "로딩 중..." : `총 ${members.length}명의 회원`}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={showPersonalInfo ? "default" : "outline"}
                  onClick={() => setShowPersonalInfo(!showPersonalInfo)}
                >
                  {showPersonalInfo ? "개인정보 숨기기" : "개인정보보기"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={setupRealtimeSubscription}
                  disabled={loading}
                >
                  새로고침
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
              </div>
            ) : (
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
                  {members.length > 0 ? (
                    members.map((member, index) => (
                      <TableRow key={member.id}>
                        <TableCell>{members.length - index}</TableCell>
                        <TableCell className="font-medium">{maskEmail(member.email)}</TableCell>
                        <TableCell>{maskName(member.name)}</TableCell>
                        <TableCell>{maskPhone(member.phone)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Select
                              value={member.status}
                              onValueChange={(value: MemberStatus) => handleStatusUpdate(member.id, value)}
                              disabled={updating === member.id}
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">정상</SelectItem>
                                <SelectItem value="inactive">중지</SelectItem>
                                <SelectItem value="suspended">탈퇴</SelectItem>
                              </SelectContent>
                            </Select>
                            {updating === member.id && (
                              <div className="text-xs text-gray-500">업데이트 중...</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{formatDateTime(member.joinDate)}</TableCell>
                        <TableCell>{formatDateTime(member.lastLogin)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDetail(member.id)}
                            >
                              상세
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        {error ? "데이터를 불러올 수 없습니다." : "검색된 데이터가 없습니다."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
