"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import type { KurumsalType, MembershipKind } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const { register, user, ready } = useAuth();
  const router = useRouter();

  const [membershipKind, setMembershipKind] = useState<MembershipKind>("bireysel");
  const [kurumsalType, setKurumsalType] = useState<KurumsalType>("galeri");
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ready && user) router.replace("/hesabim");
  }, [ready, user, router]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = register({
      email,
      password,
      name,
      phone,
      membershipKind,
      kurumsalType: membershipKind === "kurumsal" ? kurumsalType : undefined,
      companyName: membershipKind === "kurumsal" ? companyName : undefined,
    });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push("/hesabim");
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <h1 className="hb-display text-3xl font-bold text-[var(--ink)]">
        Üye Ol
      </h1>
      <p className="mt-1 text-sm text-stone-600">
        Zaten üye misiniz?{" "}
        <Link href="/giris" className="font-medium text-[var(--lagoon)] hover:underline">
          Giriş Yap
        </Link>
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div>
          <Label className="mb-2 block">Üyelik tipi</Label>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { id: "bireysel", label: "Bireysel", desc: "Kişisel ilanlar" },
                { id: "kurumsal", label: "Kurumsal", desc: "Galeri / Emlak" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setMembershipKind(opt.id)}
                className={cn(
                  "rounded-xl border px-4 py-3 text-left transition",
                  membershipKind === opt.id
                    ? "border-teal-700 bg-teal-900/5 ring-2 ring-teal-700/30"
                    : "border-teal-900/10 bg-white/50 hover:border-teal-800/25",
                )}
              >
                <p className="font-semibold text-stone-900">{opt.label}</p>
                <p className="text-xs text-stone-500">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {membershipKind === "kurumsal" && (
          <div>
            <Label className="mb-2 block">Kurumsal üyelik tipi</Label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: "galeri", label: "Galeri", desc: "Araç galerisi" },
                  { id: "emlak", label: "Emlak", desc: "Emlak ofisi" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setKurumsalType(opt.id)}
                  className={cn(
                    "rounded-xl border px-4 py-3 text-left transition",
                    kurumsalType === opt.id
                      ? "border-teal-700 bg-teal-900/5 ring-2 ring-teal-700/30"
                      : "border-teal-900/10 bg-white/50 hover:border-teal-800/25",
                  )}
                >
                  <p className="font-semibold text-stone-900">{opt.label}</p>
                  <p className="text-xs text-stone-500">{opt.desc}</p>
                </button>
              ))}
            </div>
            <div className="mt-4">
              <Label htmlFor="company">Firma adı</Label>
              <Input
                id="company"
                className="mt-1.5"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                placeholder="örn. Kaya Oto Galeri"
              />
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="name">Ad Soyad</Label>
          <Input
            id="name"
            className="mt-1.5"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">E-posta</Label>
          <Input
            id="email"
            type="email"
            className="mt-1.5"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Telefon</Label>
          <Input
            id="phone"
            className="mt-1.5"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="05xx xxx xx xx"
          />
        </div>
        <div>
          <Label htmlFor="password">Şifre</Label>
          <Input
            id="password"
            type="password"
            className="mt-1.5"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <Button type="submit" className="w-full bg-[var(--lagoon)] hover:bg-[#0a5a5a]">
          Kayıt ol
        </Button>
      </form>
    </div>
  );
}
