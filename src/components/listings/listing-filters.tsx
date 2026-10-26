"use client";

import { getCategory } from "@/lib/categories";
import {
  supportsBrandModelSearch,
  supportsDetailedSearch,
} from "@/lib/brand-models";
import { HEPSI, isHepsi } from "@/lib/filter-all";
import type { CategorySlug, Listing } from "@/lib/types";
import { BrandModelFilterFields } from "@/components/listings/brand-model-filter-fields";
import { CityDistrictFields } from "@/components/listings/city-district-fields";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Button } from "@/components/ui/button";
import { EmlakFilters } from "@/components/listings/emlak-filters";

export interface FilterState {
  q: string;
  city: string;
  district: string;
  sellerType: string;
  minPrice: string;
  maxPrice: string;
  sort: string;
  /** Category-specific detail filters (marka, model, emlakTipi, …) */
  details: Record<string, string>;
}

export const DEFAULT_FILTERS: FilterState = {
  q: "",
  city: HEPSI,
  district: HEPSI,
  sellerType: HEPSI,
  minPrice: "",
  maxPrice: "",
  sort: "newest",
  details: {},
};

function setDetail(value: FilterState, key: string, next: string): FilterState {
  const details = { ...value.details };
  if (isHepsi(next)) delete details[key];
  else details[key] = next;
  return { ...value, details };
}

type Opt = { value: string; label: string };

function FieldSelect({
  label,
  value,
  onChange,
  options,
  allLabel = "Fark etmez",
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Opt[] | string[];
  allLabel?: string;
  disabled?: boolean;
}) {
  const normalized: Opt[] = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o,
  );
  const current = isHepsi(value) ? HEPSI : value;

  return (
    <div>
      <Label className="text-sm">{label}</Label>
      <NativeSelect
        className="mt-1.5"
        disabled={disabled}
        value={current}
        onChange={onChange}
        options={[{ value: HEPSI, label: allLabel }, ...normalized]}
      />
    </div>
  );
}

export function ListingFilters({
  value,
  onChange,
  onReset,
  categorySlug,
}: {
  value: FilterState;
  onChange: (next: FilterState) => void;
  onReset: () => void;
  categorySlug?: string;
}) {
  const sellerType = isHepsi(value.sellerType) ? HEPSI : value.sellerType;
  const category = categorySlug ? getCategory(categorySlug) : undefined;
  const showDetailed = categorySlug ? supportsDetailedSearch(categorySlug) : false;
  const showBrandModel = categorySlug ? supportsBrandModelSearch(categorySlug) : false;
  const isEmlak = categorySlug === "emlak";

  const extraSelectFields =
    category && showDetailed && categorySlug === "yedek-parca"
      ? category.fields.filter(
          (f) => f.type === "select" && f.key !== "marka" && f.key !== "model",
        )
      : category && showBrandModel
        ? category.fields.filter(
            (f) => f.type === "select" && f.key !== "marka" && f.key !== "model",
          )
        : [];

  if (isEmlak) {
    return <EmlakFilters value={value} onChange={onChange} onReset={onReset} />;
  }

  return (
    <div className="hb-surface space-y-4 p-4">
      {showDetailed && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--lagoon)]">
            Detaylı arama
          </p>
          <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
            {showBrandModel
              ? "Tüm marka ve modellere göre daraltın."
              : "Özelliklere göre daraltın."}
          </p>
        </div>
      )}

      <div>
        <Label htmlFor="q">Ara</Label>
        <Input
          id="q"
          placeholder="Başlık veya açıklama…"
          value={value.q}
          onChange={(e) => onChange({ ...value, q: e.target.value })}
          className="mt-1.5"
        />
      </div>

      {showBrandModel && categorySlug && (
        <BrandModelFilterFields
          category={categorySlug}
          marka={value.details.marka ?? HEPSI}
          model={value.details.model ?? HEPSI}
          markaLabel={
            categorySlug === "yedek-parca" ? "Uyumlu Marka" : "Marka"
          }
          modelLabel={
            categorySlug === "yedek-parca" ? "Uyumlu Model" : "Model"
          }
          onMarkaChange={(marka) => {
            const next = setDetail(value, "marka", marka);
            onChange(setDetail(next, "model", HEPSI));
          }}
          onModelChange={(model, selectedMarka) => {
            const withMarka = setDetail(
              value,
              "marka",
              selectedMarka || value.details.marka || HEPSI,
            );
            onChange(setDetail(withMarka, "model", model));
          }}
        />
      )}

      {extraSelectFields.map((field) => (
        <FieldSelect
          key={field.key}
          label={field.label}
          value={value.details[field.key] ?? HEPSI}
          options={field.options ?? []}
          onChange={(v) => onChange(setDetail(value, field.key, v))}
        />
      ))}

      {(categorySlug === "vasita" || categorySlug === "motorsiklet") && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="minYil">En az yıl</Label>
            <Input
              id="minYil"
              type="number"
              inputMode="numeric"
              value={value.details.minYil ?? ""}
              onChange={(e) => onChange(setDetail(value, "minYil", e.target.value))}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="maxYil">En fazla yıl</Label>
            <Input
              id="maxYil"
              type="number"
              inputMode="numeric"
              value={value.details.maxYil ?? ""}
              onChange={(e) => onChange(setDetail(value, "maxYil", e.target.value))}
              className="mt-1.5"
            />
          </div>
        </div>
      )}

      <CityDistrictFields
        city={value.city}
        district={value.district}
        onCityChange={(next) =>
          onChange({ ...value, city: next || HEPSI, district: HEPSI })
        }
        onDistrictChange={(next, selectedCity) =>
          onChange({
            ...value,
            city: selectedCity || value.city || HEPSI,
            district: next || HEPSI,
          })
        }
      />
      <div>
        <Label>Satıcı tipi</Label>
        <NativeSelect
          className="mt-1.5"
          value={sellerType}
          onChange={(next) => onChange({ ...value, sellerType: next || HEPSI })}
          options={[
            { value: HEPSI, label: "Fark etmez" },
            { value: "bireysel", label: "Bireysel (şahıs)" },
            { value: "kurumsal", label: "Kurumsal (galeri / ofis)" },
          ]}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="min">En az ₺</Label>
          <Input
            id="min"
            type="number"
            inputMode="numeric"
            value={value.minPrice}
            onChange={(e) => onChange({ ...value, minPrice: e.target.value })}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="max">En fazla ₺</Label>
          <Input
            id="max"
            type="number"
            inputMode="numeric"
            value={value.maxPrice}
            onChange={(e) => onChange({ ...value, maxPrice: e.target.value })}
            className="mt-1.5"
          />
        </div>
      </div>
      <div>
        <Label>Sıralama</Label>
        <NativeSelect
          className="mt-1.5"
          value={value.sort || "newest"}
          onChange={(sort) => onChange({ ...value, sort: sort || "newest" })}
          options={[
            { value: "newest", label: "En yeni ilanlar" },
            { value: "price-asc", label: "Fiyat: düşükten yükseğe" },
            { value: "price-desc", label: "Fiyat: yüksekten düşüğe" },
          ]}
        />
      </div>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => onReset()}
      >
        Filtreleri temizle
      </Button>
    </div>
  );
}

