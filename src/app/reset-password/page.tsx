"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getOperators, updateOperator } from "@/lib/operatorService";
import { ArrowLeft } from "lucide-react";

export default function ResetPasswordPage() {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: 사용자 확인, 2: 비밀번호 재설정
  const router = useRouter();

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const operators = await getOperators();
      const operator = operators.find(op => op.username === username && op.status === "active");

      if (operator) {
        setStep(2);
        setSuccess("사용자를 확인했습니다. 새 비밀번호를 입력하세요.");
      } else {
        setError("존재하지 않는 사용자이거나 비활성화된 계정입니다.");
      }
    } catch (error) {
      console.error("Error checking user:", error);
      setError("사용자 확인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (newPassword !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      setLoading(false);
      return;
    }

    try {
      const operators = await getOperators();
      const operator = operators.find(op => op.username === username && op.status === "active");

      if (operator) {
        await updateOperator(operator.id!, {
          password: newPassword
        });
        
        setSuccess("비밀번호가 성공적으로 재설정되었습니다.");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError("사용자를 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setError("비밀번호 재설정 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      setSuccess("");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            비밀번호 재설정
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 1 ? "사용자명을 입력하세요" : "새 비밀번호를 입력하세요"}
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="p-0 h-auto"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              {step === 1 ? "사용자 확인" : "비밀번호 재설정"}
            </CardTitle>
            <CardDescription>
              {step === 1 
                ? "비밀번호를 재설정할 사용자의 아이디를 입력하세요"
                : "새로운 비밀번호를 입력하세요"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <form onSubmit={handleUsernameSubmit} className="space-y-4">
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
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? "확인 중..." : "다음"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {success && (
                  <Alert className="border-green-200 bg-green-50">
                    <AlertDescription className="text-green-800">{success}</AlertDescription>
                  </Alert>
                )}
                
                <div>
                  <Label htmlFor="newPassword">새 비밀번호</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="새 비밀번호를 입력하세요"
                    required
                    disabled={loading}
                  />
                </div>
                
                <div>
                  <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="비밀번호를 다시 입력하세요"
                    required
                    disabled={loading}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? "재설정 중..." : "비밀번호 재설정"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
