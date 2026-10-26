"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

function LoginInner() {
  const { login, user, ready } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const adminHint = searchParams.get("admin") === "1";

  const [email, setEmail] = useState(adminHint ? "admin@harbidenbak.com" : "");
  const [password, setPassword] = useState(adminHint ? "admin123" : "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ready && user) {
      if (adminHint && user.role === "admin") router.replace("/admin");
      else router.replace(next);
    }
  }, [ready, user, router, next, adminHint]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = login(email, password);
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
            <Label htmlFor="password">Şifre</Label>
            <Input
              id="password"
              type="password"
              className="mt-1.5 bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" className="w-full bg-[var(--lagoon)] hover:bg-[#be185d]">
            Giriş Yap
          </Button>
        </form>

        <div className="hb-surface mt-8 p-4 text-sm text-[var(--muted-foreground)]">
          <p className="font-semibold text-[var(--ink)]">Demo hesaplar</p>
          <ul className="mt-2 space-y-1 text-xs leading-relaxed">
            <li>
              <strong>Admin:</strong> admin@harbidenbak.com / admin123
            </li>
            <li>
              <strong>Bireysel:</strong> ayse@ornek.com / demo123
            </li>
            <li>
              <strong>Galeri:</strong> galeri@ornek.com / demo123
            </li>
            <li>
              <strong>Emlak:</strong> emlak@ornek.com / demo123
            </li>
          </ul>
          <Button asChild variant="link" className="mt-2 h-auto px-0 text-[var(--lagoon)]">
            <Link href="/giris?admin=1">
              <Shield className="size-3.5" />
              Admin Yönetim Paneli
            </Link>
          </Button>
        </div>
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
