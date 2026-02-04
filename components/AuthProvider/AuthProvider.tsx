"use client";

import { ReactNode, useEffect, useState } from "react";
import { checkSession } from "@/lib/api/clientApi";
import { useAuth } from "@/lib/store/authStore";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [loading, setLoading] = useState(true);
  const setUser = useAuth((state) => state.setUser);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await checkSession();

        if (user) {
          
          setUser(user);
        } else {
         
          setUser(null);
        }
      } catch (error) {
        console.error("AuthProvider error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [setUser]);

  if (loading) return <div>Loading...</div>;

  return <>{children}</>;
}
