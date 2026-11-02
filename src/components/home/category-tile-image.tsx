"use client";

import Image from "next/image";
import { useMediaSrc } from "@/hooks/use-media-src";
import { CategoryIcon } from "@/components/category-icon";
import type { CategorySlug } from "@/lib/types";

/** Homepage tile image; resolves device IndexedDB overrides. */
export function CategoryTileImage({
  src,
  accent,
  slug,
}: {
  src: string | undefined;
  accent: string;
  slug: CategorySlug;
}) {
  const resolved = useMediaSrc(src);
  if (resolved) {
    // next/image is fine for /public paths; blob:/data: use a plain img.
    if (resolved.startsWith("/") && !resolved.startsWith("//")) {
      return (
        <Image
          src={resolved}
          alt=""
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
          className="object-cover transition duration-500 ease-out group-hover:scale-[1.06]"
          unoptimized
        />
      );
    }
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={resolved}
        alt=""
        className="absolute inset-0 size-full object-cover transition duration-500 ease-out group-hover:scale-[1.06]"
      />
    );
  }
  return (
    <span
      className="flex size-full items-center justify-center text-white"
      style={{ backgroundColor: accent }}
    >
      <CategoryIcon slug={slug} className="size-8" />
    </span>
  );
}
