import { User } from "@/types/user";
import { create } from "zustand";

interface AuthStore {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    logout: () => void;
}

export const useAuth = create<AuthStore>()((set) => ({
    user: null,
    isAuthenticated: false,
    setUser: (user) => set({ user, isAuthenticated: Boolean(user) }),
    logout: () => set({ user: null, isAuthenticated: false }),
}));