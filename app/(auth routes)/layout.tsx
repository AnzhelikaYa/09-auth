"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../globals.css";
import TanStackProvider from "../../components/TanStackProvider/TanStackProvider";
import { roboto } from "../layout";
import AuthProvider from "../../components/AuthProvider/AuthProvider";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [router]);

  return (
        <TanStackProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </TanStackProvider>
  );
}