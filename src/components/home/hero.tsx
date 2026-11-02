"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, LayoutGrid, Search } from "lucide-react";

export function HomeHero() {
  return (
    <section
      className="relative overflow-hidden border-b border-[color-mix(in_oklab,var(--ink)_6%,transparent)]"
      data-hb-home-hero="depth-3d"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_12%_-10%,color-mix(in_oklab,var(--sand)_55%,transparent),transparent_55%),radial-gradient(ellipse_70%_50%_at_88%_0%,color-mix(in_oklab,var(--mist)_80%,transparent),transparent_50%)]"
      />
      <div className="relative mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 pt-8 pb-6 sm:px-6 sm:pt-10 sm:pb-8 animate-[fadeUp_0.6s_ease-out_both]">
        <h1 className="sr-only">Harbiden Bak</h1>
        <Button
          asChild
          size="lg"
          className="hb-cta-depth h-11 bg-[var(--lagoon)] px-5 text-white transition duration-300 hover:bg-[#be185d] hover:-translate-y-0.5"
        >
          <Link href="/ara">
            <Search className="size-4" />
            İlan ara
          </Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="hb-cta-depth-outline h-11 border-[color-mix(in_oklab,var(--lagoon)_30%,transparent)] bg-white/80 px-5 backdrop-blur-sm transition duration-300 hover:bg-[var(--mist)] hover:-translate-y-0.5"
        >
          <Link href="/ilan/yeni">
            Ücretsiz ilan ver
            <ArrowRight className="size-4" />
          </Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="hb-cta-depth-outline h-11 border-[color-mix(in_oklab,var(--lagoon)_35%,transparent)] bg-white/80 px-5 text-[var(--lagoon)] backdrop-blur-sm transition duration-300 hover:bg-[var(--mist)] hover:text-[var(--lagoon)] hover:-translate-y-0.5"
        >
          <Link href="/ara?tum=1" data-hb-home-all-listings data-hb-all-listings>
            <LayoutGrid className="size-4" />
            Tüm ilanları gör
          </Link>
        </Button>
      </div>
    </section>
  );
}
