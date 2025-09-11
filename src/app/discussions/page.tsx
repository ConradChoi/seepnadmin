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

export default function DiscussionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // 샘플 데이터 (최근 등록자가 위로 오도록 정렬 - 작성일 기준 내림차순)
  const discussions = [
    {
      id: 5,
      title: "의료용품 공급업체 후기",
      author: "정회원",
      status: "active",
      replyCount: 12,
      viewCount: 189,
      createDate: "2024-01-22 16:45:30",
      lastReplyDate: "2024-01-22 18:20:15"
    },
    {
      id: 4,
      title: "부정적인 후기 공유",
      author: "최회원",
      status: "deleted",
      replyCount: 5,
      viewCount: 89,
      createDate: "2024-01-20 11:22:18",
      lastReplyDate: "2024-01-20 15:30:45"
    },
    {
      id: 3,
      title: "품목 검색 기능 개선 제안",
      author: "박회원",
      status: "active",
      replyCount: 23,
      viewCount: 445,
      createDate: "2024-01-18 14:30:25",
      lastReplyDate: "2024-01-20 10:15:30"
    },
    {
      id: 2,
      title: "신규 공급업체 등록 문의",
      author: "이회원",
      status: "locked",
      replyCount: 8,
      viewCount: 156,
      createDate: "2024-01-15 09:30:45",
      lastReplyDate: "2024-01-19 13:20:55"
    },
    {
      id: 1,
      title: "전자제품 공급업체 추천",
      author: "김회원",
      status: "active",
      replyCount: 15,
      viewCount: 234,
      createDate: "2024-01-12 13:15:30",
      lastReplyDate: "2024-01-20 16:45:33"
    }
  ];

  const filteredDiscussions = discussions.filter(discussion => {
    const matchesSearch = discussion.title.includes(searchTerm) || discussion.author.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || discussion.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">활성</Badge>;
      case "locked":
        return <Badge variant="secondary">잠김</Badge>;
      case "deleted":
        return <Badge variant="destructive">삭제됨</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">자유 토론방 관리</h1>
          <p className="text-gray-600 mt-2">사용자 간 토론 게시글을 관리하고 모니터링하세요</p>
        </div>

        {/* 검색 및 필터 */}
        <Card>
          <CardHeader>
            <CardTitle>검색 및 필터</CardTitle>
            <CardDescription>토론 게시글을 검색하고 상태별로 필터링하세요</CardDescription>
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
                    <SelectItem value="active">활성</SelectItem>
                    <SelectItem value="locked">잠김</SelectItem>
                    <SelectItem value="deleted">삭제됨</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button className="w-full">검색</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 토론 목록 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>토론 목록</CardTitle>
                <CardDescription>총 {filteredDiscussions.length}개의 토론 게시글</CardDescription>
              </div>
              <Button variant="outline">새 공지사항 작성</Button>
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
                  <TableHead>댓글수</TableHead>
                  <TableHead>조회수</TableHead>
                  <TableHead>작성일</TableHead>
                  <TableHead>마지막 댓글</TableHead>
                  <TableHead>작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDiscussions.map((discussion, index) => (
                  <TableRow key={discussion.id}>
                    <TableCell>{filteredDiscussions.length - index}</TableCell>
                    <TableCell className="font-medium">{discussion.title}</TableCell>
                    <TableCell>{discussion.author}</TableCell>
                    <TableCell>{getStatusBadge(discussion.status)}</TableCell>
                    <TableCell>{discussion.replyCount}</TableCell>
                    <TableCell>{discussion.viewCount.toLocaleString()}</TableCell>
                    <TableCell>{discussion.createDate}</TableCell>
                    <TableCell>{discussion.lastReplyDate}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">상세</Button>
                        {discussion.status === "active" && (
                          <Button variant="secondary" size="sm">잠금</Button>
                        )}
                        {discussion.status === "locked" && (
                          <Button size="sm">해제</Button>
                        )}
                        <Button variant="destructive" size="sm">삭제</Button>
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
