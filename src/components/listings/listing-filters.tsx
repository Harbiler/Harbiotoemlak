"use client";

import { CITY_NAMES, CITIES } from "@/lib/cities";
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
}

export const DEFAULT_FILTERS: FilterState = {
  q: "",
  city: "all",
  district: "all",
  sellerType: "all",
  minPrice: "",
  maxPrice: "",
  sort: "newest",
};

export function ListingFilters({
  value,
  onChange,
  onReset,
}: {
  value: FilterState;
  onChange: (next: FilterState) => void;
  onReset: () => void;
}) {
  const districts = value.city !== "all" ? CITIES[value.city] ?? [] : [];

  return (
    <div className="hb-surface space-y-4 p-4">
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
      <Button type="button" variant="outline" className="w-full" onClick={onReset}>
        Filtreleri temizle
      </Button>
    </div>
  );
}

export function applyFilters<T extends {
  title: string;
  description: string;
  city: string;
  district: string;
  sellerType: string;
  price: number;
  createdAt: string;
}>(items: T[], f: FilterState): T[] {
  let result = items.filter((l) => {
    if (f.q) {
      const q = f.q.toLowerCase();
      if (!l.title.toLowerCase().includes(q) && !l.description.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (f.city !== "all" && l.city !== f.city) return false;
    if (f.district !== "all" && l.district !== f.district) return false;
    if (f.sellerType !== "all" && l.sellerType !== f.sellerType) return false;
    if (f.minPrice && l.price < Number(f.minPrice)) return false;
    if (f.maxPrice && l.price > Number(f.maxPrice) && l.price > 0) return false;
    return true;
  });

  result = [...result].sort((a, b) => {
    if (f.sort === "price-asc") return a.price - b.price;
    if (f.sort === "price-desc") return b.price - a.price;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return result;
}
