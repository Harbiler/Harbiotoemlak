"use client";

import { useEffect, useId, useState } from "react";
import { MapPin } from "lucide-react";
import { coordsForPlace, type Coordinates } from "@/lib/geo";
import { cn } from "@/lib/utils";

type MapStatus = "idle" | "loading" | "ready" | "fallback" | "empty";

async function geocodeAddress(query: string): Promise<Coordinates | null> {
  const trimmed = query.trim();
  if (trimmed.length < 3) return null;
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=tr&q=${encodeURIComponent(trimmed)}`;
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const data: Array<{ lat: string; lon: string }> = await res.json();
    const hit = data?.[0];
    if (!hit) return null;
    const lat = Number(hit.lat);
    const lng = Number(hit.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { lat, lng };
  } catch {
    return null;
  }
}

function osmEmbedUrl(coords: Coordinates): string {
  const { lat, lng } = coords;
  const dLat = 0.012;
  const dLng = 0.018;
  const bbox = [
    lng - dLng,
    lat - dLat,
    lng + dLng,
    lat + dLat,
  ].join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${encodeURIComponent(`${lat},${lng}`)}`;
}

export function AddressMap({
  address,
  city,
  district,
  className,
  compact = false,
}: {
  address: string;
  city?: string;
  district?: string;
  className?: string;
  /** Smaller preview used inside create/edit forms. */
  compact?: boolean;
}) {
  const titleId = useId();
  const [status, setStatus] = useState<MapStatus>("idle");
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [resolvedLabel, setResolvedLabel] = useState("");

  const addressTrim = address.trim();
  const placeFallback =
    city && district ? coordsForPlace(city, district) : null;

  useEffect(() => {
    if (!addressTrim) {
      setStatus("empty");
      setCoords(null);
      setResolvedLabel("");
      return;
    }

    let cancelled = false;
    setStatus("loading");

    const timer = window.setTimeout(async () => {
      const queryParts = [addressTrim, district, city, "Türkiye"].filter(
        Boolean,
      );
      const geo = await geocodeAddress(queryParts.join(", "));
      if (cancelled) return;

      if (geo) {
        setCoords(geo);
        setResolvedLabel(addressTrim);
        setStatus("ready");
        return;
      }

      if (placeFallback) {
        setCoords(placeFallback);
        setResolvedLabel(
          [addressTrim, district, city].filter(Boolean).join(", "),
        );
        setStatus("fallback");
        return;
      }

      setCoords(null);
      setResolvedLabel(addressTrim);
      setStatus("empty");
    }, 450);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [addressTrim, city, district, placeFallback?.lat, placeFallback?.lng]);

  const showMap = coords && (status === "ready" || status === "fallback");

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-[color-mix(in_oklab,var(--ink)_10%,transparent)] bg-white",
        className,
      )}
      data-hb-address-map
      data-hb-map-status={status}
      aria-labelledby={titleId}
    >
      <div className="flex items-start gap-2 border-b border-[color-mix(in_oklab,var(--ink)_8%,transparent)] px-3 py-2.5 text-sm">
        <MapPin className="mt-0.5 size-4 shrink-0 text-[var(--lagoon)]" />
        <div className="min-w-0">
          <p id={titleId} className="font-medium text-[var(--ink)]">
            {addressTrim || "Adres girilince haritada gösterilir"}
          </p>
          {status === "fallback" && city && district && (
            <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
              Tam konum bulunamadı; {district} / {city} merkezi gösteriliyor.
            </p>
          )}
          {status === "loading" && (
            <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
              Harita güncelleniyor…
            </p>
          )}
          {status === "empty" && addressTrim && (
            <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
              Harita konumu çözülemedi. Adres metni kaydedilir.
            </p>
          )}
        </div>
      </div>
      {showMap ? (
        <iframe
          title={`Harita: ${resolvedLabel || addressTrim}`}
          src={osmEmbedUrl(coords)}
          className={cn(
            "w-full border-0",
            compact ? "h-44" : "h-56 sm:h-64",
          )}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div
          className={cn(
            "flex items-center justify-center bg-[linear-gradient(135deg,#d9ecea,#e7eef1)] px-4 text-center text-sm text-[var(--muted-foreground)]",
            compact ? "h-44" : "h-56 sm:h-64",
          )}
        >
          {addressTrim
            ? status === "loading"
              ? "Harita yükleniyor…"
              : "Harita önizlemesi şu an kullanılamıyor"
            : "Açık adresi yazın — konum burada görünür"}
        </div>
      )}
    </div>
  );
}
