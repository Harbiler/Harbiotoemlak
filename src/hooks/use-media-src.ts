"use client";

import { useEffect, useState } from "react";
import {
  isMediaRef,
  resolveMediaUrl,
} from "@/lib/media-store";

/**
 * Resolve a listing/member media ref (IndexedDB) or passthrough URL for <img>.
 * Object URLs created for `idb:hb/…` refs are revoked on change/unmount.
 */
export function useMediaSrc(
  src: string | undefined | null,
): string | undefined {
  const [resolved, setResolved] = useState<string | undefined>(() =>
    src && !isMediaRef(src) ? src : undefined,
  );

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | undefined;

    if (!src) {
      setResolved(undefined);
      return;
    }
    if (!isMediaRef(src)) {
      setResolved(src);
      return;
    }

    setResolved(undefined);
    void (async () => {
      try {
        const url = await resolveMediaUrl(src);
        if (cancelled) {
          if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
          return;
        }
        objectUrl = url?.startsWith("blob:") ? url : undefined;
        setResolved(url);
      } catch {
        if (!cancelled) setResolved(undefined);
      }
    })();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  return resolved;
}
