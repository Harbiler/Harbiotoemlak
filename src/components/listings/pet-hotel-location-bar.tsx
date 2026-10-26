"use client";

import { useMemo, useState } from "react";
import { CITIES, CITY_NAMES } from "@/lib/cities";
import { PET_HOTEL_RADIUS_KM } from "@/lib/geo";
import type { CustomerLocationState } from "@/hooks/use-customer-location";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Navigation } from "lucide-react";

export function PetHotelLocationBar({
  location,
  matchCount,
}: {
  location: CustomerLocationState;
  matchCount?: number;
}) {
  const [city, setCity] = useState("İstanbul");
  const districts = useMemo(() => CITIES[city] ?? [], [city]);
  const [district, setDistrict] = useState(districts[0] ?? "");

  return (
    <div className="hb-surface space-y-4 p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--lagoon)]/12 text-[var(--lagoon)]">
          <MapPin className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-[var(--ink)]">
            Yalnızca {PET_HOTEL_RADIUS_KM} km çevrenizdeki oteller
          </p>
          <p className="mt-0.5 text-sm text-[var(--muted-foreground)]">
            Evcil hayvan otelleri, müşteri konumuna göre filtrelenir.
          </p>
          {location.status === "ready" && location.label && (
            <p className="mt-2 text-sm text-[var(--lagoon)]">
              Konum: {location.label}
              {typeof matchCount === "number" ? ` · ${matchCount} otel` : ""}
            </p>
          )}
          {location.error && (
            <p className="mt-2 text-sm text-amber-800">{location.error}</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          className="bg-[var(--lagoon)] hover:bg-[#0a5a5a]"
          onClick={location.requestGps}
          disabled={location.status === "locating"}
        >
          <Navigation className="size-4" />
          {location.status === "locating" ? "Konum alınıyor…" : "Konumumu kullan"}
        </Button>
        {location.status === "ready" && (
          <Button type="button" size="sm" variant="outline" onClick={location.clear}>
            Konumu temizle
          </Button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div className="space-y-1.5">
          <Label>İl</Label>
          <Select
            value={city}
            onValueChange={(v) => {
              const next = v ?? "İstanbul";
              setCity(next);
              setDistrict(CITIES[next]?.[0] ?? "");
            }}
          >
            <SelectTrigger className="w-full bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CITY_NAMES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>İlçe</Label>
          <Select value={district} onValueChange={(v) => setDistrict(v ?? "")}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="İlçe" />
            </SelectTrigger>
            <SelectContent>
              {districts.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          type="button"
          variant="outline"
          className="sm:mb-0"
          disabled={!city || !district}
          onClick={() => location.setManualPlace(city, district)}
        >
          Bu ilçeyi kullan
        </Button>
      </div>
    </div>
  );
}
