"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkSession } from "@/lib/api/clientApi";
import { useAuth } from "@/lib/store/authStore";

interface AuthProviderProps {
  children: ReactNode;
}

const privateRoutes = ["/profile"];
const publicRoutes = ["/sign-in", "/sign-up"];

export default function AuthProvider({ children }: AuthProviderProps) {
  const [loading, setLoading] = useState(true);
  const setUser = useAuth((state) => state.setUser);
  const logout = useAuth((state) => state.logout);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        const user = await checkSession();

        if (user) {
          setUser(user);

        
          if (publicRoutes.some((route) => pathname.startsWith(route))) {
            router.replace("/profile");
          }
        } else {
          setUser(null);
          logout();

          
          if (privateRoutes.some((route) => pathname.startsWith(route))) {
            router.replace("/sign-in");
          }
        }
      } catch (error) {
        console.error("AuthProvider error:", error);
        setUser(null);
        logout();

        if (privateRoutes.some((route) => pathname.startsWith(route))) {
          router.replace("/sign-in");
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [pathname, setUser, logout, router]);

  
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
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

  
  if (!useAuth.getState().user && privateRoutes.some((route) => pathname.startsWith(route))) {
    return null;
  }

  return <>{children}</>;
}
