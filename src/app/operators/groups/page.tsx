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
import { Textarea } from "@/components/ui/textarea";
import { activeGroups } from "@/lib/groups-data";

export default function GroupsPage() {
  const [groups, setGroups] = useState(activeGroups);

  // 로컬 스토리지 사용을 일시적으로 비활성화
  // useEffect(() => {
  //   // 클라이언트에서만 실행
  //   if (typeof window !== 'undefined') {
  //     // 로컬 스토리지에서 데이터 로드
  //     const savedGroups = localStorage.getItem('groupsData');
  //     if (savedGroups) {
  //       try {
  //         setGroups(JSON.parse(savedGroups));
  //       } catch (error) {
  //         console.error('Failed to parse saved groups data:', error);
  //       }
  //     }
  //   }
  // }, []);

  // useEffect(() => {
  //   // 클라이언트에서만 실행
  //   if (typeof window !== 'undefined') {
  //     // 그룹 데이터가 변경될 때마다 로컬 스토리지에 저장
  //     localStorage.setItem('groupsData', JSON.stringify(groups));
  //   }
  // }, [groups]);

  const toggleGroupStatus = (id: number) => {
    setGroups(prev => 
      prev.map(group => 
        group.id === id 
          ? { ...group, status: group.status === "active" ? "inactive" : "active" }
          : group
      )
    );
  };

  // 필터링 없이 모든 그룹 표시
  const filteredGroups = groups;

  const getMemberCountBadge = (count: number) => {
    if (count === 0) {
      return <Badge variant="outline">0명</Badge>;
    } else if (count < 5) {
      return <Badge variant="secondary">{count}명</Badge>;
    } else {
      return <Badge variant="default">{count}명</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">그룹관리</h1>
          <p className="text-gray-600 mt-2">운영자 역할을 등록하고 관리하세요</p>
        </div>


        {/* 통계 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>그룹 현황</CardTitle>
            <CardDescription>그룹 관리 현황을 한눈에 확인하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{groups.length}</div>
                <div className="text-sm text-gray-600">총 그룹 수</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {groups.filter(g => g.status === "active").length}
                </div>
                <div className="text-sm text-gray-600">활성 그룹</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {groups.reduce((sum, group) => sum + group.memberCount, 0)}
                </div>
                <div className="text-sm text-gray-600">총 멤버 수</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(groups.reduce((sum, group) => sum + group.memberCount, 0) / groups.length)}
                </div>
                <div className="text-sm text-gray-600">평균 멤버 수</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 그룹 목록 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>그룹 목록</CardTitle>
                <CardDescription>총 {filteredGroups.length}개의 그룹</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>신규 그룹 등록</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>신규 그룹 등록</DialogTitle>
                    <DialogDescription>새로운 운영자 그룹을 등록하세요</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="groupName">그룹명</Label>
                        <Input id="groupName" placeholder="그룹명을 입력하세요" />
                      </div>
                      <div>
                        <Label htmlFor="groupCode">그룹 코드</Label>
                        <Input id="groupCode" placeholder="GROUP_CODE" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">설명</Label>
                      <Textarea 
                        id="description" 
                        placeholder="그룹에 대한 설명을 입력하세요"
                        className="min-h-[80px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="permissions">권한 설정</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="perm1" />
                          <Label htmlFor="perm1" className="text-sm">사용자 관리</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="perm2" />
                          <Label htmlFor="perm2" className="text-sm">콘텐츠 관리</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="perm3" />
                          <Label htmlFor="perm3" className="text-sm">통계 조회</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="perm4" />
                          <Label htmlFor="perm4" className="text-sm">문의 처리</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="perm5" />
                          <Label htmlFor="perm5" className="text-sm">콘텐츠 검토</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="perm6" />
                          <Label htmlFor="perm6" className="text-sm">시스템 설정</Label>
                        </div>
                      </div>
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
                  <TableHead>그룹 코드</TableHead>
                  <TableHead>그룹명</TableHead>
                  <TableHead>설명</TableHead>
                  <TableHead>멤버 수</TableHead>
                  <TableHead>권한</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGroups
                  .sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime())
                  .map((group, index) => (
                  <TableRow key={group.id}>
                    <TableCell>{filteredGroups.length - index}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{group.code}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{group.name}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={group.description}>
                        {group.description}
                      </div>
                    </TableCell>
                    <TableCell>{getMemberCountBadge(group.memberCount)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {group.permissions.map((permission, permIndex) => (
                          <Badge key={permIndex} variant="outline" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant={group.status === "active" ? "default" : "secondary"}
                        size="sm"
                        onClick={() => toggleGroupStatus(group.id)}
                        disabled={group.code === "SUPER_ADMIN"}
                        className="min-w-[80px]"
                      >
                        {group.status === "active" ? "활성" : "비활성"}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">상세</Button>
                        <Button variant="outline" size="sm">수정</Button>
                        <Button variant="outline" size="sm">멤버 관리</Button>
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
