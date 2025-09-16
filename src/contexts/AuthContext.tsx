"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  department: string;
  lastLogin: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 클라이언트에서만 실행
    if (typeof window !== "undefined") {
      console.log("AuthContext: Initializing...");
      const savedUser = localStorage.getItem("currentUser");
      if (savedUser) {
        try {
          console.log("AuthContext: Found saved user:", savedUser);
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error("Error parsing saved user:", error);
          localStorage.removeItem("currentUser");
        }
      } else {
        console.log("AuthContext: No saved user found");
      }
      console.log("AuthContext: Setting loading to false");
      setLoading(false);
    } else {
      // 서버 사이드에서는 즉시 로딩 완료
      console.log("AuthContext: Server side, setting loading to false");
      setLoading(false);
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("currentUser", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
