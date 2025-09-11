"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogOut, User, ChevronRight } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface AdminUser {
  username: string;
  role: string;
  loginTime: string;
}

interface MenuItem {
  title: string;
  href: string;
  icon: string;
}

const menuItems: MenuItem[] = [
  { title: "대시보드", href: "/dashboard", icon: "📊" },
  { title: "회원 관리", href: "/members", icon: "👥" },
  { title: "공급사 관리", href: "/suppliers", icon: "🏢" },
  { title: "표준 품목 관리", href: "/items", icon: "📦" },
  { title: "MD 추천 관리", href: "/recommendations", icon: "⭐" },
  { title: "자유 토론방 관리", href: "/discussions", icon: "💬" },
  { title: "인사이트 관리", href: "/insights", icon: "💡" },
  { title: "1:1 문의 관리", href: "/inquiries", icon: "❓" },
  { title: "공지사항 관리", href: "/notices", icon: "📢" },
  { title: "FAQ 관리", href: "/faqs", icon: "❔" },
  { title: "배너 관리", href: "/banners", icon: "🖼️" },
  { title: "검색 키워드 관리", href: "/keywords", icon: "🔍" },
  { title: "통계", href: "/statistics", icon: "📈" },
  { title: "운영자 관리", href: "/operators", icon: "👨‍💼" },
];

// 커스텀 사이드바 컴포넌트
function CustomSidebar({ 
  menuItems, 
  pathname, 
  onNavigate 
}: { 
  menuItems: MenuItem[]; 
  pathname: string; 
  onNavigate: (href: string) => void; 
}) {
  return (
    <div className="h-full bg-white border-r border-gray-200">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">메뉴</h2>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <button
                key={item.href}
                onClick={() => onNavigate(item.href)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="flex-1 text-left">{item.title}</span>
                {isActive && <ChevronRight className="h-4 w-4" />}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem('adminUser');
    setAdminUser(null);
    router.push("/");
  }, [router]);

  useEffect(() => {
    // 세션 스토리지에서 로그인 정보 확인
    const userData = sessionStorage.getItem('adminUser');
    if (userData) {
      try {
        setAdminUser(JSON.parse(userData));
      } catch (error) {
        console.error('Failed to parse admin user data:', error);
        handleLogout();
      }
    } else {
      // 로그인 정보가 없으면 로그인 페이지로 리다이렉트
      router.push("/");
    }
  }, [router, handleLogout]);

  // 로그인 정보가 없으면 로딩 표시
  if (!adminUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <CustomSidebar
                  menuItems={menuItems}
                  pathname={pathname}
                  onNavigate={(href) => {
                    router.push(href);
                    setIsSidebarOpen(false);
                  }}
                />
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-semibold text-gray-900">공급사 검색 서비스 어드민</h1>
          </div>
          
          {/* 사용자 정보 및 로그아웃 */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span className="font-medium">{adminUser.username}</span>
              <Badge variant="outline">{adminUser.role}</Badge>
            </div>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              로그아웃
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* 데스크톱 사이드바 */}
        <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-screen">
          <CustomSidebar
            menuItems={menuItems}
            pathname={pathname}
            onNavigate={(href) => router.push(href)}
          />
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
