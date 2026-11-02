"use client";

import { useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MAX_UPLOAD_SIZE_LABEL,
  PHOTO_ACCEPTED,
} from "@/lib/application-file";
import { useMediaSrc } from "@/hooks/use-media-src";
import {
  LISTING_PHOTO_SLOT_COUNT,
  photoSlotCountForCategory,
} from "@/lib/listing-photos";
import type { CategorySlug } from "@/lib/types";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

export { LISTING_PHOTO_SLOT_COUNT, photoSlotCountForCategory };

export function listingPhotosHint(slotCount: number): string {
  return `En fazla ${slotCount} resim. JPEG, PNG veya WEBP · her biri en fazla ${MAX_UPLOAD_SIZE_LABEL}`;
}

function SlotPreview({
  file,
  existingSrc,
}: {
  file: File | null;
  existingSrc?: string;
}) {
  const objectUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file],
  );
  const resolvedExisting = useMediaSrc(file ? undefined : existingSrc);

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  const src = objectUrl ?? resolvedExisting;
  if (!src) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className="absolute inset-0 size-full object-cover"
    />
  );
}

function PhotoSlot({
  id,
  index,
  file,
  existingSrc,
  onChange,
}: {
  id: string;
  index: number;
  file: File | null;
  existingSrc?: string;
  onChange: (file: File | null) => void;
}) {
  const hasImage = Boolean(file || existingSrc);
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs text-[var(--muted-foreground)]">
        Resim {index + 1}
        {index === 0 ? " (kapak)" : ""}
      </Label>
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-dashed border-[color-mix(in_oklab,var(--lagoon)_28%,transparent)] bg-white/70">
        {hasImage ? (
          <SlotPreview file={file} existingSrc={existingSrc} />
        ) : (
          <label
            htmlFor={id}
            className="flex size-full cursor-pointer flex-col items-center justify-center gap-1.5 px-2 text-center transition hover:bg-[var(--mist)]"
          >
            <ImagePlus className="size-5 text-[var(--lagoon)]" />
            <span className="text-xs font-medium text-[var(--ink)]">Yükle</span>
          </label>
        )}
        {hasImage && (
          <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-black/45 p-1.5">
            <label
              htmlFor={id}
              className="cursor-pointer rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-[var(--ink)]"
            >
              Değiştir
            </label>
            <button
              type="button"
              aria-label={`Resim ${index + 1} kaldır`}
              className="rounded-md bg-white/90 p-0.5 text-[var(--ink)]"
              onClick={() => onChange(null)}
            >
              <X className="size-3.5" />
            </button>
          </div>
        )}
        <Input
          id={id}
          type="file"
          accept={PHOTO_ACCEPTED}
          className="sr-only"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
      </div>
    </div>
  );
}

export function PhotoUploadFields({
  idPrefix = "listing-photo",
  category,
  slotCount,
  files,
  existingSrcs,
  onChange,
}: {
  idPrefix?: string;
  /** When set, slot count is derived (Emlak → 10, others → 5). */
  category?: CategorySlug | string | "";
  /** Explicit override; wins over category. */
  slotCount?: number;
  files: (File | null)[];
  /** Kept existing photo URLs (data/http); cleared slots should be undefined. */
  existingSrcs?: (string | undefined)[];
  onChange: (index: number, file: File | null) => void;
}) {
  const count =
    slotCount ??
    photoSlotCountForCategory(category) ??
    LISTING_PHOTO_SLOT_COUNT;
  const slots = Array.from({ length: count }, (_, i) => i);

  return (
    <div
      className="space-y-3"
      data-hb-photos="listing"
      data-hb-photo-slots={count}
    >
      <div>
        <p className="text-sm font-semibold text-[var(--ink)]">İlan resimleri</p>
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
          {listingPhotosHint(count)}
        </p>
      </div>
      <div
        className={cn(
          "grid gap-3",
          count > 5
            ? "grid-cols-2 sm:grid-cols-5"
            : "grid-cols-2 sm:grid-cols-5",
        )}
      >
        {slots.map((i) => (
          <PhotoSlot
            key={`${idPrefix}-${i}`}
            id={`${idPrefix}-${i}`}
            index={i}
            file={files[i] ?? null}
            existingSrc={existingSrcs?.[i]}
            onChange={(next) => onChange(i, next)}
          />
        ))}
      </div>
    </div>
  );
}
