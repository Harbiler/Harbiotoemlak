"use client";

import { useEffect, useId, useRef } from "react";
import { brandNames, modelsForBrand } from "@/lib/brand-models";
import { HEPSI, isHepsi } from "@/lib/filter-all";
import { Label } from "@/components/ui/label";
import { cn } from "cn";

const selectClassName = cn(
  "mt-1.5 h-8 w-full min-w-0 appearance-none rounded-lg border border-input bg-white bg-[length:1rem] bg-[right_0.5rem_center] bg-no-repeat px-2.5 py-1 pr-8 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
  "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%27%236b7280%27 stroke-width=%272%27%3E%3Cpath stroke-linecap=%27round%27 stroke-linejoin=%27round%27 d=%27m6 9 6 6 6-6%27/%3E%3C/svg%3E')]",
);

export function BrandModelFilterFields({
  category,
  marka,
  model,
  onMarkaChange,
  onModelChange,
  markaLabel = "Marka",
  modelLabel = "Model",
}: {
  category: string;
  marka: string;
  model: string;
  onMarkaChange: (marka: string) => void;
  /** Second arg is the brand currently selected (avoids stale React state). */
  onModelChange: (model: string, marka: string) => void;
  markaLabel?: string;
  modelLabel?: string;
}) {
  const reactId = useId().replace(/:/g, "");
  const brandId = `hb-brand-${reactId}`;
  const modelId = `hb-model-${reactId}`;
  const brandRef = useRef<HTMLSelectElement>(null);
  const modelRef = useRef<HTMLSelectElement>(null);
  const markaCb = useRef(onMarkaChange);
  const modelCb = useRef(onModelChange);
  markaCb.current = onMarkaChange;
  modelCb.current = onModelChange;

  const brands = brandNames(category);
  const normalizedMarka = isHepsi(marka) ? HEPSI : marka;
  const normalizedModel = isHepsi(model) ? HEPSI : model;
  const initialModels =
    normalizedMarka !== HEPSI
      ? modelsForBrand(category, normalizedMarka)
      : [];

  useEffect(() => {
    const brandSelect = brandRef.current;
    const modelSelect = modelRef.current;
    if (!brandSelect || !modelSelect) return;

    const onBrand = () => {
      markaCb.current(brandSelect.value || HEPSI);
    };
    const onModel = () => {
      modelCb.current(
        modelSelect.value || HEPSI,
        brandSelect.value || HEPSI,
      );
    };

    brandSelect.addEventListener("change", onBrand);
    modelSelect.addEventListener("change", onModel);
    return () => {
      brandSelect.removeEventListener("change", onBrand);
      modelSelect.removeEventListener("change", onModel);
    };
  }, []);

  useEffect(() => {
    const brandSelect = brandRef.current;
    const modelSelect = modelRef.current;
    if (!brandSelect || !modelSelect) return;
    if (brandSelect.value !== normalizedMarka) {
      brandSelect.value = normalizedMarka;
      brandSelect.dispatchEvent(new Event("change", { bubbles: true }));
      return;
    }
    if (
      !modelSelect.disabled &&
      modelSelect.value !== normalizedModel &&
      [...modelSelect.options].some((o) => o.value === normalizedModel)
    ) {
      modelSelect.value = normalizedModel;
    }
  }, [normalizedMarka, normalizedModel]);

  return (
    <>
      <div>
        <Label htmlFor={brandId} className="text-sm">
          {markaLabel}
        </Label>
        <select
          id={brandId}
          ref={brandRef}
          data-slot="native-select"
          data-hb-role="brand"
          data-hb-model-id={modelId}
          data-hb-category={category}
          className={selectClassName}
          defaultValue={normalizedMarka}
        >
          <option value={HEPSI}>Tüm markalar</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor={modelId} className="text-sm">
          {modelLabel}
        </Label>
        <select
          id={modelId}
          ref={modelRef}
          data-slot="native-select"
          data-hb-role="model"
          className={selectClassName}
          defaultValue={
            initialModels.includes(normalizedModel)
              ? normalizedModel
              : HEPSI
          }
          disabled={normalizedMarka === HEPSI}
        >
          <option value={HEPSI}>
            {normalizedMarka === HEPSI
              ? "Önce marka seçin"
              : "Tüm modeller"}
          </option>
          {initialModels.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
