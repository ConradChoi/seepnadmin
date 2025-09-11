import AdminLayout from "@/components/layout/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
          <p className="text-gray-600 mt-2">공급사 검색 서비스 현황을 한눈에 확인하세요</p>
        </div>

        {/* 통계 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 회원 수</CardTitle>
              <Badge variant="secondary">+12%</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">지난 달 대비</p>
            </CardContent>
          </Card>

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

        {/* 최근 활동 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>최근 가입한 회원</CardTitle>
              <CardDescription>최근 7일간 가입한 회원 목록</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "김철수", email: "kim@example.com", date: "2024-01-15" },
                  { name: "이영희", email: "lee@example.com", date: "2024-01-14" },
                  { name: "박민수", email: "park@example.com", date: "2024-01-13" },
                ].map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.email}</p>
                    </div>
                    <span className="text-sm text-gray-500">{member.date}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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
