"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkSession, getCurrentUser } from "@/lib/api/clientApi";
import { useAuth } from "@/lib/store/authStore";

interface AuthProviderProps {
  children: ReactNode;
}

const privateRoutes = ["/profile"];
const publicRoutes = ["/sign-in", "/sign-up"];

export default function AuthProvider({ children }: AuthProviderProps) {
  const [loading, setLoading] = useState(true);
  const { user, setUser, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);

      try {

        const sessionUser = await checkSession();

        if (sessionUser) {
          const currentUser = await getCurrentUser();
          setUser(currentUser);

          if (publicRoutes.some((route) => pathname.startsWith(route))) {
            router.replace("/profile");
          }
        } else {
          logout();

          if (privateRoutes.some((route) => pathname.startsWith(route))) {
            router.replace("/sign-in");
          }
        }
      } catch (error) {
        console.error("AuthProvider error:", error);
        logout();

        if (privateRoutes.some((route) => pathname.startsWith(route))) {
          router.replace("/sign-in");
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [pathname, router, setUser, logout]);

  
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
        <div
          style={{
            width: 40,
            height: 40,
            border: "4px solid #ccc",
            borderTopColor: "#0070f3",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <style jsx>{`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }


  if (!user && privateRoutes.some((route) => pathname.startsWith(route))) {
    return null;
  }

  return <>{children}</>;
}
