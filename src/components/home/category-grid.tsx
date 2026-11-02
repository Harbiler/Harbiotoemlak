"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NAV_CATEGORIES } from "@/lib/categories";
import {
  CATEGORY_IMAGES_CHANGED_EVENT,
  categoryImagePath,
  defaultCategoryImagePath,
  loadCategoryImageOverrides,
  type CategoryImageOverrides,
} from "@/lib/category-images";
import { CategoryTileImage } from "@/components/home/category-tile-image";

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

export function CategoryGrid() {
  const overrides = useCategoryImageOverrides();

  return (
    <section
      className="hb-perspective-stage relative mx-auto max-w-6xl px-4 pt-2 pb-14 sm:px-6 sm:pb-16"
      data-hb-home-categories="photos"
      data-hb-home-style="depth-3d"
    >
      <ul className="hb-tile-scene grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6 lg:gap-4 animate-[fadeUp_0.7s_ease-out_0.05s_both]">
        {NAV_CATEGORIES.map((c, i) => {
          const src =
            categoryImagePath(c.slug, overrides) ??
            defaultCategoryImagePath(c.slug);
          const isOverride = Boolean(overrides[c.slug]);
          return (
            <li
              key={c.slug}
              className="hb-tile-item"
              style={{ animationDelay: `${0.04 + i * 0.03}s` }}
            >
              <Link
                href={`/kategori/${c.slug}`}
                className="hb-depth-tile group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lagoon)] focus-visible:ring-offset-2"
                data-hb-category={c.slug}
                data-hb-category-image={isOverride ? "custom" : "default"}
              >
                <span className="hb-depth-tile__face relative flex h-full flex-col overflow-hidden rounded-2xl bg-white">
                  <span className="relative aspect-[5/4] w-full overflow-hidden bg-[color-mix(in_oklab,var(--ink)_8%,white)]">
                    <CategoryTileImage
                      src={src}
                      accent={c.accent}
                      slug={c.slug}
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_42%,rgba(74,24,48,0.55)_100%)] opacity-80 transition duration-500 group-hover:opacity-90"
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-[linear-gradient(180deg,rgba(255,255,255,0.28),transparent)]"
                    />
                  </span>
                  <span className="relative z-[1] flex flex-1 flex-col gap-1 px-3.5 py-3 sm:px-4 sm:py-3.5">
                    <span className="hb-display text-[15px] font-bold leading-snug text-[var(--ink)] transition duration-300 group-hover:text-[var(--lagoon)] sm:text-base">
                      {c.name}
                    </span>
                    <span className="line-clamp-2 text-[11px] leading-relaxed text-[var(--muted-foreground)] sm:text-xs">
                      {c.description}
                    </span>
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
