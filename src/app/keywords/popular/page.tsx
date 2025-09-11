"use client";

import { useState } from "react";
import AdminLayout from "@/components/layout/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, Eye, EyeOff } from "lucide-react";

export default function PopularKeywordsPage() {
  const [popularKeywords, setPopularKeywords] = useState([
    {
      id: 1,
      keyword: "반도체",
      searchCount: 1250,
      isVisible: true,
      order: 1,
      lastUpdated: "2024-01-22 14:30:25"
    },
    {
      id: 2,
      keyword: "의료용 마스크",
      searchCount: 1234,
      isVisible: true,
      order: 2,
      lastUpdated: "2024-01-20 10:15:30"
    },
    {
      id: 3,
      keyword: "건축 자재",
      searchCount: 890,
      isVisible: true,
      order: 3,
      lastUpdated: "2024-01-18 16:45:12"
    },
    {
      id: 4,
      keyword: "산업용 모터",
      searchCount: 567,
      isVisible: true,
      order: 4,
      lastUpdated: "2024-01-15 09:30:45"
    },
    {
      id: 5,
      keyword: "화학 원료",
      searchCount: 456,
      isVisible: true,
      order: 5,
      lastUpdated: "2024-01-10 13:15:30"
    }
  ]);

  const [availableKeywords] = useState([
    { id: 6, keyword: "전자제품", searchCount: 234 },
    { id: 7, keyword: "기계장비", searchCount: 189 },
    { id: 8, keyword: "화학제품", searchCount: 156 },
    { id: 9, keyword: "건축자재", searchCount: 123 },
    { id: 10, keyword: "의료용품", searchCount: 98 }
  ]);

  const moveUp = (id: number) => {
    setPopularKeywords(prev => {
      const items = [...prev];
      const currentIndex = items.findIndex(item => item.id === id);
      if (currentIndex > 0) {
        [items[currentIndex], items[currentIndex - 1]] = [items[currentIndex - 1], items[currentIndex]];
        return items.map((item, index) => ({ ...item, order: index + 1 }));
      }
      return prev;
    });
  };

  const moveDown = (id: number) => {
    setPopularKeywords(prev => {
      const items = [...prev];
      const currentIndex = items.findIndex(item => item.id === id);
      if (currentIndex < items.length - 1) {
        [items[currentIndex], items[currentIndex + 1]] = [items[currentIndex + 1], items[currentIndex]];
        return items.map((item, index) => ({ ...item, order: index + 1 }));
      }
      return prev;
    });
  };

  const toggleVisibility = (id: number) => {
    setPopularKeywords(prev => 
      prev.map(keyword => 
        keyword.id === id 
          ? { ...keyword, isVisible: !keyword.isVisible }
          : keyword
      )
    );
  };

  const addKeyword = (keyword: { id: number; keyword: string; searchCount: number }) => {
    if (popularKeywords.length >= 5) {
      alert("인기 검색어는 최대 5개까지 설정할 수 있습니다.");
      return;
    }

    const newKeyword = {
      ...keyword,
      id: Date.now(),
      isVisible: true,
      order: popularKeywords.length + 1,
      lastUpdated: new Date().toLocaleString()
    };

    setPopularKeywords(prev => [...prev, newKeyword]);
  };

  const removeKeyword = (id: number) => {
    setPopularKeywords(prev => {
      const filtered = prev.filter(keyword => keyword.id !== id);
      // 순서 재정렬
      return filtered.map((keyword, index) => ({
        ...keyword,
        order: index + 1
      }));
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">인기 검색어 관리</h1>
          <p className="text-gray-600 mt-2">seepn.me 메인에 노출되는 인기 검색어 5가지를 설정하세요</p>
        </div>

        {/* 현재 설정된 인기 검색어 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>현재 인기 검색어 설정</CardTitle>
                <CardDescription>메인 페이지에 노출되는 인기 검색어 순위 (최대 5개)</CardDescription>
              </div>
              <Badge variant="outline" className="text-sm">
                {popularKeywords.filter(k => k.isVisible).length}/5 설정됨
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {popularKeywords
                .sort((a, b) => a.order - b.order)
                .map((keyword, index) => (
                  <div
                    key={keyword.id}
                    className="flex items-center gap-3 p-3 border rounded-lg bg-white hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveUp(keyword.id)}
                        disabled={index === 0}
                        className="h-6 w-6 p-0"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveDown(keyword.id)}
                        disabled={index === popularKeywords.length - 1}
                        className="h-6 w-6 p-0"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                    </div>
                    <Badge variant="outline" className="w-8 h-8 flex items-center justify-center">
                      {keyword.order}
                    </Badge>
                    <div className="flex-1">
                      <div className="font-medium">{keyword.keyword}</div>
                      <div className="text-sm text-gray-500">
                        검색수: {keyword.searchCount.toLocaleString()} | 
                        업데이트: {keyword.lastUpdated}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleVisibility(keyword.id)}
                      >
                        {keyword.isVisible ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeKeyword(keyword.id)}
                      >
                        제거
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* 사용 가능한 키워드 목록 */}
        <Card>
          <CardHeader>
            <CardTitle>사용 가능한 키워드</CardTitle>
            <CardDescription>인기 검색어에 추가할 수 있는 키워드 목록</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>키워드</TableHead>
                  <TableHead>검색수</TableHead>
                  <TableHead>작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {availableKeywords.map((keyword) => (
                  <TableRow key={keyword.id}>
                    <TableCell className="font-medium">{keyword.keyword}</TableCell>
                    <TableCell>{keyword.searchCount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => addKeyword(keyword)}
                        disabled={popularKeywords.length >= 5}
                      >
                        추가
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 미리보기 */}
        <Card>
          <CardHeader>
            <CardTitle>메인 페이지 미리보기</CardTitle>
            <CardDescription>seepn.me 메인에 표시될 인기 검색어 미리보기</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">인기 검색어</h3>
              <div className="flex flex-wrap gap-2">
                {popularKeywords
                  .filter(keyword => keyword.isVisible)
                  .sort((a, b) => a.order - b.order)
                  .map((keyword) => (
                    <Badge key={keyword.id} variant="secondary" className="px-3 py-1">
                      {keyword.keyword}
                    </Badge>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
