"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, EyeOff, Shield } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import {
  loadRememberPreference,
  loadRememberedEmail,
} from "@/lib/storage";

function LoginInner() {
  const { login, user, ready } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const adminHint = searchParams.get("admin") === "1";

  const [email, setEmail] = useState(adminHint ? "admin@harbidenbak.com" : "");
  const [password, setPassword] = useState(adminHint ? "admin123" : "");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (adminHint) return;
    setRemember(loadRememberPreference());
    const saved = loadRememberedEmail();
    if (saved) setEmail(saved);
  }, [adminHint]);

  useEffect(() => {
    if (ready && user) {
      if (adminHint && user.role === "admin") router.replace("/admin");
      else router.replace(next);
    }
  }, [ready, user, router, next, adminHint]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = login(email, password, remember);
    if (!result.ok) {
      setError(result.error);
      return;
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-2 sm:px-6">
      <div className="relative overflow-hidden rounded-[1.75rem] bg-[linear-gradient(160deg,#4a1830_0%,#9d174d_45%,#db2777_100%)] px-8 py-12 text-white">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 80% 20%, rgba(251,207,232,0.45), transparent 50%)",
          }}
        />
        <div className="relative">
          <BrandLogo inverted markClassName="size-11 sm:size-12" wordmarkClassName="text-4xl sm:text-4xl" />
          <p className="mt-4 max-w-sm text-white/70">
            Hesabınıza giriş yapın; ilan verin, favorilerinizi yönetin veya kurumsal portföyünüzü
            güncelleyin.
          </p>
          {adminHint && (
            <div className="mt-8 flex items-start gap-3 rounded-xl bg-white/10 p-4 text-sm">
              <Shield className="mt-0.5 size-5 shrink-0" />
              <div>
                <p className="font-semibold">Admin Yönetim Paneli</p>
                <p className="mt-1 text-white/70">
                  Demo: admin@harbidenbak.com / admin123 — giriş sonrası panele yönlendirilirsiniz.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto w-full max-w-md self-center">
        <h1 className="hb-display text-3xl font-bold text-[var(--ink)]">Giriş Yap</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Hesabınız yok mu?{" "}
          <Link href="/uye-ol" className="font-medium text-[var(--lagoon)] hover:underline">
            Üye Ol
          </Link>
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div>
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              type="email"
              className="mt-1.5 bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="password">Şifre</Label>
              <button
                type="button"
                onClick={() => setForgotOpen(true)}
                className="text-xs font-medium text-[var(--lagoon)] hover:underline"
              >
                Şifremi unuttum
              </button>
            </div>
            <div className="relative mt-1.5">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                className="bg-white pr-11"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-[var(--muted-foreground)] hover:text-[var(--ink)]"
                aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="mt-2 text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--lagoon)]"
            >
              {showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
            </button>
          </div>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-[var(--ink)]">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="size-4 rounded border border-[var(--border)] accent-[var(--lagoon)]"
            />
            Beni Hatırla
          </label>
          <Button type="submit" className="w-full bg-[var(--lagoon)] hover:bg-[#be185d]">
            Giriş Yap
          </Button>
        </form>

        <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Şifremi unuttum</DialogTitle>
              <DialogDescription>
                E-posta ile sıfırlama yakında. Şimdilik hesabınıza erişemiyorsanız destek için
                site yöneticisiyle iletişime geçin.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                className="bg-[var(--lagoon)] hover:bg-[#be185d]"
                onClick={() => setForgotOpen(false)}
              >
                Tamam
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={<div className="p-12 text-center text-sm text-[var(--muted-foreground)]">Yükleniyor…</div>}
    >
      <LoginInner />
    </Suspense>
  );
}
