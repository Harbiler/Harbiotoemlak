"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Heart, Menu, Plus, Search, Shield, LogOut, User as UserIcon } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CategoryIcon } from "@/components/category-icon";
import { BrandLogo } from "@/components/brand-logo";
import { FormEvent, useState } from "react";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const { user, logout, ready } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/ara?q=${encodeURIComponent(query)}` : "/ara");
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[color-mix(in_oklab,var(--lagoon)_14%,transparent)] bg-[color-mix(in_oklab,#fdf4f7_88%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menü">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] overflow-y-auto bg-[var(--background)]">
              <SheetHeader>
                <SheetTitle className="hb-display text-xl text-[var(--ink)]">
                  Kategoriler
                </SheetTitle>
              </SheetHeader>
              <form onSubmit={onSearch} className="mt-4 flex gap-2 px-1">
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="İlan ara…"
                  className="bg-white"
                />
                <Button type="submit" size="icon" className="bg-[var(--lagoon)] shrink-0">
                  <Search className="size-4" />
                </Button>
              </form>
              <nav className="mt-4 flex flex-col gap-1 pb-8">
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/kategori/${c.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[var(--ink)] hover:bg-[var(--mist)]"
                  >
                    <span
                      className="flex size-8 items-center justify-center rounded-md text-white"
                      style={{ backgroundColor: c.accent }}
                    >
                      <CategoryIcon slug={c.slug} className="size-4" />
                    </span>
                    {c.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="group transition hover:opacity-90">
            <BrandLogo />
          </Link>
        </div>

        <form
          onSubmit={onSearch}
          className="relative mx-auto hidden min-w-0 flex-1 max-w-md md:block"
        >
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Kelime, marka veya konum ara…"
            className="h-9 border-[color-mix(in_oklab,var(--lagoon)_16%,transparent)] bg-white/90 pl-9"
            aria-label="İlan ara"
          />
        </form>

        <nav className="hidden items-center gap-0.5 xl:flex">
          {CATEGORIES.slice(0, 4).map((c) => (
            <Link
              key={c.slug}
              href={`/kategori/${c.slug}`}
              className={cn(
                "rounded-md px-2 py-1.5 text-sm font-medium text-[var(--muted-foreground)] transition hover:bg-[var(--mist)] hover:text-[var(--ink)]",
                pathname?.startsWith(`/kategori/${c.slug}`) && "bg-[var(--mist)] text-[var(--ink)]",
              )}
            >
              {c.shortName}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-[var(--muted-foreground)]">
                Daha fazla
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {CATEGORIES.slice(4).map((c) => (
                <DropdownMenuItem key={c.slug} asChild>
                  <Link href={`/kategori/${c.slug}`}>{c.name}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <Button asChild variant="ghost" size="icon" className="md:hidden" aria-label="Ara">
            <Link href="/ara">
              <Search className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="Favoriler">
            <Link href="/favoriler">
              <Heart className="size-4" />
            </Link>
          </Button>
          {ready && user ? (
            <>
              <Button
                asChild
                size="sm"
                className="hidden bg-[var(--lagoon)] hover:bg-[#be185d] sm:inline-flex"
              >
                <Link href="/ilan/yeni">
                  <Plus className="size-4" />
                  İlan Ver
                </Link>
              </Button>
              {user.role === "admin" && (
                <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
                  <Link href="/admin">
                    <Shield className="size-4" />
                    Admin
                  </Link>
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <UserIcon className="size-4" />
                    <span className="hidden max-w-[100px] truncate lg:inline">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/hesabim">Hesabım</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/favoriler">Favorilerim</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/ilan/yeni">İlan Ver</Link>
                  </DropdownMenuItem>
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Yönetim Paneli</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="size-4" />
                    Çıkış Yap
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/giris">Giriş Yap</Link>
              </Button>
              <Button asChild size="sm" className="bg-[var(--lagoon)] hover:bg-[#be185d]">
                <Link href="/uye-ol">Üye Ol</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
