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

export default function KeywordsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // 샘플 데이터 (최근 등록자가 위로 오도록 정렬 - 등록일 기준 내림차순)
  const keywords = [
    {
      id: 5,
      keyword: "의료용 마스크",
      category: "의료용품",
      searchCount: 1250,
      status: "active",
      priority: "high",
      relatedKeywords: ["N95", "KF94", "방역용품"],
      createDate: "2024-01-22 14:30:25"
    },
    {
      id: 4,
      keyword: "건축 자재",
      category: "건축자재",
      searchCount: 1234,
      status: "active",
      priority: "high",
      relatedKeywords: ["철근", "콘크리트", "벽돌"],
      createDate: "2024-01-20 10:15:30"
    },
    {
      id: 3,
      keyword: "화학 원료",
      category: "화학제품",
      searchCount: 567,
      status: "inactive",
      priority: "low",
      relatedKeywords: ["화학물질", "첨가제", "용매"],
      createDate: "2024-01-18 16:45:12"
    },
    {
      id: 2,
      keyword: "산업용 모터",
      category: "기계장비",
      searchCount: 890,
      status: "active",
      priority: "medium",
      relatedKeywords: ["엔진", "발전기", "펌프"],
      createDate: "2024-01-15 09:30:45"
    },
    {
      id: 1,
      keyword: "반도체",
      category: "전자제품",
      searchCount: 1250,
      status: "active",
      priority: "high",
      relatedKeywords: ["칩", "IC", "메모리"],
      createDate: "2024-01-10 13:15:30"
    }
  ];

  const filteredKeywords = keywords.filter(keyword => {
    const matchesSearch = keyword.keyword.includes(searchTerm) || keyword.relatedKeywords.some(k => k.includes(searchTerm));
    const matchesCategory = categoryFilter === "all" || keyword.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">활성</Badge>;
      case "inactive":
        return <Badge variant="secondary">비활성</Badge>;
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

  const categories = ["전자제품", "기계장비", "화학제품", "건축자재", "의료용품", "식품"];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">검색 키워드 관리</h1>
          <p className="text-gray-600 mt-2">검색 키워드와 연관 키워드를 관리하세요</p>
        </div>

        {/* 검색 및 필터 */}
        <Card>
          <CardHeader>
            <CardTitle>검색 및 필터</CardTitle>
            <CardDescription>키워드를 검색하고 카테고리별로 필터링하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search">검색</Label>
                <Input
                  id="search"
                  placeholder="키워드 또는 연관 키워드"
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

        {/* 키워드 목록 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>키워드 목록</CardTitle>
                <CardDescription>총 {filteredKeywords.length}개의 키워드</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>신규 키워드 등록</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>신규 키워드 등록</DialogTitle>
                    <DialogDescription>새로운 검색 키워드를 등록하세요</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="keyword">키워드</Label>
                      <Input id="keyword" placeholder="검색 키워드" />
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
                      <Label htmlFor="related">연관 키워드</Label>
                      <Input id="related" placeholder="쉼표로 구분하여 입력 (예: 키워드1, 키워드2, 키워드3)" />
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
                  <TableHead>키워드</TableHead>
                  <TableHead>카테고리</TableHead>
                  <TableHead>연관 키워드</TableHead>
                  <TableHead>검색수</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>우선순위</TableHead>
                  <TableHead>등록일</TableHead>
                  <TableHead>작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKeywords.map((keyword, index) => (
                  <TableRow key={keyword.id}>
                    <TableCell>{filteredKeywords.length - index}</TableCell>
                    <TableCell className="font-medium">{keyword.keyword}</TableCell>
                    <TableCell>{keyword.category}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {keyword.relatedKeywords.map((related, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {related}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{keyword.searchCount.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(keyword.status)}</TableCell>
                    <TableCell>{getPriorityBadge(keyword.priority)}</TableCell>
                    <TableCell>{keyword.createDate}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">상세</Button>
                        <Button variant="outline" size="sm">수정</Button>
                        {keyword.status === "inactive" && (
                          <Button size="sm">활성화</Button>
                        )}
                        {keyword.status === "active" && (
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
