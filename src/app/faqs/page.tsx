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

export default function FaqsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // 샘플 데이터 (최근 등록자가 위로 오도록 정렬 - 등록일 기준 내림차순)
  const faqs = [
    {
      id: 5,
      question: "의료용품 공급업체 등록 절차는?",
      answer: "의료용품 공급업체는 별도의 인증 절차를 거쳐 등록할 수 있습니다.",
      category: "등록",
      status: "published",
      viewCount: 1250,
      order: 1
    },
    {
      id: 4,
      question: "계정 정보를 변경하고 싶습니다",
      answer: "마이페이지 > 설정에서 계정 정보를 변경할 수 있습니다.",
      category: "계정",
      status: "published",
      viewCount: 567,
      order: 2
    },
    {
      id: 3,
      question: "검색 결과가 정확하지 않습니다",
      answer: "검색어를 더 구체적으로 입력하거나 필터를 사용해보세요.",
      category: "이용",
      status: "draft",
      viewCount: 0,
      order: 3
    },
    {
      id: 2,
      question: "서비스 이용료는 어떻게 되나요?",
      answer: "기본 서비스는 무료이며, 프리미엄 기능은 월 구독료가 있습니다.",
      category: "결제",
      status: "published",
      viewCount: 890,
      order: 4
    },
    {
      id: 1,
      question: "공급업체 등록은 어떻게 하나요?",
      answer: "공급업체 등록은 회원가입 후 마이페이지에서 신청할 수 있습니다.",
      category: "등록",
      status: "published",
      viewCount: 1250,
      order: 5
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.includes(searchTerm) || faq.answer.includes(searchTerm);
    const matchesCategory = categoryFilter === "all" || faq.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge variant="default">발행됨</Badge>;
      case "draft":
        return <Badge variant="secondary">임시저장</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const categories = ["등록", "결제", "이용", "계정", "기술지원", "기타"];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">FAQ 관리</h1>
          <p className="text-gray-600 mt-2">자주 묻는 질문과 답변을 관리하세요</p>
        </div>

        {/* 검색 및 필터 */}
        <Card>
          <CardHeader>
            <CardTitle>검색 및 필터</CardTitle>
            <CardDescription>FAQ를 검색하고 카테고리별로 필터링하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search">검색</Label>
                <Input
                  id="search"
                  placeholder="질문 또는 답변 내용"
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

        {/* FAQ 목록 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>FAQ 목록</CardTitle>
                <CardDescription>총 {filteredFaqs.length}개의 FAQ</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>신규 FAQ 작성</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>신규 FAQ 작성</DialogTitle>
                    <DialogDescription>새로운 FAQ를 작성하세요</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="question">질문</Label>
                      <Input id="question" placeholder="자주 묻는 질문" />
                    </div>
                    <div>
                      <Label htmlFor="answer">답변</Label>
                      <Textarea id="answer" placeholder="질문에 대한 답변" rows={6} />
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
                        <Label htmlFor="order">표시 순서</Label>
                        <Input id="order" type="number" placeholder="숫자가 작을수록 위에 표시" />
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
                  <TableHead>질문</TableHead>
                  <TableHead>카테고리</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>조회수</TableHead>
                  <TableHead>작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFaqs.map((faq, index) => (
                  <TableRow key={faq.id}>
                    <TableCell>{filteredFaqs.length - index}</TableCell>
                    <TableCell className="font-medium max-w-md truncate">{faq.question}</TableCell>
                    <TableCell>{faq.category}</TableCell>
                    <TableCell>{getStatusBadge(faq.status)}</TableCell>
                    <TableCell>{faq.viewCount.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">상세보기</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>FAQ 상세보기</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>질문</Label>
                                <p className="p-3 bg-gray-50 rounded-lg">{faq.question}</p>
                              </div>
                              <div>
                                <Label>답변</Label>
                                <p className="p-3 bg-gray-50 rounded-lg">{faq.answer}</p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm">수정</Button>
                        {faq.status === "draft" && (
                          <Button size="sm">발행</Button>
                        )}
                        {faq.status === "published" && (
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
