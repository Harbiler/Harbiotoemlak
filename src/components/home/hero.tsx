"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search } from "lucide-react";

export function HomeHero() {
  return (
    <section className="relative isolate min-h-[min(92vh,780px)] overflow-hidden">
      {/* Full-bleed dominant visual plane */}
      <div
        className="absolute inset-0 origin-center animate-[heroPan_1.4s_ease-out_both] bg-[linear-gradient(152deg,#4a1830_0%,#9d174d_34%,#db2777_62%,#f472b6_92%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 30%, rgba(255,255,255,0.28) 0%, transparent 42%), radial-gradient(ellipse at 85% 15%, rgba(251,207,232,0.35) 0%, transparent 38%), radial-gradient(ellipse at 60% 90%, rgba(74,24,48,0.35) 0%, transparent 50%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto flex min-h-[min(92vh,780px)] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-24 sm:pt-32">
        <h1 className="sr-only">Harbiden Bak</h1>
        <div className="flex flex-wrap gap-3 animate-[fadeUp_0.95s_ease-out_both]">
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
