"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogOut, User, ChevronRight, ChevronLeft, PanelLeft } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getMenuPermissionGroups, MenuPermissionGroup } from "@/lib/menuPermissionService";
import { getGroups, Group } from "@/lib/groupService";

interface AdminLayoutProps {
  children: React.ReactNode;
}


interface MenuItem {
  title: string;
  href: string;
  icon: string;
  subItems?: MenuItem[];
}

const allMenuItems: MenuItem[] = [
  { title: "대시보드", href: "/dashboard", icon: "📊" },
  { title: "회원 관리", href: "/members", icon: "👥" },
  { title: "공급사 관리", href: "/suppliers", icon: "🏢" },
  { title: "표준 품목 카테고리", href: "/items", icon: "📦" },
  { title: "MD 추천 관리", href: "/recommendations", icon: "⭐" },
  { title: "자유 토론방 관리", href: "/discussions", icon: "💬" },
  { title: "인사이트 관리", href: "/insights", icon: "💡" },
  { title: "1:1 문의 관리", href: "/inquiries", icon: "❓" },
  { title: "공지사항 관리", href: "/notices", icon: "📢" },
  { title: "FAQ 관리", href: "/faqs", icon: "❔" },
  { title: "배너 관리", href: "/banners", icon: "🖼️" },
  { 
    title: "검색 키워드 관리", 
    href: "/keywords", 
    icon: "🔍",
    subItems: [
      { title: "검색 키워드 관리", href: "/keywords/management", icon: "🔍" },
      { title: "인기 검색어 관리", href: "/keywords/popular", icon: "🔥" }
    ]
  },
  { title: "통계", href: "/statistics", icon: "📈" },
  { 
    title: "운영자 관리", 
    href: "/operators", 
    icon: "👨‍💼",
    subItems: [
      { title: "운영자 관리", href: "/operators/management", icon: "👥" },
      { title: "그룹관리", href: "/operators/groups", icon: "👔" },
      { title: "메뉴 권한 관리", href: "/operators/permissions", icon: "🔐" }
    ]
  },
];

// 권한에 따라 메뉴를 필터링하는 함수
const filterMenuByPermissions = (menuItems: MenuItem[], userRole: string, menuPermissionGroups: MenuPermissionGroup[]): MenuItem[] => {
  try {
    if (!userRole || !menuItems || !menuPermissionGroups) {
      return menuItems || [];
    }


    // 사용자의 그룹에 해당하는 권한 찾기
    const userPermissions = menuPermissionGroups.find(group => group.groupId === userRole);
    
    if (!userPermissions) {
      console.log('No permissions found for user role:', userRole);
      console.log('Available permission groups:', menuPermissionGroups.map(pg => ({ groupId: pg.groupId, groupName: pg.groupName })));
      return menuItems; // 권한이 없으면 모든 메뉴 표시 (fallback)
    }
    
    const permissions = userPermissions.permissions;
    console.log('User permissions for role', userRole, ':', permissions);
    
    return menuItems.filter(menuItem => {
      if (!menuItem || !menuItem.href) {
        return false;
      }

      // 메뉴 경로를 권한 키로 변환
      const menuKey = getMenuKeyFromPath(menuItem.href);
      const menuPermission = permissions[menuKey];
      
      console.log(`Menu: ${menuItem.title} (${menuItem.href}) -> Key: ${menuKey}, Permission:`, menuPermission);
      
      // view 권한이 있으면 메뉴 표시
      if (menuPermission && menuPermission.view) {
        // 하위 메뉴가 있는 경우
        if (menuItem.subItems && Array.isArray(menuItem.subItems)) {
          const filteredSubItems = menuItem.subItems.filter(subItem => {
            if (!subItem || !subItem.href) {
              return false;
            }
            const subMenuKey = getMenuKeyFromPath(subItem.href);
            const subMenuPermission = permissions[subMenuKey];
            return subMenuPermission && subMenuPermission.view;
          });
          
          // 하위 메뉴가 하나라도 있으면 부모 메뉴 표시
          if (filteredSubItems.length > 0) {
            return {
              ...menuItem,
              subItems: filteredSubItems
            };
          }
          return false;
        }
        return true;
      }
      return false;
    });
  } catch (error) {
    console.error('Error filtering menu permissions:', error);
    // 에러 발생 시 모든 메뉴 반환 (fallback)
    return menuItems || [];
  }
};

// 경로를 메뉴 키로 변환하는 함수 (메뉴 권한 관리 페이지의 키와 일치)
const getMenuKeyFromPath = (path: string): string => {
  const pathMap: Record<string, string> = {
    '/dashboard': 'dashboard',
    '/members': 'members',
    '/suppliers': 'suppliers',
    '/items': 'items',
    '/recommendations': 'recommendations',
    '/discussions': 'discussions',
    '/insights': 'insights',
    '/inquiries': 'inquiries',
    '/notices': 'notices',
    '/faqs': 'faqs',
    '/banners': 'banners',
    '/keywords': 'keywords',
    '/keywords/management': 'keywords',
    '/keywords/popular': 'keywords',
    '/statistics': 'statistics',
    '/operators': 'operators',
    '/operators/management': 'operators',
    '/operators/groups': 'groups',
    '/operators/permissions': 'groups' // 메뉴 권한 관리는 groups 키 사용
  };
  
  return pathMap[path] || path.replace('/', '');
};

