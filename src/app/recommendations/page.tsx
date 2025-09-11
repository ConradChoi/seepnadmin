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

export default function RecommendationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // 샘플 데이터 (최근 등록자가 위로 오도록 정렬 - 발행일 기준 내림차순)
  const recommendations = [
    {
      id: 5,
      title: "신규 의료용품 공급업체 추천",
      content: "최근 등록된 의료용품 전문 공급업체를 추천합니다.",
      author: "정MD",
      status: "published",
      priority: "high",
      publishDate: "2024-01-22 15:30:25",
      viewCount: 1250
    },
    {
      id: 4,
      title: "특가 상품 추천",
      content: "한정 기간 특가 상품을 추천합니다.",
      author: "최MD",
      status: "scheduled",
      priority: "low",
      publishDate: "2024-01-20 10:15:30",
      viewCount: 0
    },
    {
      id: 3,
      title: "분기별 우수 공급업체 선정",
      content: "2024년 1분기 우수 공급업체를 발표합니다.",
      author: "박MD",
      status: "published",
      priority: "high",
      publishDate: "2024-01-18 14:20:15",
      viewCount: 890
    },
    {
      id: 2,
      title: "신규 등록 공급업체 특집",
      content: "최근 등록된 우수 공급업체들을 소개합니다.",
      author: "이MD",
      status: "draft",
      priority: "medium",
      publishDate: null,
      viewCount: 0
    },
    {
      id: 1,
      title: "2024년 최고의 전자제품 공급업체",
      content: "신뢰할 수 있는 전자제품 공급업체를 추천합니다.",
      author: "김MD",
      status: "published",
      priority: "high",
      publishDate: "2024-01-15 09:30:45",
      viewCount: 1250
    }
  ];

  const filteredRecommendations = recommendations.filter(rec => {
    const matchesSearch = rec.title.includes(searchTerm) || rec.author.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || rec.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge variant="default">발행됨</Badge>;
      case "draft":
        return <Badge variant="secondary">임시저장</Badge>;
      case "scheduled":
        return <Badge variant="outline">예약됨</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">높음</Badge>;
      case "medium":
        return <Badge variant="default">보통</Badge>;
      case "low":
        return <Badge variant="secondary">낮음</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">MD 추천 관리</h1>
          <p className="text-gray-600 mt-2">MD가 작성한 추천 콘텐츠를 관리하세요</p>
        </div>

        {/* 검색 및 필터 */}
        <Card>
          <CardHeader>
            <CardTitle>검색 및 필터</CardTitle>
            <CardDescription>추천 콘텐츠를 검색하고 상태별로 필터링하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search">검색</Label>
                <Input
                  id="search"
                  placeholder="제목 또는 작성자"
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
                    <SelectItem value="published">발행됨</SelectItem>
                    <SelectItem value="draft">임시저장</SelectItem>
                    <SelectItem value="scheduled">예약됨</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button className="w-full">검색</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 추천 목록 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>추천 목록</CardTitle>
                <CardDescription>총 {filteredRecommendations.length}개의 추천 콘텐츠</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>신규 추천 작성</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>신규 추천 작성</DialogTitle>
                    <DialogDescription>새로운 추천 콘텐츠를 작성하세요</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">제목</Label>
                      <Input id="title" placeholder="추천 제목" />
                    </div>
                    <div>
                      <Label htmlFor="content">내용</Label>
                      <Textarea id="content" placeholder="추천 내용" rows={5} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="author">작성자</Label>
                        <Input id="author" placeholder="MD 이름" />
                      </div>
                      <div>
                        <Label htmlFor="priority">우선순위</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="우선순위 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">높음</SelectItem>
                            <SelectItem value="medium">보통</SelectItem>
                            <SelectItem value="low">낮음</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">임시저장</Button>
                      <Button>발행</Button>
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
                  <TableHead>작성자</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>우선순위</TableHead>
                  <TableHead>발행일</TableHead>
                  <TableHead>조회수</TableHead>
                  <TableHead>작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecommendations.map((rec, index) => (
                  <TableRow key={rec.id}>
                    <TableCell>{filteredRecommendations.length - index}</TableCell>
                    <TableCell className="font-medium">{rec.title}</TableCell>
                    <TableCell>{rec.author}</TableCell>
                    <TableCell>{getStatusBadge(rec.status)}</TableCell>
                    <TableCell>{getPriorityBadge(rec.priority)}</TableCell>
                    <TableCell>{rec.publishDate || "-"}</TableCell>
                    <TableCell>{rec.viewCount.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">상세</Button>
                        <Button variant="outline" size="sm">수정</Button>
                        {rec.status === "draft" && (
                          <Button size="sm">발행</Button>
                        )}
                        {rec.status === "published" && (
                          <Button variant="destructive" size="sm">비공개</Button>
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
