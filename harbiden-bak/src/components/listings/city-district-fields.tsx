"use client";

import { useEffect, useId, useRef } from "react";
import { CITIES, CITY_NAMES } from "@/lib/cities";
import { HEPSI, isHepsi } from "@/lib/filter-all";
import { Label } from "@/components/ui/label";
import { cn } from "cn";

const selectClassName = cn(
  "mt-1.5 h-8 w-full min-w-0 appearance-none rounded-lg border border-input bg-white bg-[length:1rem] bg-[right_0.5rem_center] bg-no-repeat px-2.5 py-1 pr-8 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
  "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%27%236b7280%27 stroke-width=%272%27%3E%3Cpath stroke-linecap=%27round%27 stroke-linejoin=%27round%27 d=%27m6 9 6 6 6-6%27/%3E%3C/svg%3E')]",
);

export function CityDistrictFields({
  city,
  district,
  onCityChange,
  onDistrictChange,
  cityLabel = "İl",
  districtLabel = "İlçe",
}: {
  city: string;
  district: string;
  onCityChange: (city: string) => void;
  /** Second arg is the city currently selected in the İl control (avoids stale React state). */
  onDistrictChange: (district: string, city: string) => void;
  cityLabel?: string;
  districtLabel?: string;
}) {
  const reactId = useId().replace(/:/g, "");
  const cityId = `hb-city-${reactId}`;
  const districtId = `hb-district-${reactId}`;
  const cityRef = useRef<HTMLSelectElement>(null);
  const districtRef = useRef<HTMLSelectElement>(null);
  const cityCb = useRef(onCityChange);
  const districtCb = useRef(onDistrictChange);
  cityCb.current = onCityChange;
  districtCb.current = onDistrictChange;

  const normalizedCity = isHepsi(city) ? HEPSI : city.normalize("NFC");
  const normalizedDistrict = isHepsi(district) ? HEPSI : district;
  const initialDistricts =
    normalizedCity !== HEPSI ? CITIES[normalizedCity] ?? [] : [];

  // Sync React filter state when the user changes the native selects
  // (works alongside the progressive-enhancement script that fills options).
  useEffect(() => {
    const citySelect = cityRef.current;
    const districtSelect = districtRef.current;
    if (!citySelect || !districtSelect) return;

    const onCity = () => {
      cityCb.current(citySelect.value || HEPSI);
    };
    const onDistrict = () => {
      districtCb.current(
        districtSelect.value || HEPSI,
        citySelect.value || HEPSI,
      );
    };

    citySelect.addEventListener("change", onCity);
    districtSelect.addEventListener("change", onDistrict);
    return () => {
      citySelect.removeEventListener("change", onCity);
      districtSelect.removeEventListener("change", onDistrict);
    };
  }, []);

  // Keep selects aligned when filters are reset from React state.
  useEffect(() => {
    const citySelect = cityRef.current;
    const districtSelect = districtRef.current;
    if (!citySelect || !districtSelect) return;
    if (citySelect.value !== normalizedCity) {
      citySelect.value = normalizedCity;
      citySelect.dispatchEvent(new Event("change", { bubbles: true }));
      return;
    }
    if (
      !districtSelect.disabled &&
      districtSelect.value !== normalizedDistrict &&
      [...districtSelect.options].some((o) => o.value === normalizedDistrict)
    ) {
      districtSelect.value = normalizedDistrict;
    }
  }, [normalizedCity, normalizedDistrict]);

  return (
    <>
      <div>
        <Label htmlFor={cityId} className="text-sm">
          {cityLabel}
        </Label>
        <select
          id={cityId}
          ref={cityRef}
          data-slot="native-select"
          data-hb-role="city"
          data-hb-district-id={districtId}
          className={selectClassName}
          defaultValue={normalizedCity}
        >
          <option value={HEPSI}>Tüm iller</option>
          {CITY_NAMES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor={districtId} className="text-sm">
          {districtLabel}
        </Label>
        <select
          id={districtId}
          ref={districtRef}
          data-slot="native-select"
          data-hb-role="district"
          className={selectClassName}
          defaultValue={
            initialDistricts.includes(normalizedDistrict)
              ? normalizedDistrict
              : HEPSI
          }
          disabled={normalizedCity === HEPSI}
        >
          <option value={HEPSI}>
            {normalizedCity === HEPSI ? "Önce il seçin" : "Tüm ilçeler"}
          </option>
          {initialDistricts.map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
