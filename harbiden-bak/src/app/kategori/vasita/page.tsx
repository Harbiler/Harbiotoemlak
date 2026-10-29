"use client";

import Link from "next/link";
import { getCategory } from "@/lib/categories";
import {
  VASITA_SUBCATEGORIES,
  vasitaSubPath,
} from "@/lib/vasita-subcategories";
import { CategoryIcon } from "@/components/category-icon";
import { Button } from "@/components/ui/button";
import { ChevronRight, Plus } from "lucide-react";

export default function VasitaHubPage() {
  const category = getCategory("vasita")!;

  return (
    <div>
      <div
        className="border-b border-[color-mix(in_oklab,var(--ink)_8%,transparent)]"
        style={{
          background: `linear-gradient(120deg, ${category.accent}22, transparent 55%)`,
        }}
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-4 py-12 sm:px-6">
          <div className="flex items-start gap-4">
            <span
              className="flex size-14 items-center justify-center rounded-2xl text-white shadow-md"
              style={{ backgroundColor: category.accent }}
            >
              <CategoryIcon slug={category.slug} className="size-7" />
            </span>
            <div>
              <h1 className="hb-display text-3xl font-bold text-[var(--ink)] sm:text-4xl">
                {category.name}
              </h1>
              <p className="mt-1 max-w-xl text-[var(--muted-foreground)]">
                Alt kategoriyi seçin; her bölümde marka ve modeller listelenir.
              </p>
            </div>
          </div>
          <Button asChild className="bg-[var(--lagoon)] hover:bg-[#be185d]">
            <Link href={`/ilan/yeni?kategori=vasita`}>
              <Plus className="size-4" />
              Vasıta ilanı ver
            </Link>
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="hb-surface overflow-hidden">
          <ul className="divide-y divide-[color-mix(in_oklab,var(--ink)_8%,transparent)]">
            {VASITA_SUBCATEGORIES.map((sub) => {
              const brandCount = Object.keys(sub.brands).length;
              const modelCount = Object.values(sub.brands).reduce(
                (n, models) => n + models.length,
                0,
              );
              return (
                <li key={sub.slug}>
                  <Link
                    href={vasitaSubPath(sub.slug)}
                    className="group flex items-center gap-4 px-4 py-4 transition-colors hover:bg-[color-mix(in_oklab,var(--lagoon)_6%,transparent)] sm:px-5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="hb-display text-base font-semibold text-[var(--ink)] group-hover:text-[var(--lagoon)] sm:text-lg">
                        {sub.name}
                      </p>
                      <p className="mt-0.5 text-sm text-[var(--muted-foreground)]">
                        {sub.description}
                      </p>
                      <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                        {brandCount} marka · {modelCount} model
                      </p>
                    </div>
                    <ChevronRight className="size-5 shrink-0 text-[var(--muted-foreground)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--lagoon)]" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
