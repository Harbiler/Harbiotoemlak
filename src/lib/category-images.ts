import { isMediaRef } from "./media-store";
import type { CategorySlug } from "./types";

function isCategoryImageSrc(src: string): boolean {
  return src.startsWith("data:image/") || isMediaRef(src);
}

/** Realistic photo thumbnails for homepage category tiles (`/public/categories/*.jpg`). */
export const CATEGORY_IMAGE_PATHS: Record<string, string> = {
  emlak: "/categories/emlak.jpg",
  vasita: "/categories/vasita.jpg",
  "evcil-hayvan-otelleri": "/categories/evcil-hayvan-otelleri.jpg",
  "bakici-arayanlar": "/categories/bakici-arayanlar.jpg",
  toptancilar: "/categories/toptancilar.jpg",
  "yedek-parca": "/categories/yedek-parca.jpg",
  "is-makineleri": "/categories/is-makineleri.jpg",
  ustalar: "/categories/ustalar.jpg",
  "yardimci-arayanlar": "/categories/yardimci-arayanlar.jpg",
  "is-ilanlari": "/categories/is-ilanlari.jpg",
};

/** localStorage map of slug → data URL (admin overrides). */
export const CATEGORY_IMAGES_KEY = "harbidenbak.categoryImages";
/** Same-tab event after admin upload/replace/reset. */
export const CATEGORY_IMAGES_CHANGED_EVENT = "harbidenbak:categoryImages";

export type CategoryImageOverrides = Record<string, string>;

function canUseStorage(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function loadCategoryImageOverrides(): CategoryImageOverrides {
  if (!canUseStorage()) return {};
  try {
    const raw = localStorage.getItem(CATEGORY_IMAGES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as CategoryImageOverrides;
    if (!parsed || typeof parsed !== "object") return {};
    const out: CategoryImageOverrides = {};
    for (const [slug, src] of Object.entries(parsed)) {
      if (typeof src === "string" && isCategoryImageSrc(src)) {
        out[slug] = src;
      }
    }
    return out;
  } catch {
    return {};
  }
}

function persistOverrides(next: CategoryImageOverrides): void {
  if (!canUseStorage()) return;
  if (Object.keys(next).length === 0) {
    localStorage.removeItem(CATEGORY_IMAGES_KEY);
  } else {
    localStorage.setItem(CATEGORY_IMAGES_KEY, JSON.stringify(next));
  }
  window.dispatchEvent(new Event(CATEGORY_IMAGES_CHANGED_EVENT));
}

/** Default static path (no admin override). */
export function defaultCategoryImagePath(
  slug: CategorySlug | string,
): string | undefined {
  return CATEGORY_IMAGE_PATHS[slug];
}

/** Resolved src for a slug: admin override → static default. */
export function categoryImagePath(
  slug: CategorySlug | string,
  overrides?: CategoryImageOverrides,
): string | undefined {
  const map = overrides ?? (canUseStorage() ? loadCategoryImageOverrides() : {});
  return map[slug] ?? CATEGORY_IMAGE_PATHS[slug];
}

export function setCategoryImageOverride(
  slug: string,
  dataUrl: string,
): void {
  if (!isCategoryImageSrc(dataUrl)) {
    throw new Error("Geçersiz görsel verisi.");
  }
  const next = { ...loadCategoryImageOverrides(), [slug]: dataUrl };
  persistOverrides(next);
}

export function clearCategoryImageOverride(slug: string): void {
  const next = { ...loadCategoryImageOverrides() };
  if (!(slug in next)) return;
  delete next[slug];
  persistOverrides(next);
}

export function clearAllCategoryImageOverrides(): void {
  if (!canUseStorage()) return;
  localStorage.removeItem(CATEGORY_IMAGES_KEY);
  window.dispatchEvent(new Event(CATEGORY_IMAGES_CHANGED_EVENT));
}

export function hasCategoryImageOverride(slug: string): boolean {
  return Boolean(loadCategoryImageOverrides()[slug]);
}
