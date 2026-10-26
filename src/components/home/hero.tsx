"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand-logo";
import { ArrowRight, Search } from "lucide-react";

export function HomeHero() {
  return (
    <section className="border-b border-[color-mix(in_oklab,var(--ink)_6%,transparent)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pt-8 pb-6 sm:px-6 sm:pt-10 sm:pb-8 animate-[fadeUp_0.6s_ease-out_both]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="sr-only">Harbiden Bak</h1>
          <BrandLogo
            markClassName="size-10 sm:size-11"
            wordmarkClassName="text-3xl sm:text-4xl text-[var(--ink)]"
          />
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="h-11 bg-[var(--lagoon)] px-5 text-white transition hover:bg-[#be185d] hover:scale-[1.02]"
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
              className="h-11 border-[color-mix(in_oklab,var(--lagoon)_30%,transparent)] px-5 transition hover:bg-[var(--mist)] hover:scale-[1.02]"
            >
              <Link href="/ilan/yeni">
                Ücretsiz ilan ver
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
