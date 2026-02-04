"use client"

import Link from "next/link"
import css from "./AuthNavigation.module.css"
import { useAuth } from "@/lib/store/authStore"
import { api } from "../../lib/api/api";
import { useRouter } from "next/navigation";

export default function AuthNavigation() {
    const { isAuthenticated, user, logout } = useAuth()
    const router = useRouter()
    
    const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      logout();
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
    return (
        <>
            {isAuthenticated ?
                <>
                    <li className={css.navigationItem}>
                        <Link href="/profile" prefetch={false} className={css.navigationLink}>Profile</Link>
                    </li>
                    <li className={css.navigationItem}>
                        <p className={css.userEmail}>{user?.email}</p>
                        <button onClick={handleLogout} className={css.logoutButton}>Logout</button>
                    </li>
                </>

                :

                <>
                    <li className={css.navigationItem}>
                        <Link href="/sign-in" prefetch={false} className={css.navigationLink}>Login</Link>
                    </li>
                    <li className={css.navigationItem}>
                        <Link href="/sign-up" prefetch={false} className={css.navigationLink}>Sign up</Link>
                    </li>
                </>
            }
        </>
    )
}