// 커스텀 사이드바 컴포넌트
function CustomSidebar({ 
  menuItems, 
  pathname, 
  onNavigate,
  isCollapsed = false
}: { 
  menuItems: MenuItem[]; 
  pathname: string; 
  onNavigate: (href: string) => void;
  isCollapsed?: boolean;
}) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // 현재 경로에 따라 하위메뉴 자동 펼치기
  useEffect(() => {
    const currentPath = pathname;
    const parentMenu = menuItems.find(item => 
      item.subItems && item.subItems.some(subItem => subItem.href === currentPath)
    );
    
    if (parentMenu) {
      setExpandedItems(prev => {
        if (!prev.includes(parentMenu.href)) {
          return [...prev, parentMenu.href];
        }
        return prev;
      });
    }
  }, [pathname, menuItems]);

  const toggleExpanded = (href: string) => {
    setExpandedItems(prev => 
      prev.includes(href) 
        ? prev.filter(item => item !== href)
        : [...prev, href]
    );
  };

  const isItemActive = (item: MenuItem) => {
    if (pathname === item.href) return true;
    if (item.subItems) {
      return item.subItems.some(subItem => pathname === subItem.href);
    }
    return false;
  };

  const isSubItemActive = (subItem: MenuItem) => {
    return pathname === subItem.href;
  };

  return (
    <div className={cn("h-full bg-white border-r border-gray-200", isCollapsed ? "w-16" : "w-64")}>
      <div className={cn("p-4", isCollapsed && "p-2")}>
        {!isCollapsed && <h2 className="text-lg font-semibold text-gray-900 mb-4">메뉴</h2>}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = isItemActive(item);
            const isExpanded = expandedItems.includes(item.href);
            const hasSubItems = item.subItems && item.subItems.length > 0;

            return (
              <div key={item.href}>
                <button
                  onClick={() => {
                    if (hasSubItems) {
                      if (isCollapsed) {
                        // 접힌 상태에서는 하위메뉴가 있는 경우 첫 번째 하위메뉴로 이동
                        onNavigate(item.subItems![0].href);
                      } else {
                        toggleExpanded(item.href);
                      }
                    } else {
                      onNavigate(item.href);
                    }
                  }}
                  className={cn(
                    "w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isCollapsed ? "justify-center" : "gap-3",
                    isActive
                      ? "text-blue-700"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )}
                  title={isCollapsed ? item.title : undefined}
                >
                  <span className="text-lg">{item.icon}</span>
                  {!isCollapsed && <span className="flex-1 text-left">{item.title}</span>}
                  {hasSubItems && !isCollapsed && (
                    <ChevronRight 
                      className={cn(
                        "h-4 w-4 transition-transform",
                        isExpanded ? "rotate-90" : ""
                      )} 
                    />
                  )}
                </button>
                
                {/* 하위메뉴 - 접힌 상태에서는 표시하지 않음 */}
                {hasSubItems && isExpanded && !isCollapsed && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.subItems!.map((subItem) => {
                      const isSubActive = isSubItemActive(subItem);
                      return (
                        <button
                          key={subItem.href}
                          onClick={() => onNavigate(subItem.href)}
                          className={cn(
                            "w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                            isSubActive
                              ? "text-blue-700"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          )}
                        >
                          <span className="text-sm">{subItem.icon}</span>
                          <span className="flex-1 text-left">{subItem.title}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);
  const [menuPermissionGroups, setMenuPermissionGroups] = useState<MenuPermissionGroup[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // 메뉴 권한 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        const [permissions, groupsData] = await Promise.all([
          getMenuPermissionGroups(),
          getGroups()
        ]);
        setMenuPermissionGroups(permissions);
        setGroups(groupsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user]);

  // 사용자 그룹 이름 가져오기
  const userGroupName = user?.role ? groups.find(group => group.id === user.role)?.name || user.role : '';

  // 권한에 따라 필터링된 메뉴
  const menuItems = user && user.role && !loading 
    ? filterMenuByPermissions(allMenuItems, user.role, menuPermissionGroups) 
    : allMenuItems;

  const handleLogout = useCallback(() => {
    logout();
    router.push("/login");
  }, [logout, router]);

  const toggleDesktopSidebar = useCallback(() => {
    setIsDesktopSidebarCollapsed(prev => !prev);
  }, []);



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">메뉴 권한을 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
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
            
            {/* 데스크톱 사이드바 토글 버튼 */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleDesktopSidebar}
              className="hidden lg:flex"
            >
              {isDesktopSidebarCollapsed ? <PanelLeft className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </Button>
            
            <h1 className="text-xl font-semibold text-gray-900">공급사 검색 서비스 어드민</h1>
          </div>
          
          {/* 사용자 정보 및 로그아웃 */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span className="font-medium">{user?.username}</span>
              <Badge variant="outline">{userGroupName}</Badge>
            </div>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              로그아웃
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* 데스크톱 사이드바 */}
        <aside className={cn(
          "hidden lg:block bg-white border-r border-gray-200 h-full flex-shrink-0 transition-all duration-300 overflow-y-auto",
          isDesktopSidebarCollapsed ? "w-16" : "w-64"
        )}>
          <CustomSidebar
            menuItems={menuItems}
            pathname={pathname}
            onNavigate={(href) => router.push(href)}
            isCollapsed={isDesktopSidebarCollapsed}
          />
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
      </div>
    </ProtectedRoute>
  );
}
