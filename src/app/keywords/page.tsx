"use client";

import Link from "next/link";
import AdminLayout from "@/components/layout/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Flame, ChevronRight } from "lucide-react";

export default function KeywordsPage() {
  const subMenus = [
    {
      title: "검색 키워드 관리",
      description: "검색 키워드와 연관 키워드를 관리하세요",
      href: "/keywords/management",
      icon: Search,
      features: [
        "키워드 등록/수정/삭제",
        "연관 키워드 관리",
        "카테고리별 분류",
        "검색 통계 분석"
      ]
    },
    {
      title: "인기 검색어 관리",
      description: "seepn.me 메인에 노출되는 인기 검색어 5가지를 설정하세요",
      href: "/keywords/popular",
      icon: Flame,
      features: [
        "메인 페이지 인기 검색어 설정",
        "최대 5개 키워드 관리",
        "순위별 배치 관리",
        "실시간 노출 상태 확인"
      ]
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">검색 키워드 관리</h1>
          <p className="text-gray-600 mt-2">검색 키워드와 인기 검색어를 관리하세요</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subMenus.map((menu, index) => {
            const IconComponent = menu.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{menu.title}</CardTitle>
                      <CardDescription className="mt-1">{menu.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {menu.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href={menu.href}>
                    <Button className="w-full">
                      <ChevronRight className="h-4 w-4 mr-2" />
                      {menu.title} 바로가기
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 통계 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>키워드 현황</CardTitle>
            <CardDescription>검색 키워드 현황을 한눈에 확인하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">5</div>
                <div className="text-sm text-gray-600">등록된 키워드</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">4</div>
                <div className="text-sm text-gray-600">활성 키워드</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">1,250</div>
                <div className="text-sm text-gray-600">총 검색수</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">5</div>
                <div className="text-sm text-gray-600">인기 검색어</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
