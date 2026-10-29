"use client";

import { useCallback, useEffect, useState } from "react";
import { coordsForPlace, type Coordinates } from "@/lib/geo";

const STORAGE_KEY = "harbidenbak.customerLocation";

export type LocationSource = "gps" | "manual" | null;

type StoredLocation = {
  coords: Coordinates;
  source: Exclude<LocationSource, null>;
  label?: string;
};

export type CustomerLocationState = {
  coords: Coordinates | null;
  source: LocationSource;
  label: string | null;
  status: "idle" | "locating" | "ready" | "denied" | "error";
  error: string | null;
  requestGps: () => void;
  setManualPlace: (city: string, district: string) => void;
  clear: () => void;
};

function readStored(): StoredLocation | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredLocation;
  } catch {
    return null;
  }
}

function writeStored(value: StoredLocation | null) {
  if (typeof window === "undefined") return;
  if (!value) localStorage.removeItem(STORAGE_KEY);
  else localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

export function useCustomerLocation(): CustomerLocationState {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [source, setSource] = useState<LocationSource>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [status, setStatus] = useState<CustomerLocationState["status"]>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = readStored();
    if (!stored) return;
    setCoords(stored.coords);
    setSource(stored.source);
    setLabel(stored.label ?? null);
    setStatus("ready");
  }, []);

  const apply = useCallback(
    (next: Coordinates, nextSource: Exclude<LocationSource, null>, nextLabel?: string) => {
      setCoords(next);
      setSource(nextSource);
      setLabel(nextLabel ?? null);
      setStatus("ready");
      setError(null);
      writeStored({ coords: next, source: nextSource, label: nextLabel });
    },
    [],
  );

  const requestGps = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("error");
      setError("Tarayıcınız konum servisini desteklemiyor. İlçe seçerek devam edin.");
      return;
    }
    setStatus("locating");
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        apply(
          { lat: pos.coords.latitude, lng: pos.coords.longitude },
          "gps",
          "Konumunuz",
        );
      },
      (err) => {
        setStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error");
        setError(
          err.code === err.PERMISSION_DENIED
            ? "Konum izni verilmedi. Yakındaki otelleri görmek için ilçe seçebilirsiniz."
            : "Konum alınamadı. İlçe seçerek devam edin.",
        );
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 60_000 },
    );
  }, [apply]);

  const setManualPlace = useCallback(
    (city: string, district: string) => {
      const c = coordsForPlace(city, district);
      if (!c) {
        setStatus("error");
        setError("Seçilen konum için koordinat bulunamadı.");
        return;
      }
      apply(c, "manual", `${district}, ${city}`);
    },
    [apply],
  );

  const clear = useCallback(() => {
    setCoords(null);
    setSource(null);
    setLabel(null);
    setStatus("idle");
    setError(null);
    writeStored(null);
  }, []);

  return {
    coords,
    source,
    label,
    status,
    error,
    requestGps,
    setManualPlace,
    clear,
  };
}
