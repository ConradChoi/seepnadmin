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

export default function InquiriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // 샘플 데이터 (최근 등록자가 위로 오도록 정렬 - 등록일 기준 내림차순)
  const inquiries = [
    {
      id: 5,
      title: "의료용품 공급업체 등록 문의",
      category: "등록문의",
      customer: "정고객",
      email: "jung@example.com",
      status: "pending",
      priority: "high",
      createDate: "2024-01-22 16:45:30",
      lastUpdate: "2024-01-22 16:45:30"
    },
    {
      id: 4,
      title: "기술 지원 요청",
      category: "기술지원",
      customer: "최고객",
      email: "choi@example.com",
      status: "pending",
      priority: "low",
      createDate: "2024-01-20 11:22:18",
      lastUpdate: "2024-01-20 11:22:18"
    },
    {
      id: 3,
      title: "결제 관련 문의",
      category: "결제문의",
      customer: "박고객",
      email: "park@example.com",
      status: "completed",
      priority: "high",
      createDate: "2024-01-18 14:30:25",
      lastUpdate: "2024-01-19 15:40:22"
    },
    {
      id: 2,
      title: "서비스 이용 방법 문의",
      category: "이용문의",
      customer: "이고객",
      email: "lee@example.com",
      status: "in_progress",
      priority: "medium",
      createDate: "2024-01-15 09:30:45",
      lastUpdate: "2024-01-16 10:25:18"
    },
    {
      id: 1,
      title: "공급업체 등록 문의",
      category: "등록문의",
      customer: "김고객",
      email: "kim@example.com",
      status: "pending",
      priority: "high",
      createDate: "2024-01-12 13:15:30",
      lastUpdate: "2024-01-12 13:15:30"
    }
  ];

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = inquiry.title.includes(searchTerm) || inquiry.customer.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || inquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">대기중</Badge>;
      case "in_progress":
        return <Badge variant="default">처리중</Badge>;
      case "completed":
        return <Badge variant="outline">완료</Badge>;
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

  // const categories = ["등록문의", "이용문의", "결제문의", "기술지원", "불만사항", "기타"];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">1:1 문의 관리</h1>
          <p className="text-gray-600 mt-2">고객 문의사항을 관리하고 답변을 처리하세요</p>
        </div>

        {/* 검색 및 필터 */}
        <Card>
          <CardHeader>
            <CardTitle>검색 및 필터</CardTitle>
            <CardDescription>문의사항을 검색하고 상태별로 필터링하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search">검색</Label>
                <Input
                  id="search"
                  placeholder="제목 또는 고객명"
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
                    <SelectItem value="pending">대기중</SelectItem>
                    <SelectItem value="in_progress">처리중</SelectItem>
                    <SelectItem value="completed">완료</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button className="w-full">검색</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 문의 목록 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>문의 목록</CardTitle>
                <CardDescription>총 {filteredInquiries.length}개의 문의사항</CardDescription>
              </div>
              <Button variant="outline">문의 통계</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NO</TableHead>
                  <TableHead>제목</TableHead>
                  <TableHead>카테고리</TableHead>
                  <TableHead>고객명</TableHead>
                  <TableHead>이메일</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>우선순위</TableHead>
                  <TableHead>등록일</TableHead>
                  <TableHead>마지막 업데이트</TableHead>
                  <TableHead>작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInquiries.map((inquiry, index) => (
                  <TableRow key={inquiry.id}>
                    <TableCell>{filteredInquiries.length - index}</TableCell>
                    <TableCell className="font-medium">{inquiry.title}</TableCell>
                    <TableCell>{inquiry.category}</TableCell>
                    <TableCell>{inquiry.customer}</TableCell>
                    <TableCell>{inquiry.email}</TableCell>
                    <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                    <TableCell>{getPriorityBadge(inquiry.priority)}</TableCell>
                    <TableCell>{inquiry.createDate}</TableCell>
                    <TableCell>{inquiry.lastUpdate}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">상세보기</Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>문의 상세보기</DialogTitle>
                              <DialogDescription>문의 내용과 답변을 확인하세요</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>문의 제목</Label>
                                <p className="p-3 bg-gray-50 rounded-lg">{inquiry.title}</p>
                              </div>
                              <div>
                                <Label>문의 내용</Label>
                                <p className="p-3 bg-gray-50 rounded-lg">고객의 문의 내용이 여기에 표시됩니다.</p>
                              </div>
                              <div>
                                <Label>답변</Label>
                                <Textarea placeholder="답변을 입력하세요" rows={4} />
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline">취소</Button>
                                <Button>답변 등록</Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        {inquiry.status === "pending" && (
                          <Button size="sm">처리시작</Button>
                        )}
                        {inquiry.status === "in_progress" && (
                          <Button size="sm" variant="outline">완료처리</Button>
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
