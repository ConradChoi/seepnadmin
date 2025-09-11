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

export default function SuppliersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // 샘플 데이터 (최근 등록자가 위로 오도록 정렬 - 등록일 기준 내림차순)
  const suppliers = [
    {
      id: 5,
      name: "JKL 의료",
      category: "의료용품",
      contact: "정원장",
      phone: "02-5678-9012",
      email: "contact@jkl.co.kr",
      status: "pending",
      address: "서울시 서초구 서초대로 456",
      description: "의료용품 전문 공급업체",
      registerDate: "2024-01-22 14:30:25"
    },
    {
      id: 4,
      name: "GHI 건재",
      category: "건축자재",
      contact: "최부장",
      phone: "02-4567-8901",
      email: "contact@ghi.co.kr",
      status: "rejected",
      address: "대구시 수성구 범어로 321",
      description: "건축자재 전문 공급업체",
      registerDate: "2024-01-20 11:22:18"
    },
    {
      id: 3,
      name: "DEF 화학",
      category: "화학제품",
      contact: "박과장",
      phone: "02-3456-7890",
      email: "sales@def.co.kr",
      status: "approved",
      address: "울산시 남구 삼산로 789",
      description: "화학제품 전문 공급업체",
      registerDate: "2024-01-18 16:45:12"
    },
    {
      id: 2,
      name: "XYZ 기계",
      category: "기계장비",
      contact: "이사장",
      phone: "02-2345-6789",
      email: "info@xyz.co.kr",
      status: "pending",
      address: "부산시 해운대구 센텀로 456",
      description: "산업용 기계장비 공급",
      registerDate: "2024-01-15 09:30:45"
    },
    {
      id: 1,
      name: "ABC 전자",
      category: "전자제품",
      contact: "김대표",
      phone: "02-1234-5678",
      email: "contact@abc.co.kr",
      status: "approved",
      address: "서울시 강남구 테헤란로 123",
      description: "전자제품 전문 공급업체",
      registerDate: "2024-01-10 13:15:30"
    }
  ];

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.includes(searchTerm) || supplier.contact.includes(searchTerm);
    const matchesCategory = categoryFilter === "all" || supplier.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || supplier.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="default">승인됨</Badge>;
      case "pending":
        return <Badge variant="secondary">검토중</Badge>;
      case "rejected":
        return <Badge variant="destructive">거절됨</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const categories = ["전자제품", "기계장비", "화학제품", "건축자재", "의료용품", "식품"];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">공급사 관리</h1>
          <p className="text-gray-600 mt-2">등록된 공급업체를 관리하고 승인/거절을 처리하세요</p>
        </div>

        {/* 검색 및 필터 */}
        <Card>
          <CardHeader>
            <CardTitle>검색 및 필터</CardTitle>
            <CardDescription>공급사를 검색하고 카테고리/상태별로 필터링하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">검색</Label>
                <Input
                  id="search"
                  placeholder="업체명 또는 담당자명"
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
              <div>
                <Label htmlFor="status">상태</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="상태 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="approved">승인됨</SelectItem>
                    <SelectItem value="pending">검토중</SelectItem>
                    <SelectItem value="rejected">거절됨</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button className="w-full">검색</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 공급사 목록 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>공급사 목록</CardTitle>
                <CardDescription>총 {filteredSuppliers.length}개의 공급업체</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>신규 공급사 등록</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>신규 공급사 등록</DialogTitle>
                    <DialogDescription>새로운 공급업체 정보를 입력하세요</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">업체명</Label>
                      <Input id="name" placeholder="업체명" />
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
                      <Label htmlFor="contact">담당자명</Label>
                      <Input id="contact" placeholder="담당자명" />
                    </div>
                    <div>
                      <Label htmlFor="phone">연락처</Label>
                      <Input id="phone" placeholder="연락처" />
                    </div>
                    <div>
                      <Label htmlFor="email">이메일</Label>
                      <Input id="email" type="email" placeholder="이메일" />
                    </div>
                    <div>
                      <Label htmlFor="address">주소</Label>
                      <Input id="address" placeholder="주소" />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="description">업체 설명</Label>
                      <Textarea id="description" placeholder="업체에 대한 설명" />
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
                  <TableHead>업체명</TableHead>
                  <TableHead>카테고리</TableHead>
                  <TableHead>담당자</TableHead>
                  <TableHead>연락처</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>등록일</TableHead>
                  <TableHead>작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map((supplier, index) => (
                  <TableRow key={supplier.id}>
                    <TableCell>{filteredSuppliers.length - index}</TableCell>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>{supplier.category}</TableCell>
                    <TableCell>{supplier.contact}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell>{getStatusBadge(supplier.status)}</TableCell>
                    <TableCell>{supplier.registerDate}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">상세</Button>
                        <Button variant="outline" size="sm">수정</Button>
                        {supplier.status === "pending" && (
                          <>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">승인</Button>
                            <Button size="sm" variant="destructive">거절</Button>
                          </>
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
