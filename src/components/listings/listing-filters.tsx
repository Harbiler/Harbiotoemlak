"use client";

import { CITY_NAMES, CITIES } from "@/lib/cities";
import { getCategory } from "@/lib/categories";
import {
  brandNames,
  modelsForBrand,
  supportsBrandModelSearch,
  supportsDetailedSearch,
} from "@/lib/brand-models";
import type { CategorySlug, Listing } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

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
  city: "all",
  district: "all",
  sellerType: "all",
  minPrice: "",
  maxPrice: "",
  sort: "newest",
  details: {},
};

function setDetail(value: FilterState, key: string, next: string): FilterState {
  const details = { ...value.details };
  if (!next || next === "all") delete details[key];
  else details[key] = next;
  return { ...value, details };
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
  const districts = value.city !== "all" ? CITIES[value.city] ?? [] : [];
  const category = categorySlug ? getCategory(categorySlug) : undefined;
  const showDetailed = categorySlug ? supportsDetailedSearch(categorySlug) : false;
  const showBrandModel = categorySlug ? supportsBrandModelSearch(categorySlug) : false;
  const brands = categorySlug ? brandNames(categorySlug) : [];
  const models = categorySlug
    ? modelsForBrand(categorySlug, value.details.marka ?? "")
    : [];

  const isEmlak = categorySlug === "emlak";
  const emlakFields = isEmlak
    ? (category?.fields.filter((f) => f.type === "select") ?? [])
    : [];

  const extraSelectFields =
    category && showDetailed && !showBrandModel && !isEmlak
      ? []
      : category && showDetailed && categorySlug === "yedek-parca"
        ? category.fields.filter(
            (f) => f.type === "select" && f.key !== "marka" && f.key !== "model",
          )
        : category && showBrandModel
          ? category.fields.filter(
              (f) =>
                f.type === "select" &&
                f.key !== "marka" &&
                f.key !== "model",
            )
          : [];

  return (
    <div className="hb-surface space-y-4 p-4">
      {showDetailed && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--lagoon)]">
            Detaylı arama
          </p>
          <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
            {isEmlak
              ? "Oda, kat, m², bina yaşı ve tüm emlak özelliklerine göre arayın."
              : showBrandModel
                ? "Tüm marka ve modellere göre daraltın."
                : "Özelliklere göre daraltın."}
          </p>
        </div>
      )}

      {!isEmlak && (
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
      )}

      {showBrandModel && (
        <>
          <div>
            <Label>{categorySlug === "yedek-parca" ? "Uyumlu Marka" : "Marka"}</Label>
            <Select
              value={value.details.marka ?? "all"}
              onValueChange={(marka) => {
                const next = setDetail(value, "marka", marka ?? "all");
                onChange(setDetail(next, "model", "all"));
              }}
            >
              <SelectTrigger className="mt-1.5 w-full bg-white">
                <SelectValue placeholder="Tüm markalar" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                <SelectItem value="all">Tüm markalar</SelectItem>
                {brands.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{categorySlug === "yedek-parca" ? "Uyumlu Model" : "Model"}</Label>
            <Select
              value={value.details.model ?? "all"}
              onValueChange={(model) => onChange(setDetail(value, "model", model ?? "all"))}
              disabled={!value.details.marka}
            >
              <SelectTrigger className="mt-1.5 w-full bg-white">
                <SelectValue
                  placeholder={value.details.marka ? "Tüm modeller" : "Önce marka seçin"}
                />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                <SelectItem value="all">Tüm modeller</SelectItem>
                {models.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {emlakFields.map((field) => (
        <div key={field.key}>
          <Label>{field.label}</Label>
          <Select
            value={value.details[field.key] ?? "all"}
            onValueChange={(v) => onChange(setDetail(value, field.key, v ?? "all"))}
          >
            <SelectTrigger className="mt-1.5 w-full bg-white">
              <SelectValue placeholder={`Tüm ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              {(field.options ?? []).map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}

      {extraSelectFields.map((field) => (
        <div key={field.key}>
          <Label>{field.label}</Label>
          <Select
            value={value.details[field.key] ?? "all"}
            onValueChange={(v) => onChange(setDetail(value, field.key, v ?? "all"))}
          >
            <SelectTrigger className="mt-1.5 w-full bg-white">
              <SelectValue placeholder="Tümü" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              {(field.options ?? []).map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}

      {isEmlak && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="minM2">Min brüt m²</Label>
              <Input
                id="minM2"
                type="number"
                inputMode="numeric"
                value={value.details.minMetrekare ?? ""}
                onChange={(e) => onChange(setDetail(value, "minMetrekare", e.target.value))}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="maxM2">Max brüt m²</Label>
              <Input
                id="maxM2"
                type="number"
                inputMode="numeric"
                value={value.details.maxMetrekare ?? ""}
                onChange={(e) => onChange(setDetail(value, "maxMetrekare", e.target.value))}
                className="mt-1.5"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="minNet">Min net m²</Label>
              <Input
                id="minNet"
                type="number"
                inputMode="numeric"
                value={value.details.minNetMetrekare ?? ""}
                onChange={(e) => onChange(setDetail(value, "minNetMetrekare", e.target.value))}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="maxNet">Max net m²</Label>
              <Input
                id="maxNet"
                type="number"
                inputMode="numeric"
                value={value.details.maxNetMetrekare ?? ""}
                onChange={(e) => onChange(setDetail(value, "maxNetMetrekare", e.target.value))}
                className="mt-1.5"
              />
            </div>
          </div>
        </>
      )}

      {(categorySlug === "vasita" || categorySlug === "motorsiklet") && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="minYil">Min yıl</Label>
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
            <Label htmlFor="maxYil">Max yıl</Label>
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

      <div>
        <Label>İl</Label>
        <Select
          value={value.city}
          onValueChange={(city) =>
            onChange({ ...value, city: city ?? "all", district: "all" })
          }
        >
          <SelectTrigger className="mt-1.5 w-full">
            <SelectValue placeholder="Tüm iller" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm iller</SelectItem>
            {CITY_NAMES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>İlçe</Label>
        <Select
          value={value.district}
          onValueChange={(district) => onChange({ ...value, district: district ?? "all" })}
          disabled={value.city === "all"}
        >
          <SelectTrigger className="mt-1.5 w-full">
            <SelectValue placeholder="Tüm ilçeler" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm ilçeler</SelectItem>
            {districts.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Satıcı tipi</Label>
        <Select
          value={value.sellerType}
          onValueChange={(sellerType) =>
            onChange({ ...value, sellerType: sellerType ?? "all" })
          }
        >
          <SelectTrigger className="mt-1.5 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Hepsi</SelectItem>
            <SelectItem value="bireysel">Bireysel</SelectItem>
            <SelectItem value="kurumsal">Kurumsal</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="min">Min ₺</Label>
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
          <Label htmlFor="max">Max ₺</Label>
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
        <Select
          value={value.sort}
          onValueChange={(sort) => onChange({ ...value, sort: sort ?? "newest" })}
        >
          <SelectTrigger className="mt-1.5 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">En yeni</SelectItem>
            <SelectItem value="price-asc">Fiyat (artan)</SelectItem>
            <SelectItem value="price-desc">Fiyat (azalan)</SelectItem>
          </SelectContent>
        </Select>
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
    if (f.city !== "all" && l.city !== f.city) return false;
    if (f.district !== "all" && l.district !== f.district) return false;
    if (f.sellerType !== "all" && l.sellerType !== f.sellerType) return false;
    if (f.minPrice && l.price < Number(f.minPrice)) return false;
    if (f.maxPrice && l.price > Number(f.maxPrice) && l.price > 0) return false;

    const fields = l.fields ?? {};
    for (const [key, raw] of Object.entries(f.details)) {
      if (!raw || raw === "all") continue;
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
