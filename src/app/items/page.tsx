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

export default function ItemsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // 샘플 데이터 (최근 등록자가 위로 오도록 정렬 - 등록일 기준 내림차순)
  const items = [
    {
      id: 5,
      name: "의료용 마스크",
      code: "MED001",
      category: "의료용품",
      unit: "박스",
      description: "의료용 N95 마스크",
      status: "active",
      createDate: "2024-01-22 10:15:30"
    },
    {
      id: 4,
      name: "건축용 철근",
      code: "STEEL001",
      category: "건축자재",
      unit: "톤",
      description: "건축 구조용 철근",
      status: "active",
      createDate: "2024-01-20 14:30:25"
    },
    {
      id: 3,
      name: "화학 원료",
      code: "CHEM001",
      category: "화학제품",
      unit: "kg",
      description: "산업용 화학 원료",
      status: "inactive",
      createDate: "2024-01-18 11:22:18"
    },
    {
      id: 2,
      name: "산업용 모터",
      code: "MOT001",
      category: "기계장비",
      unit: "대",
      description: "산업용 고출력 모터",
      status: "active",
      createDate: "2024-01-15 16:45:12"
    },
    {
      id: 1,
      name: "반도체 칩",
      code: "SEM001",
      category: "전자제품",
      unit: "개",
      description: "고성능 반도체 칩",
      status: "active",
      createDate: "2024-01-10 13:15:30"
    }
  ];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.includes(searchTerm) || item.code.includes(searchTerm);
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ["전자제품", "기계장비", "화학제품", "건축자재", "의료용품", "식품"];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">표준 품목 관리</h1>
          <p className="text-gray-600 mt-2">표준 품목 코드와 정보를 관리하세요</p>
        </div>

        {/* 검색 및 필터 */}
        <Card>
          <CardHeader>
            <CardTitle>검색 및 필터</CardTitle>
            <CardDescription>품목을 검색하고 카테고리별로 필터링하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search">검색</Label>
                <Input
                  id="search"
                  placeholder="품목명 또는 코드"
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

        {/* 품목 목록 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>품목 목록</CardTitle>
                <CardDescription>총 {filteredItems.length}개의 품목</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>신규 품목 등록</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>신규 품목 등록</DialogTitle>
                    <DialogDescription>새로운 표준 품목을 등록하세요</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">품목명</Label>
                      <Input id="name" placeholder="품목명" />
                    </div>
                    <div>
                      <Label htmlFor="code">품목 코드</Label>
                      <Input id="code" placeholder="품목 코드" />
                    </div>
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
                      <Label htmlFor="unit">단위</Label>
                      <Input id="unit" placeholder="단위 (개, 대, kg 등)" />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="description">품목 설명</Label>
                      <Textarea id="description" placeholder="품목에 대한 상세 설명" />
                    </div>
                    <div className="col-span-2 flex justify-end gap-2">
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
                  <TableHead>품목명</TableHead>
                  <TableHead>품목 코드</TableHead>
                  <TableHead>카테고리</TableHead>
                  <TableHead>단위</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>등록일</TableHead>
                  <TableHead>작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{filteredItems.length - index}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.code}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === "active" ? "default" : "secondary"}>
                        {item.status === "active" ? "활성" : "비활성"}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.createDate}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">상세</Button>
                        <Button variant="outline" size="sm">수정</Button>
                        <Button 
                          variant={item.status === "active" ? "destructive" : "default"} 
                          size="sm"
                        >
                          {item.status === "active" ? "비활성화" : "활성화"}
                        </Button>
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
