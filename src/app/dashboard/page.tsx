"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getMembers } from "@/lib/memberService";

interface MemberStats {
  total: number;
  active: number;
  suspended: number;
  inactive: number;
}

export default function DashboardPage() {
  const [memberStats, setMemberStats] = useState<MemberStats>({
    total: 0,
    active: 0,
    suspended: 0,
    inactive: 0
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 모든 회원 데이터 가져오기
        const allMembers = await getMembers();
        
        // 회원 상태별 통계 계산
        const stats: MemberStats = {
          total: allMembers.length,
          active: allMembers.filter(member => member.status === 'active').length,
          suspended: allMembers.filter(member => member.status === 'suspended').length,
          inactive: allMembers.filter(member => member.status === 'inactive').length
        };
        
        setMemberStats(stats);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
          <p className="text-gray-600 mt-2">공급사 검색 서비스 현황을 한눈에 확인하세요</p>
        </div>

        {/* 회원 상태별 통계 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 총 회원 수 */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 회원 수</CardTitle>
              <Badge variant="secondary">실시간</Badge>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-2xl font-bold text-gray-400">로딩 중...</div>
              ) : error ? (
                <div className="text-2xl font-bold text-red-500">오류</div>
              ) : (
                <div className="text-2xl font-bold text-blue-600">{memberStats.total.toLocaleString()}</div>
              )}
              <p className="text-xs text-muted-foreground">전체 등록된 회원</p>
            </CardContent>
          </Card>

          {/* 정상 회원 수 */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">정상 회원 수</CardTitle>
              <Badge variant="default" className="bg-green-100 text-green-800">활성</Badge>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-2xl font-bold text-gray-400">로딩 중...</div>
              ) : error ? (
                <div className="text-2xl font-bold text-red-500">오류</div>
              ) : (
                <div className="text-2xl font-bold text-green-600">{memberStats.active.toLocaleString()}</div>
              )}
              <p className="text-xs text-muted-foreground">활성 상태 회원</p>
            </CardContent>
          </Card>

          {/* 정지 회원 수 */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">정지 회원 수</CardTitle>
              <Badge variant="destructive">정지</Badge>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-2xl font-bold text-gray-400">로딩 중...</div>
              ) : error ? (
                <div className="text-2xl font-bold text-red-500">오류</div>
              ) : (
                <div className="text-2xl font-bold text-red-600">{memberStats.suspended.toLocaleString()}</div>
              )}
              <p className="text-xs text-muted-foreground">정지된 회원</p>
            </CardContent>
          </Card>

          {/* 탈퇴 회원 수 */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">탈퇴 회원 수</CardTitle>
              <Badge variant="outline">비활성</Badge>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-2xl font-bold text-gray-400">로딩 중...</div>
              ) : error ? (
                <div className="text-2xl font-bold text-red-500">오류</div>
              ) : (
                <div className="text-2xl font-bold text-gray-600">{memberStats.inactive.toLocaleString()}</div>
              )}
              <p className="text-xs text-muted-foreground">비활성 상태 회원</p>
            </CardContent>
          </Card>
        </div>

        {/* 기타 통계 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">등록된 공급사</CardTitle>
              <Badge variant="secondary">+8%</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">567</div>
              <p className="text-xs text-muted-foreground">지난 달 대비</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">오늘의 검색</CardTitle>
              <Badge variant="secondary">+23%</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,890</div>
              <p className="text-xs text-muted-foreground">어제 대비</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">신규 문의</CardTitle>
              <Badge variant="destructive">5건</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">처리 대기 중</p>
            </CardContent>
          </Card>
        </div>

        {/* 시스템 알림 */}
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>시스템 알림</CardTitle>
              <CardDescription>최근 시스템 알림 및 공지사항</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { title: "서버 점검 안내", type: "info", date: "2024-01-15" },
                  { title: "신규 기능 업데이트", type: "success", date: "2024-01-14" },
                  { title: "보안 패치 적용", type: "warning", date: "2024-01-13" },
                ].map((notice, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Badge variant={notice.type as "default" | "secondary" | "destructive" | "outline"}>{notice.type}</Badge>
                      <span className="font-medium">{notice.title}</span>
                    </div>
                    <span className="text-sm text-gray-500">{notice.date}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
