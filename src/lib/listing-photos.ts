import {
  PHOTO_ACCEPTED,
  readFileAsAppFile,
} from "@/lib/application-file";
import type { CategorySlug } from "@/lib/types";

/** Default slots for every category except Emlak. */
export const LISTING_PHOTO_SLOT_COUNT = 5;
/** Emlak (all emlak sections / tip fields) gets more gallery slots. */
export const EMLAK_PHOTO_SLOT_COUNT = 10;

export function photoSlotCountForCategory(
  category: string | CategorySlug | "" | undefined,
): number {
  return category === "emlak" ? EMLAK_PHOTO_SLOT_COUNT : LISTING_PHOTO_SLOT_COUNT;
}

export function isRenderablePhoto(src: string | undefined | null): src is string {
  if (!src) return false;
  return (
    src.startsWith("data:image/") ||
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("blob:") ||
    src.startsWith("/")
  );
}

export function emptyPhotoSlots(
  category?: string | CategorySlug | "" | number,
): (File | null)[] {
  const count =
    typeof category === "number"
      ? category
      : photoSlotCountForCategory(category);
  return Array.from({ length: count }, () => null);
}

export function padPhotoSlots<T>(
  values: (T | null | undefined)[] | undefined,
  count: number,
  fill: T | null = null,
): (T | null)[] {
  const next = Array.from({ length: count }, () => fill);
  (values ?? []).slice(0, count).forEach((v, i) => {
    next[i] = (v ?? fill) as T | null;
  });
  return next;
}

export function resizePhotoFiles(
  files: (File | null)[],
  count: number,
): (File | null)[] {
  return padPhotoSlots(files, count, null);
}

export function resizePhotoSrcs(
  srcs: (string | undefined)[],
  count: number,
): (string | undefined)[] {
  return Array.from({ length: count }, (_, i) => srcs[i]);
}

/**
 * Build the persisted `photos` array from slot files + any kept existing URLs.
 * Empty → one category placeholder so cards/detail still render.
 */
export async function resolveListingPhotos(opts: {
  category: string;
  files: (File | null)[];
  existing?: (string | undefined | null)[];
}): Promise<string[]> {
  const count = photoSlotCountForCategory(opts.category);
  const photos: string[] = [];
  for (let i = 0; i < count; i++) {
    const file = opts.files[i] ?? null;
    if (file) {
      const app = await readFileAsAppFile(file, { imagesOnly: true });
      photos.push(app.dataUrl);
      continue;
    }
    const existing = opts.existing?.[i];
    if (isRenderablePhoto(existing)) {
      photos.push(existing);
    }
  }
  if (photos.length === 0) {
    return [`${opts.category}-new`];
  }
  return photos;
}

export { PHOTO_ACCEPTED };
