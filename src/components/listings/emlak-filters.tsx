"use client";

import { useMemo, useState } from "react";
import { CITY_NAMES, CITIES } from "@/lib/cities";
import { HEPSI, isHepsi } from "@/lib/filter-all";
import type { FilterState } from "@/components/listings/listing-filters";
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
import { ChevronDown, ChevronUp } from "lucide-react";

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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Opt[] | string[];
  allLabel?: string;
}) {
  const normalized: Opt[] = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o,
  );
  const items: Record<string, string> = { [HEPSI]: allLabel };
  for (const o of normalized) items[o.value] = o.label;

  const current = isHepsi(value) ? HEPSI : value;

  return (
    <div>
      <Label className="text-sm">{label}</Label>
      <Select value={current} onValueChange={(v) => onChange(v ?? HEPSI)} items={items}>
        <SelectTrigger className="mt-1.5 w-full bg-white">
          <SelectValue placeholder={allLabel} />
        </SelectTrigger>
        <SelectContent className="z-[200]">
          <SelectItem value={HEPSI}>{allLabel}</SelectItem>
          {normalized.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function EmlakFilters({
  value,
  onChange,
  onReset,
}: {
  value: FilterState;
  onChange: (next: FilterState) => void;
  onReset: () => void;
}) {
  const [gelismis, setGelismis] = useState(false);
  const city = isHepsi(value.city) ? HEPSI : value.city;
  const district = isHepsi(value.district) ? HEPSI : value.district;
  const districts = city !== HEPSI ? CITIES[city] ?? [] : [];
  const d = value.details;

  const cityItems = useMemo(() => {
    const map: Record<string, string> = { [HEPSI]: "Tüm iller" };
    for (const c of CITY_NAMES) map[c] = c;
    return map;
  }, []);

  const districtItems = useMemo(() => {
    const map: Record<string, string> = {
      [HEPSI]: city === HEPSI ? "Önce il seçin" : "Tüm ilçeler",
    };
    for (const x of districts) map[x] = x;
    return map;
  }, [city, districts]);

  const sortItems = {
    newest: "En yeni ilanlar",
    "price-asc": "Fiyat: düşükten yükseğe",
    "price-desc": "Fiyat: yüksekten düşüğe",
  };

  return (
    <div className="hb-surface space-y-4 p-4">
      <div>
        <p className="text-sm font-semibold text-[var(--ink)]">Emlak ara</p>
        <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
          İstediğiniz özellikleri seçin, sonuçlar anında güncellenir.
        </p>
      </div>

      <FieldSelect
        label="Satılık / Kiralık"
        value={d.ilanTipi ?? HEPSI}
        onChange={(v) => onChange(setDetail(value, "ilanTipi", v))}
        options={["Satılık", "Kiralık", "Devren"]}
      />

      <FieldSelect
        label="Konut tipi"
        value={d.emlakTipi ?? HEPSI}
        onChange={(v) => onChange(setDetail(value, "emlakTipi", v))}
        options={["Daire", "Villa", "Müstakil Ev", "Rezidans", "Yazlık", "İşyeri", "Arsa", "Köşk"]}
      />

      <div>
        <Label className="text-sm">İl</Label>
        <Select
          value={city}
          onValueChange={(next) =>
            onChange({ ...value, city: next ?? HEPSI, district: HEPSI })
          }
          items={cityItems}
        >
          <SelectTrigger className="mt-1.5 w-full bg-white">
            <SelectValue placeholder="Tüm iller" />
          </SelectTrigger>
          <SelectContent className="z-[200]">
            <SelectItem value={HEPSI}>Tüm iller</SelectItem>
            {CITY_NAMES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm">İlçe</Label>
        <Select
          value={district}
          onValueChange={(next) => onChange({ ...value, district: next ?? HEPSI })}
          disabled={city === HEPSI}
          items={districtItems}
        >
          <SelectTrigger className="mt-1.5 w-full bg-white">
            <SelectValue placeholder={city === HEPSI ? "Önce il seçin" : "Tüm ilçeler"} />
          </SelectTrigger>
          <SelectContent className="z-[200]">
            <SelectItem value={HEPSI}>Tüm ilçeler</SelectItem>
            {districts.map((x) => (
              <SelectItem key={x} value={x}>
                {x}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <FieldSelect
        label="Oda sayısı"
        value={d.odaSayisi ?? HEPSI}
        onChange={(v) => onChange(setDetail(value, "odaSayisi", v))}
        options={["1+0", "1+1", "2+1", "3+1", "4+1", "5+1", "6+"]}
      />

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="minFiyat" className="text-sm">
            En az fiyat (₺)
          </Label>
          <Input
            id="minFiyat"
            type="number"
            inputMode="numeric"
            placeholder="Örn. 1000000"
            value={value.minPrice}
            onChange={(e) => onChange({ ...value, minPrice: e.target.value })}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="maxFiyat" className="text-sm">
            En fazla fiyat (₺)
          </Label>
          <Input
            id="maxFiyat"
            type="number"
            inputMode="numeric"
            placeholder="Örn. 5000000"
            value={value.maxPrice}
            onChange={(e) => onChange({ ...value, maxPrice: e.target.value })}
            className="mt-1.5"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="minM2" className="text-sm">
            En az m²
          </Label>
          <Input
            id="minM2"
            type="number"
            inputMode="numeric"
            placeholder="Örn. 80"
            value={d.minMetrekare ?? ""}
            onChange={(e) => onChange(setDetail(value, "minMetrekare", e.target.value))}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="maxM2" className="text-sm">
            En fazla m²
          </Label>
          <Input
            id="maxM2"
            type="number"
            inputMode="numeric"
            placeholder="Örn. 200"
            value={d.maxMetrekare ?? ""}
            onChange={(e) => onChange(setDetail(value, "maxMetrekare", e.target.value))}
            className="mt-1.5"
          />
        </div>
      </div>

      <FieldSelect
        label="Bina yaşı"
        value={d.binaYasi ?? HEPSI}
        onChange={(v) => onChange(setDetail(value, "binaYasi", v))}
        options={["0 (Sıfır)", "1-5", "6-10", "11-15", "16-20", "21-25", "26-30", "31+"]}
      />

      <div>
        <Label className="text-sm">Sıralama</Label>
        <Select
          value={value.sort || "newest"}
          onValueChange={(sort) => onChange({ ...value, sort: sort ?? "newest" })}
          items={sortItems}
        >
          <SelectTrigger className="mt-1.5 w-full bg-white">
            <SelectValue placeholder="En yeni ilanlar" />
          </SelectTrigger>
          <SelectContent className="z-[200]">
            <SelectItem value="newest">En yeni ilanlar</SelectItem>
            <SelectItem value="price-asc">Fiyat: düşükten yükseğe</SelectItem>
            <SelectItem value="price-desc">Fiyat: yüksekten düşüğe</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        type="button"
        variant="ghost"
        className="h-9 w-full justify-between px-2 text-sm text-[var(--lagoon)]"
        onClick={() => setGelismis((g) => !g)}
      >
        {gelismis ? "Daha az filtre göster" : "Daha fazla filtre göster"}
        {gelismis ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
      </Button>

      {gelismis && (
        <div className="space-y-4 border-t border-[color-mix(in_oklab,var(--ink)_8%,transparent)] pt-4">
          <FieldSelect
            label="Bulunduğu kat"
            value={d.bulunduguKat ?? HEPSI}
            onChange={(v) => onChange(setDetail(value, "bulunduguKat", v))}
            options={[
              "Bodrum",
              "Zemin",
              "Bahçe Katı",
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
              "10",
              "11",
              "12",
              "13+",
              "Çatı Katı",
              "Villa Tipi",
            ]}
          />
          <FieldSelect
            label="Binadaki kat sayısı"
            value={d.katSayisi ?? HEPSI}
            onChange={(v) => onChange(setDetail(value, "katSayisi", v))}
            options={["1", "2", "3", "4", "5", "6-10", "11-15", "16-20", "21+"]}
          />
          <FieldSelect
            label="Banyo sayısı"
            value={d.banyoSayisi ?? HEPSI}
            onChange={(v) => onChange(setDetail(value, "banyoSayisi", v))}
            options={["1", "2", "3", "4+"]}
          />
          <FieldSelect
            label="Isınma"
            value={d.isinma ?? HEPSI}
            onChange={(v) => onChange(setDetail(value, "isinma", v))}
            options={[
              "Doğalgaz (Kombi)",
              "Merkezi",
              "Merkezi (Pay Ölçer)",
              "Yerden Isıtma",
              "Klima",
              "Soba",
              "Jeotermal",
            ]}
          />
          <FieldSelect
            label="Cephe"
            value={d.cephe ?? HEPSI}
            onChange={(v) => onChange(setDetail(value, "cephe", v))}
            options={[
              "Kuzey",
              "Güney",
              "Doğu",
              "Batı",
              "Kuzey-Doğu",
              "Kuzey-Batı",
              "Güney-Doğu",
              "Güney-Batı",
            ]}
          />
          <FieldSelect
            label="Mutfak"
            value={d.mutfak ?? HEPSI}
            onChange={(v) => onChange(setDetail(value, "mutfak", v))}
            options={["Açık (Amerikan)", "Kapalı", "Ankastre", "Laminat"]}
          />
          <FieldSelect
            label="Balkon"
            value={d.balkon ?? HEPSI}
            onChange={(v) => onChange(setDetail(value, "balkon", v))}
            options={["Var", "Yok", "Teras", "Fransız"]}
          />
          <FieldSelect
            label="Asansör"
            value={d.asansor ?? HEPSI}
            onChange={(v) => onChange(setDetail(value, "asansor", v))}
            options={["Var", "Yok"]}
          />
          <FieldSelect
            label="Otopark"
            value={d.otopark ?? HEPSI}
            onChange={(v) => onChange(setDetail(value, "otopark", v))}
            options={["Yok", "Açık", "Kapalı", "Açık & Kapalı"]}
          />
          <FieldSelect
            label="Eşya durumu"
            value={d.esyali ?? HEPSI}
            onChange={(v) => onChange(setDetail(value, "esyali", v))}
            options={["Eşyalı", "Eşyasız", "Sadece Beyaz Eşya"]}
          />
          <FieldSelect
            label="Kullanım durumu"
            value={d.kullanimDurumu ?? HEPSI}
            onChange={(v) => onChange(setDetail(value, "kullanimDurumu", v))}
            options={["Boş", "Kiracılı", "Mülk Sahibi"]}
          />
          <FieldSelect
            label="Site içinde mi?"
            value={d.siteIcinde ?? HEPSI}
            onChange={(v) => onChange(setDetail(value, "siteIcinde", v))}
            options={["Evet", "Hayır"]}
          />
          <FieldSelect
            label="Tapu durumu"
            value={d.tapuDurumu ?? HEPSI}
            onChange={(v) => onChange(setDetail(value, "tapuDurumu", v))}
            options={[
              "Kat Mülkiyeti",
              "Kat İrtifakı",
              "Müstakil Tapulu",
              "Arsa Tapulu",
              "Hisseli Tapu",
            ]}
          />
          <FieldSelect
            label="Krediye uygun mu?"
            value={d.krediyeUygun ?? HEPSI}
            onChange={(v) => onChange(setDetail(value, "krediyeUygun", v))}
            options={["Evet", "Hayır"]}
          />
          <FieldSelect
            label="Takas"
            value={d.takas ?? HEPSI}
            onChange={(v) => onChange(setDetail(value, "takas", v))}
            options={["Evet", "Hayır"]}
          />
          <FieldSelect
            label="Satıcı tipi"
            value={value.sellerType}
            onChange={(v) => onChange({ ...value, sellerType: isHepsi(v) ? HEPSI : v })}
            options={[
              { value: "bireysel", label: "Bireysel (şahıs)" },
              { value: "kurumsal", label: "Kurumsal (emlak ofisi)" },
            ]}
          />
        </div>
      )}

      <Button type="button" variant="outline" className="w-full" onClick={onReset}>
        Filtreleri temizle
      </Button>
    </div>
  );
}
