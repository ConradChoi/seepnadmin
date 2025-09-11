"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // 테스트용 계정 정보
  const testAccounts = [
    { username: "admin", password: "admin123", role: "super_admin", roleName: "최고관리자" },
    { username: "manager", password: "manager123", role: "admin", roleName: "관리자" },
    { username: "operator", password: "operator123", role: "operator", roleName: "운영자" },
    { username: "reviewer", password: "reviewer123", role: "reviewer", roleName: "검토자" }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    // 테스트 계정 확인
    const account = testAccounts.find(acc => 
      acc.username === username && acc.password === password
    );
    
    if (account) {
      // 로그인 성공 - 세션 스토리지에 계정 정보 저장 (클라이언트에서만)
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('adminUser', JSON.stringify({
          username: account.username,
          role: account.role,
          roleName: account.roleName,
          loginTime: new Date().toISOString()
        }));
      }
      
      setTimeout(() => {
        setIsLoading(false);
        router.push("/dashboard");
      }, 1000);
    } else {
      setIsLoading(false);
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  const handleTestLogin = (account: typeof testAccounts[0]) => {
    setUsername(account.username);
    setPassword(account.password);
    setError(""); // 에러 메시지 초기화
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* 테스트 계정 안내 */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              테스트 계정 정보
            </CardTitle>
            <CardDescription className="text-blue-700">
              아래 계정으로 로그인하여 테스트할 수 있습니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {testAccounts.map((account, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                <div>
                  <span className="font-medium text-sm">{account.roleName}</span>
                  <div className="text-xs text-gray-600">
                    {account.username} / {account.password}
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    console.log('Test login clicked:', account);
                    handleTestLogin(account);
                  }}
                  className="text-xs"
                >
                  사용
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 로그인 폼 */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">공급사 검색 서비스 어드민</CardTitle>
            <CardDescription className="text-center">
              관리자 계정으로 로그인하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="username">아이디</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="관리자 아이디를 입력하세요"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "로그인 중..." : "로그인"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
