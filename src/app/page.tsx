"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("HomePage: loading =", loading, "user =", user);
    if (!loading) {
      if (user) {
        console.log("HomePage: Redirecting to dashboard");
        router.push("/dashboard");
      } else {
        console.log("HomePage: Redirecting to login");
        router.push("/login");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-gray-600">로딩 중...</p>
      </div>
    </div>
  );
}
