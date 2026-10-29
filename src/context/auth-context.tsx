"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  loadSessionUserId,
  loadUsers,
  saveRememberPreference,
  saveRememberedEmail,
  saveSessionUserId,
  saveUsers,
} from "@/lib/storage";
import { isValidTcKimlikNo, type KurumsalType, type MembershipKind, type User } from "@/lib/types";

interface RegisterInput {
  email: string;
  password: string;
  name: string;
  phone: string;
  tcKimlikNo: string;
  address: string;
  membershipKind: MembershipKind;
  kurumsalType?: KurumsalType;
  companyName?: string;
}

interface AuthContextValue {
  user: User | null;
  users: User[];
  ready: boolean;
  login: (
    email: string,
    password: string,
    remember?: boolean,
  ) => { ok: true } | { ok: false; error: string };
  register: (input: RegisterInput) => { ok: true } | { ok: false; error: string };
  logout: () => void;
  updateUser: (id: string, patch: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const all = loadUsers();
    setUsers(all);
    const sid = loadSessionUserId();
    if (sid) {
      const found = all.find((u) => u.id === sid) ?? null;
      setUser(found);
    }
    setReady(true);
  }, []);

  const persist = useCallback((next: User[]) => {
    setUsers(next);
    saveUsers(next);
  }, []);

  const login = useCallback(
    (email: string, password: string, remember = true) => {
      const found = users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
      );
      if (!found) return { ok: false as const, error: "E-posta veya şifre hatalı." };
      saveRememberPreference(remember);
      if (remember) saveRememberedEmail(found.email);
      else saveRememberedEmail(null);
      setUser(found);
      saveSessionUserId(found.id, remember);
      return { ok: true as const };
    },
    [users],
  );

  const register = useCallback(
    (input: RegisterInput) => {
      if (users.some((u) => u.email.toLowerCase() === input.email.trim().toLowerCase())) {
        return { ok: false as const, error: "Bu e-posta ile kayıtlı bir hesap var." };
      }
      if (input.membershipKind === "kurumsal" && !input.kurumsalType) {
        return { ok: false as const, error: "Kurumsal üyelik tipi seçin (Galeri veya Emlak)." };
      }
      const tc = input.tcKimlikNo.trim();
      if (!isValidTcKimlikNo(tc)) {
        return { ok: false as const, error: "T.C. Kimlik No 11 haneli olmalıdır." };
      }
      const address = input.address.trim();
      if (!address) {
        return { ok: false as const, error: "Adres zorunludur." };
      }
      const newUser: User = {
        id: `u-${Date.now()}`,
        email: input.email.trim().toLowerCase(),
        password: input.password,
        name: input.name.trim(),
        phone: input.phone.trim(),
        tcKimlikNo: tc,
        address,
        role: "user",
        membershipKind: input.membershipKind,
        kurumsalType: input.membershipKind === "kurumsal" ? input.kurumsalType : undefined,
        companyName:
          input.membershipKind === "kurumsal" ? input.companyName?.trim() : undefined,
        createdAt: new Date().toISOString(),
      };
      const next = [...users, newUser];
      persist(next);
      setUser(newUser);
      saveSessionUserId(newUser.id);
      return { ok: true as const };
    },
    [persist, users],
  );

  const logout = useCallback(() => {
    setUser(null);
    saveSessionUserId(null);
  }, []);

  const updateUser = useCallback(
    (id: string, patch: Partial<User>) => {
      const next = users.map((u) => (u.id === id ? { ...u, ...patch } : u));
      persist(next);
      setUser((cur) => (cur?.id === id ? { ...cur, ...patch } : cur));
    },
    [persist, users],
  );

  const deleteUser = useCallback(
    (id: string) => {
      const next = users.filter((u) => u.id !== id);
      persist(next);
      if (user?.id === id) {
        setUser(null);
        saveSessionUserId(null);
      }
    },
    [persist, user?.id, users],
  );

  const value = useMemo(
    () => ({ user, users, ready, login, register, logout, updateUser, deleteUser }),
    [user, users, ready, login, register, logout, updateUser, deleteUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
