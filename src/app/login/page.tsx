"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getOperators, Operator } from "@/lib/operatorService";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 운영자 데이터 가져오기
      const operators = await getOperators();
      console.log("전체 운영자 데이터:", operators);
      console.log("입력한 아이디:", username);
      console.log("입력한 비밀번호:", password);
      
      // Firebase 연결 오류 확인
      if (operators.length === 0) {
        console.warn("운영자 데이터를 가져올 수 없습니다. Firebase 연결을 확인해주세요.");
        setError("데이터베이스 연결에 실패했습니다. 잠시 후 다시 시도해주세요.");
        return;
      }
      
      // 사용자 인증
      const operator = operators.find(
        (op: Operator) => 
          op.username === username && 
          op.password === password && 
          op.status === "active"
      );

      console.log("찾은 운영자:", operator);

      if (operator) {
        // 사용자 정보 준비
        const userData = {
          id: operator.id!,
          username: operator.username,
          name: operator.name,
          email: operator.email,
          role: operator.role,
          department: operator.department,
          lastLogin: new Date().toISOString()
        };

        // AuthContext를 통해 로그인
        login(userData);

        // 마지막 로그인 시간 업데이트
        const { updateOperator } = await import("@/lib/operatorService");
        await updateOperator(operator.id!, {
          lastLogin: new Date().toISOString()
        });

        // 대시보드로 리다이렉트
        router.push("/dashboard");
      } else {
        setError("아이디 또는 비밀번호가 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            관리자 로그인
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            운영자 관리에 등록된 계정으로 로그인하세요
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>로그인</CardTitle>
            <CardDescription>
              아이디와 비밀번호를 입력해주세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div>
                <Label htmlFor="username">아이디</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="아이디를 입력하세요"
                  required
                  disabled={loading}
                />
              </div>
              
              <div>
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  required
                  disabled={loading}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? "로그인 중..." : "로그인"}
              </Button>
              
              <div className="text-center">
                <Link 
                  href="/reset-password" 
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  비밀번호를 잊으셨나요?
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
