"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { NAV_CATEGORIES } from "@/lib/categories";
import {
  CATEGORY_IMAGES_CHANGED_EVENT,
  categoryImagePath,
  defaultCategoryImagePath,
  loadCategoryImageOverrides,
  type CategoryImageOverrides,
} from "@/lib/category-images";
import { CategoryIcon } from "@/components/category-icon";

function useCategoryImageOverrides(): CategoryImageOverrides {
  const [overrides, setOverrides] = useState<CategoryImageOverrides>({});

  useEffect(() => {
    const sync = () => setOverrides(loadCategoryImageOverrides());
    sync();
    window.addEventListener(CATEGORY_IMAGES_CHANGED_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CATEGORY_IMAGES_CHANGED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return overrides;
}

/** Preserved pre-3D flat category list (icon + text rows). */
export function LegacyCategoryGrid() {
  const overrides = useCategoryImageOverrides();

  return (
    <section
      className="mx-auto max-w-6xl px-4 pt-4 pb-12 sm:px-6 sm:pb-14"
      data-hb-home-categories="photos"
      data-hb-home-style="legacy"
    >
      <ul className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 lg:grid-cols-4 animate-[fadeUp_0.7s_ease-out_0.05s_both]">
        {NAV_CATEGORIES.map((c) => {
          const src =
            categoryImagePath(c.slug, overrides) ??
            defaultCategoryImagePath(c.slug);
          const isOverride = Boolean(overrides[c.slug]);
          return (
            <li key={c.slug}>
              <Link
                href={`/kategori/${c.slug}`}
                className="group flex items-start gap-3 rounded-xl p-2 transition duration-300 hover:bg-white/70"
                data-hb-category={c.slug}
                data-hb-category-image={isOverride ? "custom" : "default"}
              >
                <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-[color-mix(in_oklab,var(--ink)_8%,white)] ring-1 ring-[color-mix(in_oklab,var(--ink)_8%,transparent)] transition duration-300 group-hover:scale-105 group-hover:shadow-md sm:size-16">
                  {src ? (
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <span
                      className="flex size-full items-center justify-center text-white"
                      style={{ backgroundColor: c.accent }}
                    >
                      <CategoryIcon slug={c.slug} className="size-6" />
                    </span>
                  )}
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="font-semibold text-[var(--ink)] group-hover:text-[var(--lagoon)]">
                    {c.name}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-[var(--muted-foreground)]">
                    {c.description}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
