"use client";

import { useEffect, useState } from "react";
import { isMediaRef, resolveMediaUrl } from "@/lib/media-store";
import { cn } from "@/lib/utils";

/** Download/open link that resolves IndexedDB media refs on the device. */
export function MediaDownloadLink({
  src,
  fileName,
  children,
  className,
}: {
  src: string;
  fileName?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [href, setHref] = useState<string | undefined>(() =>
    isMediaRef(src) ? undefined : src,
  );

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | undefined;
    if (!isMediaRef(src)) {
      setHref(src);
      return;
    }
    void (async () => {
      const url = await resolveMediaUrl(src);
      if (cancelled) {
        if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
        return;
      }
      objectUrl = url?.startsWith("blob:") ? url : undefined;
      setHref(url);
    })();
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  if (!href) {
    return (
      <span className={cn("text-stone-400", className)}>{children}</span>
    );
  }

  return (
    <a
      href={href}
      download={fileName}
      target="_blank"
      rel="noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
