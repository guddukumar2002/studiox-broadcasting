"use client";

import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/auth/login");
    } else if (user.role === "teacher") {
      router.replace("/teacher/dashboard");
    } else {
      router.replace("/principal/dashboard");
    }
  }, [user, loading, router]);

  // Minimal invisible placeholder — redirect fires immediately
  return null;
}
