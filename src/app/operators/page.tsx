"use client";

import AdminLayout from "@/components/layout/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ChevronRight } from "lucide-react";

export default function OperatorsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">운영자 관리</h1>
          <p className="text-gray-600 mt-2">시스템 운영자와 권한을 관리하세요</p>
        </div>

        {/* 안내 메시지 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              운영자 관리 안내
            </CardTitle>
            <CardDescription>
              왼쪽 메뉴에서 원하는 기능을 선택하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <ChevronRight className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="font-medium text-blue-900">운영자 관리</div>
                  <div className="text-sm text-blue-700">운영자 계정 등록, 수정, 삭제 및 상태 관리</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <ChevronRight className="h-4 w-4 text-purple-600" />
                <div>
                  <div className="font-medium text-purple-900">그룹관리</div>
                  <div className="text-sm text-purple-700">운영자 역할을 등록하고 관리하는 메뉴</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <ChevronRight className="h-4 w-4 text-green-600" />
                <div>
                  <div className="font-medium text-green-900">메뉴 권한 관리</div>
                  <div className="text-sm text-green-700">역할별 메뉴 접근 권한 설정 및 관리</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 통계 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>운영자 현황</CardTitle>
            <CardDescription>시스템 운영자 현황을 한눈에 확인하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">1</div>
                <div className="text-sm text-gray-600">최고관리자</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">2</div>
                <div className="text-sm text-gray-600">관리자</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">1</div>
                <div className="text-sm text-gray-600">운영자</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">1</div>
                <div className="text-sm text-gray-600">검토자</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
