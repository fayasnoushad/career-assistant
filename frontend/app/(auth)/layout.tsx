"use client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import Loading from "../components/Loading/Loading";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  useEffect(() => {
    if (Cookies.get("token")) {
      router.push("/");
    }
  }, [router]);

  return (
    <div className="min-h-[80vh] flex flex-col pt-[10vh] items-center">
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </div>
  );
}