export function applyFilters<
  T extends {
    title: string;
    description: string;
    city: string;
    district: string;
    sellerType: string;
    price: number;
    createdAt: string;
    fields?: Listing["fields"];
    category?: CategorySlug | string;
  },
>(items: T[], f: FilterState): T[] {
  let result = items.filter((l) => {
    if (f.q) {
      const q = f.q.toLowerCase();
      const hay = `${l.title} ${l.description} ${Object.values(l.fields ?? {}).join(" ")}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (!isHepsi(f.city) && l.city !== f.city) return false;
    if (!isHepsi(f.district) && l.district !== f.district) return false;
    if (!isHepsi(f.sellerType) && l.sellerType !== f.sellerType) return false;
    if (f.minPrice && l.price < Number(f.minPrice)) return false;
    if (f.maxPrice && l.price > Number(f.maxPrice) && l.price > 0) return false;

    const fields = l.fields ?? {};
    for (const [key, raw] of Object.entries(f.details)) {
      if (isHepsi(raw)) continue;
      if (key === "minMetrekare") {
        if (Number(fields.metrekare ?? 0) < Number(raw)) return false;
        continue;
      }
      if (key === "maxMetrekare") {
        if (Number(fields.metrekare ?? 0) > Number(raw)) return false;
        continue;
      }
      if (key === "minNetMetrekare") {
        if (Number(fields.netMetrekare ?? 0) < Number(raw)) return false;
        continue;
      }
      if (key === "maxNetMetrekare") {
        if (Number(fields.netMetrekare ?? 0) > Number(raw)) return false;
        continue;
      }
      if (key === "minYil") {
        if (Number(fields.yil ?? 0) < Number(raw)) return false;
        continue;
      }
      if (key === "maxYil") {
        if (Number(fields.yil ?? 0) > Number(raw)) return false;
        continue;
      }
      // Legacy: listings may still store "7 / 10" in kat
      if (key === "bulunduguKat" && fields.bulunduguKat === undefined && fields.kat) {
        const floor = String(fields.kat).split("/")[0]?.trim();
        if (floor !== raw) return false;
        continue;
      }
      const actual = fields[key];
      if (actual === undefined || String(actual) !== raw) return false;
    }
    return true;
  });

  result = [...result].sort((a, b) => {
    if (f.sort === "price-asc") return a.price - b.price;
    if (f.sort === "price-desc") return b.price - a.price;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return result;
}
