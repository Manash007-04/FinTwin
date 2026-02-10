"use client";

import Dashboard from "@/components/Dashboard";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { token } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  if (!token) return null; // Or a loading spinner

  return <Dashboard />;
}
