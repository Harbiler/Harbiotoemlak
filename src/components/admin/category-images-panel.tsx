"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { NAV_CATEGORIES } from "@/lib/categories";
import {
  CATEGORY_IMAGES_CHANGED_EVENT,
  categoryImagePath,
  clearCategoryImageOverride,
  defaultCategoryImagePath,
  loadCategoryImageOverrides,
  setCategoryImageOverride,
  type CategoryImageOverrides,
} from "@/lib/category-images";
import { PHOTO_ACCEPTED, readFileAsAppFile } from "@/lib/application-file";
import { Button } from "@/components/ui/button";
import { ImagePlus, RotateCcw } from "lucide-react";

export function CategoryImagesPanel() {
  const [overrides, setOverrides] = useState<CategoryImageOverrides>({});
  const [busySlug, setBusySlug] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

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

  async function onFileSelected(slug: string, file: File | null) {
    if (!file) return;
    setBusySlug(slug);
    setError(null);
    setMessage(null);
    try {
      const app = await readFileAsAppFile(file, { imagesOnly: true });
      setCategoryImageOverride(slug, app.dataUrl);
      setOverrides(loadCategoryImageOverrides());
      setMessage(`${NAV_CATEGORIES.find((c) => c.slug === slug)?.name ?? slug} resmi güncellendi.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Yükleme başarısız.");
    } finally {
      setBusySlug(null);
      const input = inputRefs.current[slug];
      if (input) input.value = "";
    }
  }

  function onReset(slug: string) {
    clearCategoryImageOverride(slug);
    setOverrides(loadCategoryImageOverrides());
    setError(null);
    setMessage(
      `${NAV_CATEGORIES.find((c) => c.slug === slug)?.name ?? slug} varsayılan resme döndü.`,
    );
  }

  return (
    <div className="space-y-4" data-hb-admin-category-images="1">
      <div>
        <h2 className="text-lg font-semibold text-[var(--ink)]">
          Ana sayfa kategori resimleri
        </h2>
        <p className="mt-1 text-sm text-stone-600">
          Ana sayfadaki kategori bölümünün küçük resimlerini yükleyin veya
          değiştirin. JPEG, PNG veya WEBP · en fazla 2.5 MB. Değişiklikler
          kaydedilir ve ana sayfada hemen görünür.
        </p>
      </div>

      {message && (
        <p
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
        >
          {message}
        </p>
      )}
      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
        >
          {error}
        </p>
      )}

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {NAV_CATEGORIES.map((c) => {
          const src =
            categoryImagePath(c.slug, overrides) ??
            defaultCategoryImagePath(c.slug);
          const custom = Boolean(overrides[c.slug]);
          const busy = busySlug === c.slug;
          return (
            <li
              key={c.slug}
              className="hb-surface flex flex-col gap-3 p-4"
              data-hb-admin-category={c.slug}
              data-hb-admin-image={custom ? "custom" : "default"}
            >
              <div className="flex items-start gap-3">
                <span className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-stone-100 ring-1 ring-stone-200">
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
                      className="flex size-full items-center justify-center text-xs text-white"
                      style={{ backgroundColor: c.accent }}
                    >
                      {c.shortName}
                    </span>
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[var(--ink)]">{c.name}</p>
                  <p className="text-xs text-stone-500">
                    {custom ? "Özel resim" : "Varsayılan resim"}
                  </p>
                </div>
              </div>

              <input
                ref={(el) => {
                  inputRefs.current[c.slug] = el;
                }}
                id={`admin-cat-img-${c.slug}`}
                type="file"
                accept={PHOTO_ACCEPTED}
                className="sr-only"
                disabled={busy}
                onChange={(e) =>
                  onFileSelected(c.slug, e.target.files?.[0] ?? null)
                }
              />

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  className="bg-[var(--lagoon)] hover:bg-[#be185d]"
                  disabled={busy}
                  onClick={() => inputRefs.current[c.slug]?.click()}
                >
                  <ImagePlus className="size-4" />
                  {custom ? "Değiştir" : "Yükle"}
                </Button>
                {custom && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={busy}
                    onClick={() => onReset(c.slug)}
                  >
                    <RotateCcw className="size-4" />
                    Varsayılan
                  </Button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
