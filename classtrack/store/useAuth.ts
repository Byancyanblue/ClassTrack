import { create } from "zustand";

interface User {
  username: string;
  role: "admin" | "dosen" | "mahasiswa";
}

interface AuthState {
  user: User | null;
  login: (data: User) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,

  login: (data) =>
    set({
      user: {
        username: data.username,
        role: data.role,
      },
    }),

  logout: () => set({ user: null }),
}));
