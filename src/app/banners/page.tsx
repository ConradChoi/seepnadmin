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
import { Textarea } from "@/components/ui/textarea";

export default function BannersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("all");

  // 샘플 데이터 (최근 등록자가 위로 오도록 정렬 - 등록일 기준 내림차순)
  const banners = [
    {
      id: 5,
      title: "의료용품 공급업체 특별 이벤트",
      position: "헤더",
      imageUrl: "/banners/medical.jpg",
      linkUrl: "/events/medical-supplier",
      status: "active",
      startDate: "2024-01-22",
      endDate: "2024-02-22",
      order: 1,
      clickCount: 1250
    },
    {
      id: 4,
      title: "신규 기능 소개",
      position: "메뉴",
      imageUrl: "/banners/features.jpg",
      linkUrl: "/features",
      status: "scheduled",
      startDate: "2024-02-01",
      endDate: "2024-02-28",
      order: 2,
      clickCount: 0
    },
    {
      id: 3,
      title: "시스템 점검 안내",
      position: "헤더",
      imageUrl: "/banners/maintenance.jpg",
      linkUrl: "/notices/maintenance",
      status: "inactive",
      startDate: "2024-01-20",
      endDate: "2024-01-21",
      order: 3,
      clickCount: 567
    },
    {
      id: 2,
      title: "프리미엄 서비스 안내",
      position: "메뉴",
      imageUrl: "/banners/premium.jpg",
      linkUrl: "/services/premium",
      status: "active",
      startDate: "2024-01-15",
      endDate: "2024-12-31",
      order: 4,
      clickCount: 890
    },
    {
      id: 1,
      title: "신규 공급업체 등록 이벤트",
      position: "헤더",
      imageUrl: "/banners/event1.jpg",
      linkUrl: "/events/new-supplier",
      status: "active",
      startDate: "2024-01-10",
      endDate: "2024-01-31",
      order: 5,
      clickCount: 1250
    }
  ];

  const filteredBanners = banners.filter(banner => {
    const matchesSearch = banner.title.includes(searchTerm);
    const matchesPosition = positionFilter === "all" || banner.position === positionFilter;
    return matchesSearch && matchesPosition;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">활성</Badge>;
      case "inactive":
        return <Badge variant="secondary">비활성</Badge>;
      case "scheduled":
        return <Badge variant="outline">예약됨</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const positions = ["헤더", "메뉴", "사이드바", "푸터"];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">배너 관리</h1>
          <p className="text-gray-600 mt-2">헤더 상단과 메뉴 배너를 관리하세요</p>
        </div>

        {/* 검색 및 필터 */}
        <Card>
          <CardHeader>
            <CardTitle>검색 및 필터</CardTitle>
            <CardDescription>배너를 검색하고 위치별로 필터링하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search">검색</Label>
                <Input
                  id="search"
                  placeholder="배너 제목"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="position">위치</Label>
                <Select value={positionFilter} onValueChange={setPositionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="위치 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    {positions.map(position => (
                      <SelectItem key={position} value={position}>{position}</SelectItem>
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

        {/* 배너 목록 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>배너 목록</CardTitle>
                <CardDescription>총 {filteredBanners.length}개의 배너</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>신규 배너 등록</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>신규 배너 등록</DialogTitle>
                    <DialogDescription>새로운 배너를 등록하세요</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">배너 제목</Label>
                      <Input id="title" placeholder="배너 제목" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="position">표시 위치</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="위치 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {positions.map(position => (
                              <SelectItem key={position} value={position}>{position}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="order">표시 순서</Label>
                        <Input id="order" type="number" placeholder="숫자가 작을수록 위에 표시" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="image">배너 이미지</Label>
                      <Input id="image" type="file" accept="image/*" />
                    </div>
                    <div>
                      <Label htmlFor="link">링크 URL</Label>
                      <Input id="link" placeholder="클릭 시 이동할 URL" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startDate">시작일</Label>
                        <Input id="startDate" type="date" />
                      </div>
                      <div>
                        <Label htmlFor="endDate">종료일</Label>
                        <Input id="endDate" type="date" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">설명</Label>
                      <Textarea id="description" placeholder="배너에 대한 설명" rows={3} />
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
                  <TableHead>제목</TableHead>
                  <TableHead>위치</TableHead>
                  <TableHead>이미지</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>기간</TableHead>
                  <TableHead>클릭수</TableHead>
                  <TableHead>작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBanners.map((banner, index) => (
                  <TableRow key={banner.id}>
                    <TableCell>{filteredBanners.length - index}</TableCell>
                    <TableCell className="font-medium">{banner.title}</TableCell>
                    <TableCell>{banner.position}</TableCell>
                    <TableCell>
                      <div className="w-20 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">
                        이미지
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(banner.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{banner.startDate}</div>
                        <div className="text-gray-500">~ {banner.endDate}</div>
                      </div>
                    </TableCell>
                    <TableCell>{banner.clickCount.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">상세</Button>
                        <Button variant="outline" size="sm">수정</Button>
                        {banner.status === "inactive" && (
                          <Button size="sm">활성화</Button>
                        )}
                        {banner.status === "active" && (
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
