"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import css from "./EditProfilePage.module.css";
import { useAuth } from "@/lib/store/authStore";
import { updateCurrentUser } from "@/lib/api/clientApi";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuth();

  const [username, setUsername] = useState(user?.username || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Username cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      const updatedUser = await updateCurrentUser({ username });
      if (updatedUser) {
        setUser(updatedUser);
        router.push("/profile");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <div className={css.avatarWrapper}>
          <Image
            src={user?.avatar || "/default-avatar.png"}
            alt={user?.username || "User Avatar"}
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <p>Email: {user?.email}</p>

          {error && <p className={css.error}>{error}</p>}

          <div className={css.actions}>
            <button type="submit" className={css.saveButton} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
            <button type="button" className={css.cancelButton} onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}