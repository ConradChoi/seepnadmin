"use client";

import AdminLayout from "@/components/layout/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function StatisticsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">통계</h1>
          <p className="text-gray-600 mt-2">서비스 이용 현황과 성과를 분석하세요</p>
        </div>

        {/* 기간 선택 */}
        <Card>
          <CardHeader>
            <CardTitle>기간 선택</CardTitle>
            <CardDescription>분석할 기간을 선택하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-center">
              <Select defaultValue="month">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">주간</SelectItem>
                  <SelectItem value="month">월간</SelectItem>
                  <SelectItem value="quarter">분기</SelectItem>
                  <SelectItem value="year">연간</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">2024년 1월</Button>
              <Button variant="outline">이전 기간</Button>
              <Button variant="outline">다음 기간</Button>
            </div>
          </CardContent>
        </Card>

        {/* 주요 지표 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 방문자</CardTitle>
              <Badge variant="secondary">+12%</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45,231</div>
              <p className="text-xs text-muted-foreground">지난 달 대비</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">신규 회원</CardTitle>
              <Badge variant="secondary">+8%</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,350</div>
              <p className="text-xs text-muted-foreground">지난 달 대비</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">검색 건수</CardTitle>
              <Badge variant="secondary">+23%</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89,123</div>
              <p className="text-xs text-muted-foreground">지난 달 대비</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">전환율</CardTitle>
              <Badge variant="secondary">+5%</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.2%</div>
              <p className="text-xs text-muted-foreground">지난 달 대비</p>
            </CardContent>
          </Card>
        </div>

        {/* 상세 통계 */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">사용자</TabsTrigger>
            <TabsTrigger value="suppliers">공급업체</TabsTrigger>
            <TabsTrigger value="search">검색</TabsTrigger>
            <TabsTrigger value="revenue">매출</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>회원 가입 추이</CardTitle>
                  <CardDescription>월별 신규 회원 가입 현황</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { month: "1월", count: 234, growth: "+15%" },
                      { month: "2월", count: 289, growth: "+23%" },
                      { month: "3월", count: 312, growth: "+8%" },
                      { month: "4월", count: 298, growth: "-4%" },
                      { month: "5월", count: 345, growth: "+16%" },
                      { month: "6월", count: 378, growth: "+10%" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">{item.month}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">{item.count}</span>
                          <Badge variant={item.growth.startsWith('+') ? "default" : "destructive"}>
                            {item.growth}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>사용자 활동 분석</CardTitle>
                  <CardDescription>일별 활성 사용자 현황</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { day: "월요일", active: 1234, total: 2345 },
                      { day: "화요일", active: 1345, total: 2456 },
                      { day: "수요일", active: 1456, total: 2567 },
                      { day: "목요일", active: 1567, total: 2678 },
                      { day: "금요일", active: 1678, total: 2789 },
                      { day: "토요일", active: 890, total: 1234 },
                      { day: "일요일", active: 789, total: 1123 }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">{item.day}</span>
                        <div className="text-right">
                          <div className="font-bold">{item.active.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">/ {item.total.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="suppliers" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>공급업체 등록 현황</CardTitle>
                  <CardDescription>카테고리별 공급업체 등록 수</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { category: "전자제품", count: 234, growth: "+12%" },
                      { category: "기계장비", count: 189, growth: "+8%" },
                      { category: "화학제품", count: 156, growth: "+15%" },
                      { category: "건축자재", count: 123, growth: "+5%" },
                      { category: "의료용품", count: 98, growth: "+23%" },
                      { category: "식품", count: 87, growth: "+7%" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">{item.category}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">{item.count}</span>
                          <Badge variant="default">{item.growth}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>공급업체 승인 현황</CardTitle>
                  <CardDescription>승인 상태별 현황</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { status: "승인됨", count: 567, percentage: "65%" },
                      { status: "검토중", count: 123, percentage: "14%" },
                      { status: "거절됨", count: 45, percentage: "5%" },
                      { status: "임시저장", count: 234, percentage: "16%" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">{item.status}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">{item.count}</span>
                          <span className="text-sm text-gray-500">({item.percentage})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="search" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>인기 검색어</CardTitle>
                  <CardDescription>가장 많이 검색된 키워드 TOP 10</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { keyword: "반도체", count: 1234, rank: 1 },
                      { keyword: "산업용 모터", count: 987, rank: 2 },
                      { keyword: "화학 원료", count: 876, rank: 3 },
                      { keyword: "건축 자재", count: 765, rank: 4 },
                      { keyword: "의료용품", count: 654, rank: 5 },
                      { keyword: "식품", count: 543, rank: 6 },
                      { keyword: "전자부품", count: 432, rank: 7 },
                      { keyword: "기계장비", count: 321, rank: 8 },
                      { keyword: "소재", count: 210, rank: 9 },
                      { keyword: "도구", count: 198, rank: 10 }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{item.rank}</Badge>
                          <span className="font-medium">{item.keyword}</span>
                        </div>
                        <span className="text-lg font-bold">{item.count.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>검색 성과 분석</CardTitle>
                  <CardDescription>검색 결과 클릭률 및 전환율</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { metric: "총 검색 건수", value: "89,123", change: "+23%" },
                      { metric: "검색 결과 클릭", value: "12,345", change: "+18%" },
                      { metric: "클릭률", value: "13.9%", change: "+2.1%" },
                      { metric: "전환율", value: "3.2%", change: "+0.5%" },
                      { metric: "평균 체류시간", value: "2분 34초", change: "+12%" },
                      { metric: "이탈률", value: "67.8%", change: "-3.2%" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">{item.metric}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">{item.value}</span>
                          <Badge variant={item.change.startsWith('+') ? "default" : "destructive"}>
                            {item.change}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>매출 현황</CardTitle>
                  <CardDescription>월별 매출 및 성장률</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { month: "1월", revenue: 12340000, growth: "+15%" },
                      { month: "2월", revenue: 14560000, growth: "+18%" },
                      { month: "3월", revenue: 16780000, growth: "+15%" },
                      { month: "4월", revenue: 18990000, growth: "+13%" },
                      { month: "5월", revenue: 21230000, growth: "+12%" },
                      { month: "6월", revenue: 23450000, growth: "+10%" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">{item.month}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">{(item.revenue / 10000).toFixed(0)}만원</span>
                          <Badge variant="default">{item.growth}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>서비스별 매출</CardTitle>
                  <CardDescription>서비스 유형별 매출 비중</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { service: "프리미엄 검색", revenue: 45, percentage: "45%" },
                      { service: "광고 서비스", revenue: 32, percentage: "32%" },
                      { service: "데이터 분석", revenue: 15, percentage: "15%" },
                      { service: "기타 서비스", revenue: 8, percentage: "8%" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">{item.service}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">{item.revenue}%</span>
                          <span className="text-sm text-gray-500">({item.percentage})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
