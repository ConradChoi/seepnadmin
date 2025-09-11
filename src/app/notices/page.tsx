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

export default function NoticesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // 샘플 데이터 (최근 등록자가 위로 오도록 정렬 - 발행일 기준 내림차순)
  const notices = [
    {
      id: 5,
      title: "의료용품 공급업체 신규 등록 안내",
      category: "서비스",
      author: "운영팀",
      status: "published",
      priority: "high",
      publishDate: "2024-01-22 14:30:25",
      viewCount: 1250,
      isImportant: true
    },
    {
      id: 4,
      title: "연말연시 휴무 안내",
      category: "운영",
      author: "운영팀",
      status: "scheduled",
      priority: "low",
      publishDate: "2024-01-20 10:15:30",
      viewCount: 0,
      isImportant: false
    },
    {
      id: 3,
      title: "개인정보 처리방침 개정",
      category: "정책",
      author: "법무팀",
      status: "draft",
      priority: "high",
      publishDate: null,
      viewCount: 0,
      isImportant: true
    },
    {
      id: 2,
      title: "신규 기능 업데이트 안내",
      category: "서비스",
      author: "개발팀",
      status: "published",
      priority: "medium",
      publishDate: "2024-01-18 16:45:12",
      viewCount: 890,
      isImportant: false
    },
    {
      id: 1,
      title: "서비스 점검 안내",
      category: "시스템",
      author: "시스템관리자",
      status: "published",
      priority: "high",
      publishDate: "2024-01-15 09:30:45",
      viewCount: 1250,
      isImportant: true
    }
  ];

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.includes(searchTerm) || notice.author.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || notice.status === statusFilter;
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

  const categories = ["시스템", "서비스", "정책", "운영", "이벤트", "기타"];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">공지사항 관리</h1>
          <p className="text-gray-600 mt-2">시스템 공지사항을 작성하고 관리하세요</p>
        </div>

        {/* 검색 및 필터 */}
        <Card>
          <CardHeader>
            <CardTitle>검색 및 필터</CardTitle>
            <CardDescription>공지사항을 검색하고 상태별로 필터링하세요</CardDescription>
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

        {/* 공지사항 목록 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>공지사항 목록</CardTitle>
                <CardDescription>총 {filteredNotices.length}개의 공지사항</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>신규 공지사항 작성</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>신규 공지사항 작성</DialogTitle>
                    <DialogDescription>새로운 공지사항을 작성하세요</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">제목</Label>
                      <Input id="title" placeholder="공지사항 제목" />
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
                      <Textarea id="content" placeholder="공지사항 내용" rows={8} />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="important" className="rounded" />
                      <Label htmlFor="important">중요 공지사항으로 설정</Label>
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
                  <TableHead>중요</TableHead>
                  <TableHead>발행일</TableHead>
                  <TableHead>조회수</TableHead>
                  <TableHead>작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotices.map((notice, index) => (
                  <TableRow key={notice.id}>
                    <TableCell>{filteredNotices.length - index}</TableCell>
                    <TableCell className="font-medium">{notice.title}</TableCell>
                    <TableCell>{notice.category}</TableCell>
                    <TableCell>{notice.author}</TableCell>
                    <TableCell>{getStatusBadge(notice.status)}</TableCell>
                    <TableCell>{getPriorityBadge(notice.priority)}</TableCell>
                    <TableCell>
                      {notice.isImportant && <Badge variant="destructive">중요</Badge>}
                    </TableCell>
                    <TableCell>{notice.publishDate || "-"}</TableCell>
                    <TableCell>{notice.viewCount.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">상세</Button>
                        <Button variant="outline" size="sm">수정</Button>
                        {notice.status === "draft" && (
                          <Button size="sm">발행</Button>
                        )}
                        {notice.status === "published" && (
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
