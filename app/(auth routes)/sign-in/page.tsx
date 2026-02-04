"use client"

import css from './SignInPage.module.css'
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/clientApi";
import { useAuth } from '@/lib/store/authStore';

export default function SignInPage() {
    const router = useRouter();
    const { setUser } = useAuth();
    const [error, setError] = useState<string>("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await login({ email, password });

      if (response.user) {
        setUser(response.user);
        router.push("/profile");
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };
    

    return (
        <main className={css.mainContent}>
            <form className={css.form} onSubmit={handleSubmit}>
                <h1 className={css.formTitle}>Sign in</h1>
                <div className={css.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" name="email" className={css.input} required />
                </div>
                <div className={css.formGroup}>
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" name="password" className={css.input} required />
                </div>
                <div className={css.actions}>
                <button type="submit" className={css.submitButton}>Log in</button>
                </div>
                <p className={css.error}>{error}</p>
            </form>
        </main>
    )
}