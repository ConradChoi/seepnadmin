"use client";

import { useState } from "react";
import AdminLayout from "@/components/layout/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ItemsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category1Depth, setCategory1Depth] = useState("all");
  const [category2Depth, setCategory2Depth] = useState("all");
  const [category3Depth, setCategory3Depth] = useState("all");

  // 샘플 데이터 (최근 등록자가 위로 오도록 정렬 - 등록일 기준 내림차순)
  const [items, setItems] = useState([
    {
      id: 5,
      categoryCode: "MED001",
      category1Depth: "의료용품",
      category2Depth: "소모품",
      category3Depth: "마스크",
      status: "active",
      createDate: "2024-01-22 10:15:30"
    },
    {
      id: 4,
      categoryCode: "CON001",
      category1Depth: "건축자재",
      category2Depth: "구조재",
      category3Depth: "철근",
      status: "active",
      createDate: "2024-01-20 14:30:25"
    },
    {
      id: 3,
      categoryCode: "CHEM001",
      category1Depth: "화학제품",
      category2Depth: "원료",
      category3Depth: "고분자",
      status: "inactive",
      createDate: "2024-01-18 11:22:18"
    },
    {
      id: 2,
      categoryCode: "MOT001",
      category1Depth: "기계장비",
      category2Depth: "산업용",
      category3Depth: "모터",
      status: "active",
      createDate: "2024-01-15 16:45:12"
    },
    {
      id: 1,
      categoryCode: "SEM001",
      category1Depth: "전자제품",
      category2Depth: "컴퓨터",
      category3Depth: "데스크톱",
      status: "active",
      createDate: "2024-01-10 13:15:30"
    }
  ]);

  // 카테고리 선택 핸들러들
  const handleCategory1DepthChange = (value: string) => {
    setCategory1Depth(value);
    setCategory2Depth("all");
    setCategory3Depth("all");
  };

  const handleCategory2DepthChange = (value: string) => {
    setCategory2Depth(value);
    setCategory3Depth("all");
  };

  const handleCategory3DepthChange = (value: string) => {
    setCategory3Depth(value);
  };

  // 초기화 버튼 핸들러
  const handleReset = () => {
    setSearchTerm("");
    setCategory1Depth("all");
    setCategory2Depth("all");
    setCategory3Depth("all");
  };

  // 상태 토글 핸들러
  const toggleItemStatus = (id: number) => {
    setItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, status: item.status === "active" ? "inactive" : "active" }
          : item
      )
    );
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.categoryCode.includes(searchTerm) || 
                         item.category1Depth.includes(searchTerm) || 
                         item.category2Depth.includes(searchTerm) || 
                         item.category3Depth.includes(searchTerm);
    
    const matchesCategory1 = category1Depth === "all" || item.category1Depth === category1Depth;
    const matchesCategory2 = category2Depth === "all" || item.category2Depth === category2Depth;
    const matchesCategory3 = category3Depth === "all" || item.category3Depth === category3Depth;
    
    return matchesSearch && matchesCategory1 && matchesCategory2 && matchesCategory3;
  });

  // 계층적 카테고리 데이터
  const categoryData: Record<string, Record<string, string[]>> = {
    "전자제품": {
      "컴퓨터": ["데스크톱", "노트북", "태블릿"],
      "가전제품": ["TV", "냉장고", "세탁기"],
      "모바일": ["스마트폰", "태블릿", "액세서리"]
    },
    "기계장비": {
      "산업용": ["모터", "펌프", "컨베이어"],
      "건설용": ["굴착기", "크레인", "불도저"],
      "농업용": ["트랙터", "수확기", "경운기"]
    },
    "화학제품": {
      "원료": ["고분자", "첨가제", "촉매"],
      "완제품": ["플라스틱", "고무", "섬유"],
      "특수화학": ["의약품", "화장품", "식품첨가제"]
    },
    "건축자재": {
      "구조재": ["철근", "콘크리트", "목재"],
      "마감재": ["타일", "페인트", "벽지"],
      "설비재": ["배관", "전기", "난방"]
    },
    "의료용품": {
      "의료기기": ["진단기기", "치료기기", "재활기기"],
      "소모품": ["마스크", "장갑", "주사기"],
      "의약품": ["처방약", "일반약", "보조제"]
    },
    "식품": {
      "농산물": ["채소", "과일", "곡물"],
      "축산물": ["육류", "유제품", "계란"],
      "수산물": ["생선", "조개", "해조류"]
    }
  };

  // 1Depth 카테고리 목록
  const categories1Depth = Object.keys(categoryData);
  
  // 2Depth 카테고리 목록 (1Depth 선택 시)
  const categories2Depth = category1Depth ? Object.keys(categoryData[category1Depth] || {}) : [];
  
  // 3Depth 카테고리 목록 (2Depth 선택 시)
  const categories3Depth = category2Depth ? (categoryData[category1Depth]?.[category2Depth] || []) : [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">표준 품목 카테고리</h1>
          <p className="text-gray-600 mt-2">표준 품목 코드와 정보를 관리하세요</p>
        </div>

        {/* 검색 및 필터 */}
        <Card>
          <CardHeader>
            <CardTitle>검색 및 필터</CardTitle>
            <CardDescription>카테고리별로 필터링하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="search">검색</Label>
                <Input
                  id="search"
                  placeholder="카테고리명을 입력하세요."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category1">1Depth 카테고리</Label>
                  <Select value={category1Depth} onValueChange={handleCategory1DepthChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="1Depth 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      {categories1Depth.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category2">2Depth 카테고리</Label>
                  <Select 
                    value={category2Depth} 
                    onValueChange={handleCategory2DepthChange}
                    disabled={!category1Depth || category1Depth === "all"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={category1Depth && category1Depth !== "all" ? "2Depth 선택" : "1Depth를 먼저 선택하세요"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      {categories2Depth.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category3">3Depth 카테고리</Label>
                  <Select 
                    value={category3Depth} 
                    onValueChange={handleCategory3DepthChange}
                    disabled={!category2Depth || category2Depth === "all"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={category2Depth && category2Depth !== "all" ? "3Depth 선택" : "2Depth를 먼저 선택하세요"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      {categories3Depth.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleReset} className="w-full md:w-auto">
                  초기화
                </Button>
                <Button className="w-full md:w-auto">검색</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 품목 목록 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>품목 카테고리</CardTitle>
                <CardDescription>총 {filteredItems.length}개의 품목</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>카테고리 등록</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>카테고리 등록</DialogTitle>
                    <DialogDescription>새로운 카테고리를 등록하세요</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="categoryCode">카테고리 코드(자동생성)</Label>
                      <Input id="categoryCode" placeholder="자동으로 생성됩니다" disabled />
                    </div>
                    <div>
                      <Label htmlFor="categoryName">카테고리명</Label>
                      <Input id="categoryName" placeholder="카테고리명을 입력하세요" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="newCategory1">1Depth 선택</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="1Depth 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories1Depth.map(category => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="newCategory2">2Depth 선택</Label>
                        <Select disabled>
                          <SelectTrigger>
                            <SelectValue placeholder="2Depth 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">선택하세요</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="newCategory3">3Depth 선택</Label>
                        <Select disabled>
                          <SelectTrigger>
                            <SelectValue placeholder="3Depth 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">선택하세요</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="status">상태 선택</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="상태를 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">활성</SelectItem>
                          <SelectItem value="inactive">비활성</SelectItem>
                        </SelectContent>
                      </Select>
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
                  <TableHead>카테고리 코드</TableHead>
                  <TableHead>1Depth</TableHead>
                  <TableHead>2Depth</TableHead>
                  <TableHead>3Depth</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>등록일</TableHead>
                  <TableHead>작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.categoryCode}</TableCell>
                    <TableCell>{item.category1Depth}</TableCell>
                    <TableCell>{item.category2Depth}</TableCell>
                    <TableCell>{item.category3Depth}</TableCell>
                    <TableCell>
                      <Button
                        variant={item.status === "active" ? "default" : "secondary"}
                        size="sm"
                        onClick={() => toggleItemStatus(item.id)}
                        className="min-w-[80px]"
                      >
                        {item.status === "active" ? "활성" : "비활성"}
                      </Button>
                    </TableCell>
                    <TableCell>{item.createDate}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">상세</Button>
                        <Button variant="outline" size="sm">수정</Button>
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
