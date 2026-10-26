"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useListings } from "@/context/listings-context";
import { CATEGORIES, getCategory } from "@/lib/categories";
import { CITY_NAMES, CITIES } from "@/lib/cities";
import type { CategorySlug, ListingStatus } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { CategoryIcon } from "@/components/category-icon";
import { SellerBadge } from "@/components/listings/seller-badge";
import { ListingsLoading } from "@/components/listings/listing-states";
import { PhotoPlaceholder } from "@/components/listings/photo-placeholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { BrandModelFields } from "@/components/listings/brand-model-fields";
import { supportsBrandModelSearch } from "@/lib/brand-models";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

type Step = "kategori" | "form" | "onizleme" | "yayin";

interface Draft {
  category: CategorySlug | "";
  title: string;
  description: string;
  price: string;
  city: string;
  district: string;
  contactName: string;
  contactPhone: string;
  fields: Record<string, string>;
}

const STEPS: { id: Step; label: string }[] = [
  { id: "kategori", label: "Kategori" },
  { id: "form", label: "Detaylar" },
  { id: "onizleme", label: "Önizleme" },
  { id: "yayin", label: "Yayınla" },
];

function NewListingWizard() {
  const { user, ready } = useAuth();
  const { createListing } = useListings();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preset = searchParams.get("kategori");

  const [step, setStep] = useState<Step>("kategori");
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(() => ({
    category:
      preset && getCategory(preset) ? (preset as CategorySlug) : "",
    title: "",
    description: "",
    price: "",
    city: "İstanbul",
    district: "Kadıköy",
    contactName: "",
    contactPhone: "",
    fields: {},
  }));

  useEffect(() => {
    if (ready && !user) {
      router.replace(`/giris?next=${encodeURIComponent("/ilan/yeni")}`);
    }
  }, [ready, user, router]);

  useEffect(() => {
    if (user) {
      setDraft((d) => ({
        ...d,
        contactName: d.contactName || user.companyName || user.name,
        contactPhone: d.contactPhone || user.phone,
      }));
    }
  }, [user]);

  const category = draft.category ? getCategory(draft.category) : undefined;
  const districts = CITIES[draft.city] ?? [];
  const stepIndex = STEPS.findIndex((s) => s.id === step);

  const previewListing = useMemo(() => {
    if (!draft.category || !user) return null;
    return {
      sellerType: user.membershipKind,
      sellerKurumsalType: user.kurumsalType,
      category: draft.category,
      title: draft.title || "Başlıksız ilan",
      description: draft.description,
      price: draft.price ? Number(draft.price) : 0,
      city: draft.city,
      district: draft.district,
      contactName: draft.contactName,
      contactPhone: draft.contactPhone,
      fields: draft.fields,
    };
  }, [draft, user]);

  function validateForm(): string | null {
    if (!draft.category) return "Kategori seçin.";
    if (!draft.title.trim()) return "Başlık zorunludur.";
    if (draft.description.trim().length < 20) return "Açıklama en az 20 karakter olmalıdır.";
    if (!draft.contactName.trim() || !draft.contactPhone.trim()) {
      return "İletişim bilgileri zorunludur.";
    }
    const fields = category?.fields ?? [];
    for (const f of fields) {
      if (f.required && !draft.fields[f.key]?.trim()) return `${f.label} zorunludur.`;
    }
    return null;
  }

  function publish() {
    if (!user || !draft.category) return;
    const err = validateForm();
    if (err) {
      setError(err);
      setStep("form");
      return;
    }
    setError(null);
    const parsedFields: Record<string, string | number | boolean> = {};
    for (const field of category?.fields ?? []) {
      const raw = draft.fields[field.key];
      if (raw === undefined || raw === "") continue;
      parsedFields[field.key] = field.type === "number" ? Number(raw) : raw;
    }
    const status: ListingStatus = user.role === "admin" ? "approved" : "pending";
    const created = createListing({
      category: draft.category,
      title: draft.title.trim(),
      description: draft.description.trim(),
      price: draft.price ? Number(draft.price) : 0,
      city: draft.city,
      district: draft.district,
      photos: [`${draft.category}-new`, `${draft.category}-new-2`],
      contactName: draft.contactName.trim(),
      contactPhone: draft.contactPhone.trim(),
      sellerType: user.membershipKind,
      sellerKurumsalType: user.kurumsalType,
      sellerId: user.id,
      status,
      fields: parsedFields,
    });
    setStep("yayin");
    setTimeout(() => {
      router.push(
        status === "pending"
          ? `/ilan/${created.id}?pending=1`
          : `/ilan/${created.id}`,
      );
    }, 900);
  }

  if (!ready || !user) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <ListingsLoading />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="hb-display text-3xl font-bold text-[var(--ink)]">İlan Ver</h1>
      <p className="mt-1 text-[var(--muted-foreground)]">
        Kategori seçin, detayları doldurun, önizleyin ve yayınlayın.
      </p>

      <ol className="mt-8 flex flex-wrap gap-2">
        {STEPS.map((s, i) => (
          <li
            key={s.id}
            className={cn(
              "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold",
              i <= stepIndex
                ? "bg-[var(--lagoon)] text-white"
                : "bg-[var(--mist)] text-[var(--muted-foreground)]",
            )}
          >
            <span className="flex size-5 items-center justify-center rounded-full bg-white/20 text-[10px]">
              {i < stepIndex ? <Check className="size-3" /> : i + 1}
            </span>
            {s.label}
          </li>
        ))}
      </ol>

      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {step === "kategori" && (
        <div className="mt-8 space-y-3">
          <p className="text-sm font-medium text-[var(--ink)]">Kategori seçin</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => {
                  setDraft((d) => ({ ...d, category: c.slug, fields: {} }));
                  setStep("form");
                  setError(null);
                }}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition hover:border-[var(--lagoon)] hover:bg-white",
                  draft.category === c.slug
                    ? "border-[var(--lagoon)] bg-white ring-2 ring-[var(--lagoon)]/20"
                    : "border-[color-mix(in_oklab,var(--ink)_10%,transparent)] bg-white/50",
                )}
              >
                <span
                  className="flex size-10 items-center justify-center rounded-lg text-white"
                  style={{ backgroundColor: c.accent }}
                >
                  <CategoryIcon slug={c.slug} />
                </span>
                <span>
                  <span className="block font-semibold text-[var(--ink)]">{c.name}</span>
                  <span className="text-xs text-[var(--muted-foreground)]">{c.shortName}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === "form" && category && (
        <div className="mt-8 space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--muted-foreground)]">
              Kategori: <strong className="text-[var(--ink)]">{category.name}</strong>
            </p>
            <Button type="button" variant="ghost" size="sm" onClick={() => setStep("kategori")}>
              Değiştir
            </Button>
          </div>

          <div className="hb-surface space-y-4 p-5">
            <div>
              <Label htmlFor="title">Başlık *</Label>
              <Input
                id="title"
                className="mt-1.5"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="desc">Açıklama *</Label>
              <Textarea
                id="desc"
                className="mt-1.5"
                rows={5}
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="price">Fiyat (₺)</Label>
              <Input
                id="price"
                type="number"
                className="mt-1.5"
                value={draft.price}
                onChange={(e) => setDraft({ ...draft, price: e.target.value })}
                placeholder="0 = fiyat sorulur"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>İl</Label>
                <Select
                  value={draft.city}
                  onValueChange={(city) => {
                    const c = city ?? draft.city;
                    setDraft({ ...draft, city: c, district: CITIES[c]?.[0] ?? "" });
                  }}
                >
                  <SelectTrigger className="mt-1.5 w-full">
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
              <div>
                <Label>İlçe</Label>
                <Select
                  value={draft.district}
                  onValueChange={(district) =>
                    setDraft({ ...draft, district: district ?? draft.district })
                  }
                >
                  <SelectTrigger className="mt-1.5 w-full">
                    <SelectValue />
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
            </div>
          </div>

          {(category.fields.length > 0) && (
            <div className="hb-surface space-y-4 p-5">
              <h2 className="font-semibold text-[var(--ink)]">{category.name} alanları</h2>
              {supportsBrandModelSearch(category.slug) && (
                <BrandModelFields
                  category={category.slug}
                  marka={draft.fields.marka ?? ""}
                  model={draft.fields.model ?? ""}
                  onMarkaChange={(v) =>
                    setDraft({
                      ...draft,
                      fields: { ...draft.fields, marka: v, model: "" },
                    })
                  }
                  onModelChange={(v) =>
                    setDraft({
                      ...draft,
                      fields: { ...draft.fields, model: v },
                    })
                  }
                  markaLabel={category.slug === "yedek-parca" ? "Uyumlu Marka" : "Marka"}
                  modelLabel={category.slug === "yedek-parca" ? "Uyumlu Model" : "Model"}
                  required
                />
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                {category.fields
                  .filter((field) => {
                    if (!supportsBrandModelSearch(category.slug)) return true;
                    return field.key !== "marka" && field.key !== "model";
                  })
                  .map((field) => (
                  <div key={field.key}>
                    <Label>
                      {field.label}
                      {field.required ? " *" : ""}
                    </Label>
                    <div className="mt-1.5">
                      {field.type === "select" && field.options ? (
                        <Select
                          value={draft.fields[field.key] || undefined}
                          onValueChange={(v) =>
                            setDraft({
                              ...draft,
                              fields: { ...draft.fields, [field.key]: v ?? "" },
                            })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options.map((o) => (
                              <SelectItem key={o} value={o}>
                                {o}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          type={field.type === "number" ? "number" : "text"}
                          value={draft.fields[field.key] ?? ""}
                          placeholder={field.placeholder}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              fields: { ...draft.fields, [field.key]: e.target.value },
                            })
                          }
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="hb-surface grid gap-4 p-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="cname">Ad / Firma *</Label>
              <Input
                id="cname"
                className="mt-1.5"
                value={draft.contactName}
                onChange={(e) => setDraft({ ...draft, contactName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="cphone">Telefon *</Label>
              <Input
                id="cphone"
                className="mt-1.5"
                value={draft.contactPhone}
                onChange={(e) => setDraft({ ...draft, contactPhone: e.target.value })}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" onClick={() => setStep("kategori")}>
              <ArrowLeft className="size-4" />
              Geri
            </Button>
            <Button
              type="button"
              className="bg-[var(--lagoon)] hover:bg-[#0a5a5a]"
              onClick={() => {
                const err = validateForm();
                if (err) setError(err);
                else {
                  setError(null);
                  setStep("onizleme");
                }
              }}
            >
              Önizlemeye geç
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {step === "onizleme" && previewListing && draft.category && (
        <div className="mt-8 space-y-6">
          <div className="hb-surface overflow-hidden">
            <PhotoPlaceholder
              category={draft.category}
              title={draft.title}
              large
              className="aspect-[16/9] w-full"
            />
            <div className="space-y-3 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <SellerBadge listing={previewListing} />
                <span className="text-sm text-[var(--muted-foreground)]">
                  {draft.city} / {draft.district}
                </span>
              </div>
              <h2 className="hb-display text-2xl font-bold text-[var(--ink)]">
                {draft.title}
              </h2>
              <p className="text-xl font-bold text-[var(--ink)]">
                {formatPrice(draft.price ? Number(draft.price) : 0)}
              </p>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--muted-foreground)]">
                {draft.description}
              </p>
              <p className="text-sm">
                İletişim: {draft.contactName} · {draft.contactPhone}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" onClick={() => setStep("form")}>
              <ArrowLeft className="size-4" />
              Düzenle
            </Button>
            <Button
              type="button"
              className="bg-[var(--lagoon)] hover:bg-[#0a5a5a]"
              onClick={publish}
            >
              Yayınla
              <Check className="size-4" />
            </Button>
          </div>
          {user.role !== "admin" && (
            <p className="text-xs text-[var(--muted-foreground)]">
              İlanınız admin onayından sonra yayına alınır (durum: Beklemede).
            </p>
          )}
        </div>
      )}

      {step === "yayin" && (
        <div className="mt-12 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[var(--lagoon)] text-white">
            <Check className="size-7" />
          </div>
          <h2 className="hb-display mt-4 text-2xl font-bold text-[var(--ink)]">
            İlan gönderildi
          </h2>
          <p className="mt-2 text-[var(--muted-foreground)]">Detay sayfasına yönlendiriliyorsunuz…</p>
          <Button asChild variant="outline" className="mt-6">
            <Link href="/hesabim">Hesabıma git</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

export default function NewListingPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <ListingsLoading />
        </div>
      }
    >
      <NewListingWizard />
    </Suspense>
  );
}
