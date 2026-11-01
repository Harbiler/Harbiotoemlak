"use client";

import {
  brandCatalogFor,
  modelsFromCatalog,
  resolveCatalogBrand,
  sortedBrandNames,
  supportsBrandModelSearch,
  type BrandCatalog,
} from "@/lib/brand-models";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function BrandModelFields({
  category,
  catalog,
  marka,
  model,
  onMarkaChange,
  onModelChange,
  markaLabel = "Marka",
  modelLabel = "Model",
  required,
  className,
}: {
  category: string;
  /** Brand→model map for this form (e.g. Motorsiklet alt kategori). */
  catalog?: BrandCatalog;
  marka: string;
  model: string;
  /** Parent must clear model when marka changes. */
  onMarkaChange: (value: string) => void;
  onModelChange: (value: string) => void;
  markaLabel?: string;
  modelLabel?: string;
  required?: boolean;
  className?: string;
}) {
  const resolved = catalog ?? brandCatalogFor(category);
  if (!resolved && !supportsBrandModelSearch(category)) return null;
  const brandsMap = resolved ?? {};
  const brands = sortedBrandNames(brandsMap);
  // Canonicalize so TVS / Tvs / "TVS Motor" all hit the same model list.
  const canonicalMarka = resolveCatalogBrand(brandsMap, marka) ?? marka;
  // Strict brand link: only this marka's models (same pattern as cars / filters).
  // Always read from the live catalog map — never a cached partial slice.
  const models = canonicalMarka
    ? [...modelsFromCatalog(brandsMap, canonicalMarka)]
    : [];
  const brandItems = Object.fromEntries(brands.map((b) => [b, b]));
  const modelItems = Object.fromEntries(models.map((m) => [m, m]));
  // Remount Model when brand OR model-list fingerprint changes (HMR / catalog refresh).
  const modelSelectKey = canonicalMarka
    ? `model:${canonicalMarka}:${models.length}:${models.join("\u001f")}`
    : "model:none";

  return (
    <div
      className={className ?? "grid gap-4 sm:grid-cols-2"}
      data-hb-brand-model-fields="1"
      data-hb-marka={canonicalMarka || ""}
      data-hb-model-count={models.length}
    >
      <div className="space-y-1.5">
        <Label>
          {markaLabel}
          {required ? " *" : ""}
        </Label>
        <Select
          value={canonicalMarka || undefined}
          onValueChange={(v) => {
            // Single parent update — avoids stale double setState wiping marka.
            // Store the catalog key so Model always resolves (esp. TVS).
            const next = v ?? "";
            onMarkaChange(resolveCatalogBrand(brandsMap, next) ?? next);
          }}
          items={brandItems}
        >
          <SelectTrigger className="w-full bg-white" data-hb-role="create-brand">
            <SelectValue placeholder="Marka seçin" />
          </SelectTrigger>
          <SelectContent className="z-[200] max-h-72">
            {brands.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label>
          {modelLabel}
          {required ? " *" : ""}
        </Label>
        <Select
          key={modelSelectKey}
          value={model && models.includes(model) ? model : undefined}
          onValueChange={(v) => onModelChange(v ?? "")}
          disabled={!canonicalMarka || models.length === 0}
          items={modelItems}
        >
          <SelectTrigger
            className="w-full bg-white"
            data-hb-role="create-model"
            data-hb-model-count={models.length}
          >
            <SelectValue
              placeholder={
                !canonicalMarka
                  ? "Önce marka seçin"
                  : models.length
                    ? "Model seçin"
                    : "Model bulunamadı"
              }
            />
          </SelectTrigger>
          <SelectContent className="z-[200] max-h-72">
            {models.map((m) => (
              <SelectItem key={`${canonicalMarka}:${m}`} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
