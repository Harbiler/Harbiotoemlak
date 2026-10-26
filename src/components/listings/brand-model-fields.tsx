"use client";

import { brandNames, modelsForBrand, supportsBrandModelSearch } from "@/lib/brand-models";
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
  marka: string;
  model: string;
  onMarkaChange: (value: string) => void;
  onModelChange: (value: string) => void;
  markaLabel?: string;
  modelLabel?: string;
  required?: boolean;
  className?: string;
}) {
  if (!supportsBrandModelSearch(category)) return null;
  const brands = brandNames(category);
  const models = modelsForBrand(category, marka);
  const brandItems = Object.fromEntries(brands.map((b) => [b, b]));
  const modelItems = Object.fromEntries(models.map((m) => [m, m]));

  return (
    <div className={className ?? "grid gap-4 sm:grid-cols-2"}>
      <div className="space-y-1.5">
        <Label>
          {markaLabel}
          {required ? " *" : ""}
        </Label>
        <Select
          value={marka || undefined}
          onValueChange={(v) => {
            onMarkaChange(v ?? "");
            onModelChange("");
          }}
          items={brandItems}
        >
          <SelectTrigger className="w-full bg-white">
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
          value={model || undefined}
          onValueChange={(v) => onModelChange(v ?? "")}
          disabled={!marka}
          items={modelItems}
        >
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder={marka ? "Model seçin" : "Önce marka seçin"} />
          </SelectTrigger>
          <SelectContent className="z-[200] max-h-72">
            {models.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
