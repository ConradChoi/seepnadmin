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

export default function InsightsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // 샘플 데이터 (최근 등록자가 위로 오도록 정렬 - 발행일 기준 내림차순)
  const insights = [
    {
      id: 5,
      title: "의료용품 시장 동향 분석",
      category: "시장분석",
      author: "정분석가",
      status: "published",
      publishDate: "2024-01-22 14:30:25",
      viewCount: 1250,
      priority: "high"
    },
    {
      id: 4,
      title: "신규 등록 공급업체 소개",
      category: "소개",
      author: "최담당자",
      status: "scheduled",
      publishDate: "2024-01-20 10:15:30",
      viewCount: 0,
      priority: "low"
    },
    {
      id: 3,
      title: "분기별 공급업체 성과 리포트",
      category: "리포트",
      author: "박매니저",
      status: "published",
      publishDate: "2024-01-18 16:45:12",
      viewCount: 890,
      priority: "high"
    },
    {
      id: 2,
      title: "공급업체 신뢰도 평가 방법론",
      category: "가이드",
      author: "이연구원",
      status: "draft",
      publishDate: null,
      viewCount: 0,
      priority: "medium"
    },
    {
      id: 1,
      title: "2024년 전자제품 시장 트렌드 분석",
      category: "시장분석",
      author: "김분석가",
      status: "published",
      publishDate: "2024-01-15 09:30:45",
      viewCount: 1250,
      priority: "high"
    }
  ];

  const filteredInsights = insights.filter(insight => {
    const matchesSearch = insight.title.includes(searchTerm) || insight.author.includes(searchTerm);
    const matchesCategory = categoryFilter === "all" || insight.category === categoryFilter;
    return matchesSearch && matchesCategory;
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

  const categories = ["시장분석", "가이드", "리포트", "소개", "트렌드", "인터뷰"];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">인사이트 관리</h1>
          <p className="text-gray-600 mt-2">시장 분석과 인사이트 콘텐츠를 관리하세요</p>
        </div>

        {/* 검색 및 필터 */}
        <Card>
          <CardHeader>
            <CardTitle>검색 및 필터</CardTitle>
            <CardDescription>인사이트 콘텐츠를 검색하고 카테고리별로 필터링하세요</CardDescription>
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
                <Label htmlFor="category">카테고리</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
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

        {/* 인사이트 목록 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>인사이트 목록</CardTitle>
                <CardDescription>총 {filteredInsights.length}개의 인사이트 콘텐츠</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>신규 인사이트 작성</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>신규 인사이트 작성</DialogTitle>
                    <DialogDescription>새로운 인사이트 콘텐츠를 작성하세요</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">제목</Label>
                      <Input id="title" placeholder="인사이트 제목" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">카테고리</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="카테고리 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                    <div>
                      <Label htmlFor="content">내용</Label>
                      <Textarea id="content" placeholder="인사이트 내용" rows={8} />
                    </div>
                    <div>
                      <Label htmlFor="author">작성자</Label>
                      <Input id="author" placeholder="작성자명" />
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
                  <TableHead>카테고리</TableHead>
                  <TableHead>작성자</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>우선순위</TableHead>
                  <TableHead>발행일</TableHead>
                  <TableHead>조회수</TableHead>
                  <TableHead>작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInsights.map((insight, index) => (
                  <TableRow key={insight.id}>
                    <TableCell>{filteredInsights.length - index}</TableCell>
                    <TableCell className="font-medium">{insight.title}</TableCell>
                    <TableCell>{insight.category}</TableCell>
                    <TableCell>{insight.author}</TableCell>
                    <TableCell>{getStatusBadge(insight.status)}</TableCell>
                    <TableCell>{getPriorityBadge(insight.priority)}</TableCell>
                    <TableCell>{insight.publishDate || "-"}</TableCell>
                    <TableCell>{insight.viewCount.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">상세</Button>
                        <Button variant="outline" size="sm">수정</Button>
                        {insight.status === "draft" && (
                          <Button size="sm">발행</Button>
                        )}
                        {insight.status === "published" && (
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
