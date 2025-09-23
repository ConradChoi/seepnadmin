"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminLayout from "@/components/layout/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMemberById, updateMemberStatus, Member, MemberStatus } from "@/lib/memberService";

export default function MemberDetailPage() {
  const router = useRouter();
  const params = useParams();
  const memberId = params.id as string;

  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedStatus, setEditedStatus] = useState<MemberStatus>("active");

  // 회원 정보 가져오기
  const fetchMember = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const memberData = await getMemberById(memberId);
      if (memberData) {
        setMember(memberData);
        setEditedStatus(memberData.status);
      } else {
        setError("회원 정보를 찾을 수 없습니다.");
      }
    } catch (err) {
      console.error('Error fetching member:', err);
      setError('회원 정보를 가져오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (memberId) {
      fetchMember();
    }
  }, [memberId]);

  // 상태 업데이트
  const handleStatusUpdate = async () => {
    if (!member) return;

    try {
      setUpdating(true);
      console.log('Updating member status:', memberId, editedStatus);
      await updateMemberStatus(memberId, editedStatus);
      console.log('Member status updated successfully');
      setMember({ ...member, status: editedStatus });
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating member status:', err);
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(`회원 상태를 업데이트하는 중 오류가 발생했습니다: ${errorMessage}`);
    } finally {
      setUpdating(false);
    }
  };

  // 날짜 포맷팅
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  // 상태 배지
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">정상</Badge>;
      case "inactive":
        return <Badge variant="secondary">중지</Badge>;
      case "suspended":
        return <Badge variant="destructive">탈퇴</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64 mt-2" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !member) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">회원 상세</h1>
              <p className="text-gray-600 mt-2">회원 정보를 확인하고 관리하세요</p>
            </div>
            <Button variant="outline" onClick={() => router.push('/members')}>
              목록
            </Button>
          </div>
          <Alert variant="destructive">
            <AlertDescription>{error || "회원 정보를 찾을 수 없습니다."}</AlertDescription>
          </Alert>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">회원 상세</h1>
            <p className="text-gray-600 mt-2">{member.name}님의 상세 정보</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push('/members')}>
              목록
            </Button>
            <Button 
              onClick={() => setIsEditing(!isEditing)}
              disabled={updating}
            >
              {isEditing ? "취소" : "수정"}
            </Button>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 기본정보 영역 */}
          <Card>
            <CardHeader>
              <CardTitle>기본정보</CardTitle>
              <CardDescription>회원의 기본 정보입니다</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    value={member.email}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                
                <div>
                  <Label htmlFor="name">이름</Label>
                  <Input
                    id="name"
                    value={member.name}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                
                <div>
                  <Label htmlFor="nickname">닉네임</Label>
                  <Input
                    id="nickname"
                    value={member.nickname || "미설정"}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">휴대번호</Label>
                  <Input
                    id="phone"
                    value={member.phone}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                
                <div>
                  <Label>약관 동의 여부</Label>
                  <div className="space-y-2 p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">이용약관</span>
                      <Badge variant={member.terms === 'Y' || member.terms === true ? "default" : "destructive"}>
                        {member.terms === 'Y' || member.terms === true ? '동의' : '미동의'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">개인정보처리방침</span>
                      <Badge variant={member.privacy === 'Y' || member.privacy === true ? "default" : "destructive"}>
                        {member.privacy === 'Y' || member.privacy === true ? '동의' : '미동의'}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">마케팅 수신 동의</span>
                        <Badge variant={member.marketing?.email === 'Y' || member.marketing?.email === true || member.marketing?.sms === 'Y' || member.marketing?.sms === true ? "secondary" : "outline"}>
                          {member.marketing?.email === 'Y' || member.marketing?.email === true || member.marketing?.sms === 'Y' || member.marketing?.sms === true ? '일부 동의' : '미동의'}
                        </Badge>
                      </div>
                      <div className="ml-4 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">이메일</span>
                          <Badge variant={member.marketing?.email === 'Y' || member.marketing?.email === true ? "default" : "outline"} className="text-xs">
                            {member.marketing?.email === 'Y' || member.marketing?.email === true ? '동의' : '미동의'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">SMS</span>
                          <Badge variant={member.marketing?.sms === 'Y' || member.marketing?.sms === true ? "default" : "outline"} className="text-xs">
                            {member.marketing?.sms === 'Y' || member.marketing?.sms === true ? '동의' : '미동의'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="status">상태</Label>
                  {isEditing ? (
                    <Select
                      value={editedStatus}
                      onValueChange={(value: MemberStatus) => setEditedStatus(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="상태 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">정상</SelectItem>
                        <SelectItem value="inactive">중지</SelectItem>
                        <SelectItem value="suspended">탈퇴</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center gap-2">
                      {getStatusBadge(member.status)}
                    </div>
                  )}
                </div>
                
                <div>
                  <Label>가입일시</Label>
                  <div className="p-2 bg-gray-50 rounded-md text-sm">
                    {formatDateTime(member.joinDate)}
                  </div>
                </div>
                
                <div>
                  <Label>최근로그인일시</Label>
                  <div className="p-2 bg-gray-50 rounded-md text-sm">
                    {formatDateTime(member.lastLogin)}
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    onClick={handleStatusUpdate}
                    disabled={updating}
                    className="flex-1"
                  >
                    {updating ? "저장 중..." : "저장"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditing(false);
                      setEditedStatus(member.status);
                    }}
                    className="flex-1"
                  >
                    취소
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 부가정보 영역 */}
          <Card>
            <CardHeader>
              <CardTitle>부가정보</CardTitle>
              <CardDescription>회원의 추가 활동 정보입니다</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="interested-suppliers" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="interested-suppliers">관심 공급사</TabsTrigger>
                  <TabsTrigger value="rated-suppliers">평가 공급사</TabsTrigger>
                  <TabsTrigger value="posts">등록한 게시글</TabsTrigger>
                  <TabsTrigger value="inquiries">1:1문의</TabsTrigger>
                </TabsList>
                
                <TabsContent value="interested-suppliers" className="mt-4">
                  <div className="text-center py-8 text-gray-500">
                    관심 공급사 정보가 없습니다.
                  </div>
                </TabsContent>
                
                <TabsContent value="rated-suppliers" className="mt-4">
                  <div className="text-center py-8 text-gray-500">
                    평가한 공급사 정보가 없습니다.
                  </div>
                </TabsContent>
                
                <TabsContent value="posts" className="mt-4">
                  <div className="text-center py-8 text-gray-500">
                    등록한 게시글이 없습니다.
                  </div>
                </TabsContent>
                
                <TabsContent value="inquiries" className="mt-4">
                  <div className="text-center py-8 text-gray-500">
                    1:1문의 내역이 없습니다.
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
