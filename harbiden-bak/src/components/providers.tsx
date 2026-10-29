"use client";

import { AuthProvider } from "@/context/auth-context";
import { ListingsProvider } from "@/context/listings-context";
import { UserPrefsProvider } from "@/context/user-prefs-context";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ListingsProvider>
        <UserPrefsProvider>{children}</UserPrefsProvider>
      </ListingsProvider>
    </AuthProvider>
  );
}
