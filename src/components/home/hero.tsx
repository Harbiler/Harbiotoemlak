"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search } from "lucide-react";

export function HomeHero() {
  return (
    <section className="relative isolate min-h-[min(92vh,780px)] overflow-hidden">
      {/* Full-bleed dominant visual plane */}
      <div
        className="absolute inset-0 origin-center animate-[heroPan_1.4s_ease-out_both] bg-[linear-gradient(152deg,#062a32_0%,#0a4a4f_36%,#0d6e6e_62%,#1a567a_88%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 30%, rgba(255,255,255,0.22) 0%, transparent 42%), radial-gradient(ellipse at 85% 15%, rgba(212,165,116,0.18) 0%, transparent 38%), radial-gradient(ellipse at 60% 90%, rgba(0,0,0,0.28) 0%, transparent 50%)",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='72' height='72' viewBox='0 0 72 72' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M36 0L72 36 36 72 0 36z' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-[min(92vh,780px)] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-24 sm:pt-32">
        <h1 className="hb-display max-w-3xl text-5xl font-extrabold leading-[0.92] tracking-tight text-white sm:text-7xl md:text-[5.5rem] animate-[fadeUp_0.75s_ease-out_both]">
          Harbiden Bak
        </h1>
        <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/85 sm:text-xl animate-[fadeUp_0.85s_ease-out_0.1s_both]">
          Vasıta, emlak ve hizmet ilanları — Türkiye&apos;nin sınıflandırılmış pazaryeri.
        </p>
        <div className="mt-9 flex flex-wrap gap-3 animate-[fadeUp_0.95s_ease-out_0.18s_both]">
          <Button
            asChild
            size="lg"
            className="h-11 bg-white px-5 text-[var(--ink)] transition hover:bg-white/90 hover:scale-[1.02]"
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
            className="h-11 border-white/35 bg-white/10 px-5 text-white transition hover:bg-white/20 hover:text-white hover:scale-[1.02]"
          >
            <Link href="/ilan/yeni">
              Ücretsiz ilan ver
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
