"use client";

import { useMediaSrc } from "@/hooks/use-media-src";
import { cn } from "@/lib/utils";

/** <img> that loads IndexedDB-backed listing/member media on this device. */
export function ResolvedMediaImg({
  src,
  alt = "",
  className,
}: {
  src: string | undefined | null;
  alt?: string;
  className?: string;
}) {
  const resolved = useMediaSrc(src);
  if (!resolved) {
    return <span className={cn("inline-block bg-stone-100", className)} />;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={resolved} alt={alt} className={className} />;
}
