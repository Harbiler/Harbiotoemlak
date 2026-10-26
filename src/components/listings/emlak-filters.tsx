"use client";

import { useState } from "react";
import { CITY_NAMES, CITIES } from "@/lib/cities";
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
  if (!next || next === "all") delete details[key];
  else details[key] = next;
  return { ...value, details };
}

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
  options: { value: string; label: string }[] | string[];
  allLabel?: string;
}) {
  const normalized = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o,
  );
  return (
    <div>
      <Label className="text-sm">{label}</Label>
      <Select value={value || "all"} onValueChange={(v) => onChange(v ?? "all")}>
        <SelectTrigger className="mt-1.5 w-full bg-white">
          <SelectValue placeholder={allLabel} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{allLabel}</SelectItem>
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
  const districts = value.city !== "all" ? CITIES[value.city] ?? [] : [];
  const d = value.details;

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
        value={d.ilanTipi ?? "all"}
        onChange={(v) => onChange(setDetail(value, "ilanTipi", v))}
        options={["Satılık", "Kiralık", "Devren"]}
      />

      <FieldSelect
        label="Konut tipi"
        value={d.emlakTipi ?? "all"}
        onChange={(v) => onChange(setDetail(value, "emlakTipi", v))}
        options={["Daire", "Villa", "Müstakil Ev", "Rezidans", "Yazlık", "İşyeri", "Arsa", "Köşk"]}
      />

      <div>
        <Label className="text-sm">İl</Label>
        <Select
          value={value.city}
          onValueChange={(city) =>
            onChange({ ...value, city: city ?? "all", district: "all" })
          }
        >
          <SelectTrigger className="mt-1.5 w-full bg-white">
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
        <Label className="text-sm">İlçe</Label>
        <Select
          value={value.district}
          onValueChange={(district) => onChange({ ...value, district: district ?? "all" })}
          disabled={value.city === "all"}
        >
          <SelectTrigger className="mt-1.5 w-full bg-white">
            <SelectValue placeholder={value.city === "all" ? "Önce il seçin" : "Tüm ilçeler"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm ilçeler</SelectItem>
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
        value={d.odaSayisi ?? "all"}
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
        value={d.binaYasi ?? "all"}
        onChange={(v) => onChange(setDetail(value, "binaYasi", v))}
        options={["0 (Sıfır)", "1-5", "6-10", "11-15", "16-20", "21-25", "26-30", "31+"]}
      />

      <div>
        <Label className="text-sm">Sıralama</Label>
        <Select
          value={value.sort}
          onValueChange={(sort) => onChange({ ...value, sort: sort ?? "newest" })}
        >
          <SelectTrigger className="mt-1.5 w-full bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
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
            value={d.bulunduguKat ?? "all"}
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
            value={d.katSayisi ?? "all"}
            onChange={(v) => onChange(setDetail(value, "katSayisi", v))}
            options={["1", "2", "3", "4", "5", "6-10", "11-15", "16-20", "21+"]}
          />
          <FieldSelect
            label="Banyo sayısı"
            value={d.banyoSayisi ?? "all"}
            onChange={(v) => onChange(setDetail(value, "banyoSayisi", v))}
            options={["1", "2", "3", "4+"]}
          />
          <FieldSelect
            label="Isınma"
            value={d.isinma ?? "all"}
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
            value={d.cephe ?? "all"}
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
            value={d.mutfak ?? "all"}
            onChange={(v) => onChange(setDetail(value, "mutfak", v))}
            options={["Açık (Amerikan)", "Kapalı", "Ankastre", "Laminat"]}
          />
          <FieldSelect
            label="Balkon"
            value={d.balkon ?? "all"}
            onChange={(v) => onChange(setDetail(value, "balkon", v))}
            options={["Var", "Yok", "Teras", "Fransız"]}
          />
          <FieldSelect
            label="Asansör"
            value={d.asansor ?? "all"}
            onChange={(v) => onChange(setDetail(value, "asansor", v))}
            options={["Var", "Yok"]}
          />
          <FieldSelect
            label="Otopark"
            value={d.otopark ?? "all"}
            onChange={(v) => onChange(setDetail(value, "otopark", v))}
            options={["Yok", "Açık", "Kapalı", "Açık & Kapalı"]}
          />
          <FieldSelect
            label="Eşya durumu"
            value={d.esyali ?? "all"}
            onChange={(v) => onChange(setDetail(value, "esyali", v))}
            options={["Eşyalı", "Eşyasız", "Sadece Beyaz Eşya"]}
          />
          <FieldSelect
            label="Kullanım durumu"
            value={d.kullanimDurumu ?? "all"}
            onChange={(v) => onChange(setDetail(value, "kullanimDurumu", v))}
            options={["Boş", "Kiracılı", "Mülk Sahibi"]}
          />
          <FieldSelect
            label="Site içinde mi?"
            value={d.siteIcinde ?? "all"}
            onChange={(v) => onChange(setDetail(value, "siteIcinde", v))}
            options={["Evet", "Hayır"]}
          />
          <FieldSelect
            label="Tapu durumu"
            value={d.tapuDurumu ?? "all"}
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
            value={d.krediyeUygun ?? "all"}
            onChange={(v) => onChange(setDetail(value, "krediyeUygun", v))}
            options={["Evet", "Hayır"]}
          />
          <FieldSelect
            label="Takas"
            value={d.takas ?? "all"}
            onChange={(v) => onChange(setDetail(value, "takas", v))}
            options={["Evet", "Hayır"]}
          />
          <FieldSelect
            label="Satıcı tipi"
            value={value.sellerType}
            onChange={(v) => onChange({ ...value, sellerType: v })}
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
