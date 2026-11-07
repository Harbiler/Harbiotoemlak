"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useListings } from "@/context/listings-context";
import { NAV_CATEGORIES, getCategory } from "@/lib/categories";
import { CITY_NAMES, CITIES } from "@/lib/cities";
import type { CategorySlug, ListingStatus } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { freeListingCopy, freeListingValidUntil } from "@/lib/listing-validity";
import { CategoryIcon } from "@/components/category-icon";
import { SellerBadge } from "@/components/listings/seller-badge";
import { ListingsLoading } from "@/components/listings/listing-states";
import { PhotoPlaceholder } from "@/components/listings/photo-placeholder";
import { PhotoUploadFields } from "@/components/listings/photo-upload-fields";
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
import { AddressMap } from "@/components/listings/address-map";
import { BrandModelFields } from "@/components/listings/brand-model-fields";
import { IdentityDocsFields } from "@/components/listings/identity-docs-fields";
import { supportsBrandModelSearch } from "@/lib/brand-models";
import {
  getVasitaSubcategory,
  VASITA_SUBCATEGORIES,
} from "@/lib/vasita-subcategories";
import {
  hasRequiredIdentityDocs,
  IDENTITY_DOCS_ERROR,
  readFileAsAppFile,
} from "@/lib/application-file";
import {
  emptyPhotoSlots,
  isRenderablePhoto,
  LISTING_PHOTO_SLOT_COUNT,
  photoSlotCountForCategory,
  resolveListingPhotos,
  resizePhotoFiles,
} from "@/lib/listing-photos";
import type { ListingIdentityDocs } from "@/lib/types";
import { listingPath } from "@/lib/listing-path";
import {
  gateListingPublish,
  rejectionUserMessage,
} from "@/lib/listing-publish-moderation";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";

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
  const presetAlt = searchParams.get("alt");
  const presetMeslek = searchParams.get("meslek");

  const [step, setStep] = useState<Step>("kategori");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [rejectNotice, setRejectNotice] = useState<string | null>(null);
  const [idFrontFile, setIdFrontFile] = useState<File | null>(null);
  const [idBackFile, setIdBackFile] = useState<File | null>(null);
  const [passportFile, setPassportFile] = useState<File | null>(null);
  const initialCategory =
    preset && getCategory(preset) ? (preset as CategorySlug) : "";
  const [photoFiles, setPhotoFiles] = useState<(File | null)[]>(() =>
    emptyPhotoSlots(initialCategory || LISTING_PHOTO_SLOT_COUNT),
  );
  const [photoObjectUrls, setPhotoObjectUrls] = useState<(string | undefined)[]>(
    () =>
      emptyPhotoSlots(initialCategory || LISTING_PHOTO_SLOT_COUNT).map(
        () => undefined,
      ),
  );
  const [draft, setDraft] = useState<Draft>(() => ({
    category: initialCategory,
    title: "",
    description: "",
    price: "",
    city: "İstanbul",
    district: "Kadıköy",
    contactName: "",
    contactPhone: "",
    fields: ((): Record<string, string> => {
      if (preset === "vasita" && presetAlt && getVasitaSubcategory(presetAlt)) {
        return { altKategori: presetAlt };
      }
      if (preset === "toptancilar" && presetMeslek) {
        return { toptanMeslek: presetMeslek };
      }
      return {};
    })(),
  }));

  useEffect(() => {
    if (ready && !user) {
      router.replace(`/giris?next=${encodeURIComponent("/ilan/yeni")}`);
    }
  }, [ready, user, router]);

  useEffect(() => {
    const urls = photoFiles.map((file) =>
      file ? URL.createObjectURL(file) : undefined,
    );
    setPhotoObjectUrls(urls);
    return () => {
      urls.forEach((u) => {
        if (u) URL.revokeObjectURL(u);
      });
    };
  }, [photoFiles]);

  // URL ?kategori= / &alt= (e.g. Motorsiklet) → jump to form; Vasıta may still need alt.
  // Never clobber an advanced step (onizleme / yayin) if this effect re-fires
  // after a remount / Strict Mode / Suspense replay — that aborted preview nav.
  useEffect(() => {
    if (draft.category && getCategory(draft.category)) {
      setStep((s) => (s === "kategori" ? "form" : s));
    }
    // Only on mount / preset — do not re-run when user goes back to kategori.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  const photoSlotCount = photoSlotCountForCategory(draft.category);

  useEffect(() => {
    setPhotoFiles((prev) => resizePhotoFiles(prev, photoSlotCount));
  }, [photoSlotCount]);

  /** Functional field write — avoids stale closures wiping marka/model mid-form. */
  function setDraftField(key: string, value: string) {
    setDraft((d) => ({ ...d, fields: { ...d.fields, [key]: value } }));
  }

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
    if (!draft.city || !draft.district) return "İl ve ilçe seçin.";
    if (!draft.contactName.trim() || !draft.contactPhone.trim()) {
      return "İletişim bilgileri zorunludur.";
    }
    if (draft.category === "vasita" && !draft.fields.altKategori) {
      return "Vasıta alt kategorisi seçin.";
    }
    if (
      supportsBrandModelSearch(draft.category) &&
      (draft.category !== "vasita" || draft.fields.altKategori) &&
      (!draft.fields.marka?.trim() || !draft.fields.model?.trim())
    ) {
      return "Marka ve model zorunludur.";
    }
    const fields = category?.fields ?? [];
    for (const f of fields) {
      if (f.required && !draft.fields[f.key]?.trim()) return `${f.label} zorunludur.`;
    }
    if (draft.category === "bakici-arayanlar") {
      if (
        !hasRequiredIdentityDocs({
          idFront: idFrontFile,
          idBack: idBackFile,
          passport: passportFile,
        })
      ) {
        return IDENTITY_DOCS_ERROR;
      }
    }
    return null;
  }

  function goToPreview() {
    const err = validateForm();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setStep("onizleme");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function publish() {
    if (!user || !draft.category) return;
    const err = validateForm();
    if (err) {
      setError(err);
      setStep("form");
      return;
    }
    setError(null);
    try {
      const parsedFields: Record<string, string | number | boolean> = {};
      for (const field of category?.fields ?? []) {
        const raw = draft.fields[field.key];
        if (raw === undefined || raw === "") continue;
        parsedFields[field.key] = field.type === "number" ? Number(raw) : raw;
      }
      if (draft.category === "vasita" && draft.fields.altKategori) {
        parsedFields.altKategori = draft.fields.altKategori;
      }

      let identityDocs: ListingIdentityDocs | undefined;
      if (draft.category === "bakici-arayanlar") {
        const [idFront, idBack, passport] = await Promise.all([
          idFrontFile ? readFileAsAppFile(idFrontFile) : Promise.resolve(undefined),
          idBackFile ? readFileAsAppFile(idBackFile) : Promise.resolve(undefined),
          passportFile
            ? readFileAsAppFile(passportFile)
            : Promise.resolve(undefined),
        ]);
        identityDocs = {};
        if (idFront) identityDocs.idFront = idFront;
        if (idBack) identityDocs.idBack = idBack;
        if (passport) identityDocs.passport = passport;
      }

      const photos = await resolveListingPhotos({
        category: draft.category,
        files: photoFiles,
      });
      const moderation = await gateListingPublish({
        photos,
        fileNames: photoFiles.map((f) => f?.name),
        intendedStatus: "approved",
        recipientEmail: user.email,
        listingTitle: draft.title.trim(),
      });
      const status: ListingStatus = moderation.status;
      const publishedAt = new Date().toISOString();
      const created = createListing({
        category: draft.category,
        title: draft.title.trim(),
        description: draft.description.trim(),
        price: draft.price ? Number(draft.price) : 0,
        city: draft.city,
        district: draft.district,
        photos,
        contactName: draft.contactName.trim(),
        contactPhone: draft.contactPhone.trim(),
        sellerType: user.membershipKind,
        sellerKurumsalType: user.kurumsalType,
        sellerId: user.id,
        status,
        validUntil: freeListingValidUntil(publishedAt),
        fields: parsedFields,
        moderatedAt: publishedAt,
        ...(moderation.rejectReason
          ? { rejectReason: moderation.rejectReason }
          : { rejectReason: undefined }),
        ...(identityDocs ? { identityDocs } : {}),
      });
      if (moderation.flagged && moderation.rejectReason) {
        setSuccess(false);
        setRejectNotice(rejectionUserMessage(moderation.rejectReason));
        setStep("yayin");
        return;
      }
      setRejectNotice(null);
      setSuccess(true);
      setStep("yayin");
      setTimeout(() => {
        router.push(listingPath(created.id));
      }, 2000);
    } catch (publishErr) {
      setError(
        publishErr instanceof Error ? publishErr.message : "İlan yayınlanamadı.",
      );
      setStep("form");
    }
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
      <p className="mt-3 rounded-lg border border-[color-mix(in_oklab,var(--lagoon)_25%,transparent)] bg-[color-mix(in_oklab,var(--mist)_70%,white)] px-3 py-2 text-sm text-[var(--ink)]">
        <span className="font-semibold text-[var(--lagoon)]">{freeListingCopy.badge}</span>
        {" — "}
        {freeListingCopy.short} Ücretli paket gerekmez.
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
            {NAV_CATEGORIES.map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => {
                  setDraft((d) => {
                    const fields: Record<string, string> =
                      c.slug === "vasita" && d.fields.altKategori
                        ? { altKategori: d.fields.altKategori }
                        : {};
                    return {
                      ...d,
                      category: c.slug,
                      // Keep Motorsiklet (etc.) alt when re-picking Vasıta from preset URL.
                      fields,
                    };
                  });
                  setIdFrontFile(null);
                  setIdBackFile(null);
                  setPassportFile(null);
                  setPhotoFiles(
                    resizePhotoFiles(
                      emptyPhotoSlots(c.slug),
                      photoSlotCountForCategory(c.slug),
                    ),
                  );
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
                onChange={(e) =>
                  setDraft((d) => ({ ...d, title: e.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="desc">Açıklama *</Label>
              <Textarea
                id="desc"
                className="mt-1.5"
                rows={5}
                value={draft.description}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, description: e.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="price">Fiyat (₺)</Label>
              <Input
                id="price"
                type="number"
                className="mt-1.5"
                value={draft.price}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, price: e.target.value }))
                }
                placeholder="0 = fiyat sorulur"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>İl</Label>
                <Select
                  value={draft.city}
                  onValueChange={(city) => {
                    setDraft((d) => {
                      const c = city ?? d.city;
                      return {
                        ...d,
                        city: c,
                        district: CITIES[c]?.[0] ?? "",
                      };
                    });
                  }}
                  items={Object.fromEntries(CITY_NAMES.map((c) => [c, c]))}
                >
                  <SelectTrigger className="mt-1.5 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[200]">
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
                    setDraft((d) => ({
                      ...d,
                      district: district ?? d.district,
                    }))
                  }
                  items={Object.fromEntries(districts.map((d) => [d, d]))}
                >
                  <SelectTrigger className="mt-1.5 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[200]">
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
              {category.slug === "vasita" && (
                <div>
                  <Label>Vasıta alt kategori *</Label>
                  <Select
                    value={draft.fields.altKategori || undefined}
                    onValueChange={(v) =>
                      // Functional update — stale draft during remount/race must not
                      // resurrect an old marka/model after alt kategori changes.
                      setDraft((d) => ({
                        ...d,
                        fields: {
                          ...d.fields,
                          altKategori: v ?? "",
                          marka: "",
                          model: "",
                        },
                      }))
                    }
                    items={Object.fromEntries(
                      VASITA_SUBCATEGORIES.map((s) => [s.slug, s.name]),
                    )}
                  >
                    <SelectTrigger className="mt-1.5 w-full bg-white">
                      <SelectValue placeholder="Alt kategori seçin" />
                    </SelectTrigger>
                    <SelectContent className="z-[200] max-h-72">
                      {VASITA_SUBCATEGORIES.map((s) => (
                        <SelectItem key={s.slug} value={s.slug}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {supportsBrandModelSearch(category.slug) &&
                (category.slug !== "vasita" || !!draft.fields.altKategori) && (
                <BrandModelFields
                  key={`bm-${category.slug}-${draft.fields.altKategori || "all"}`}
                  category={category.slug}
                  catalog={
                    category.slug === "vasita" && draft.fields.altKategori
                      ? getVasitaSubcategory(draft.fields.altKategori)?.brands
                      : undefined
                  }
                  marka={draft.fields.marka ?? ""}
                  model={draft.fields.model ?? ""}
                  onMarkaChange={(v) =>
                    setDraft((d) => ({
                      ...d,
                      fields: { ...d.fields, marka: v, model: "" },
                    }))
                  }
                  onModelChange={(v) =>
                    setDraft((d) => ({
                      ...d,
                      fields: { ...d.fields, model: v },
                    }))
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
                  <div
                    key={field.key}
                    className={field.type === "textarea" ? "sm:col-span-2" : undefined}
                  >
                    <Label>
                      {field.label}
                      {field.required ? " *" : ""}
                    </Label>
                    <div className="mt-1.5">
                      {field.type === "select" && field.options ? (
                        <Select
                          value={draft.fields[field.key] || undefined}
                          onValueChange={(v) =>
                            setDraftField(field.key, v ?? "")
                          }
                          items={Object.fromEntries(
                            field.options.map((o) => [o, o]),
                          )}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seçin" />
                          </SelectTrigger>
                          <SelectContent className="z-[200]">
                            {field.options.map((o) => (
                              <SelectItem key={o} value={o}>
                                {o}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : field.type === "textarea" ? (
                        <Textarea
                          value={draft.fields[field.key] ?? ""}
                          placeholder={field.placeholder}
                          rows={3}
                          onChange={(e) =>
                            setDraftField(field.key, e.target.value)
                          }
                        />
                      ) : (
                        <Input
                          type={field.type === "number" ? "number" : "text"}
                          value={draft.fields[field.key] ?? ""}
                          placeholder={field.placeholder}
                          onChange={(e) =>
                            setDraftField(field.key, e.target.value)
                          }
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {draft.category === "vasita" && (
                <AddressMap
                  compact
                  address={draft.fields.adres ?? ""}
                  city={draft.city}
                  district={draft.district}
                />
              )}
              {draft.category === "bakici-arayanlar" && (
                <IdentityDocsFields
                  idPrefix="ilan-yeni"
                  idFront={idFrontFile}
                  idBack={idBackFile}
                  passport={passportFile}
                  onIdFront={setIdFrontFile}
                  onIdBack={setIdBackFile}
                  onPassport={setPassportFile}
                />
              )}
            </div>
          )}

          <div className="hb-surface space-y-4 p-5">
            <PhotoUploadFields
              idPrefix="ilan-yeni-photo"
              category={draft.category}
              slotCount={photoSlotCount}
              files={photoFiles}
              onChange={(index, file) => {
                setPhotoFiles((prev) => {
                  const next = resizePhotoFiles(prev, photoSlotCount);
                  next[index] = file;
                  return next;
                });
              }}
            />
          </div>

          <div className="hb-surface grid gap-4 p-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="cname">Ad / Firma *</Label>
              <Input
                id="cname"
                className="mt-1.5"
                value={draft.contactName}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, contactName: e.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="cphone">Telefon *</Label>
              <Input
                id="cphone"
                className="mt-1.5"
                value={draft.contactPhone}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, contactPhone: e.target.value }))
                }
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
              className="bg-[var(--lagoon)] hover:bg-[#be185d]"
              onClick={goToPreview}
            >
              Önizlemeye geç
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {step === "onizleme" && draft.category && (
        <div className="mt-8 space-y-6" data-hb-step="onizleme">
          <div className="hb-surface overflow-hidden">
            <PhotoPlaceholder
              category={draft.category as CategorySlug}
              title={draft.title}
              large
              className="aspect-[16/9] w-full"
              src={photoObjectUrls.find(isRenderablePhoto)}
            />
            {photoObjectUrls.some(isRenderablePhoto) && (
              <div className="grid grid-cols-5 gap-2 border-t border-[color-mix(in_oklab,var(--lagoon)_12%,transparent)] bg-white/60 p-3">
                {photoObjectUrls.map((src, i) =>
                  isRenderablePhoto(src) ? (
                    <PhotoPlaceholder
                      key={`preview-thumb-${i}`}
                      category={draft.category as CategorySlug}
                      src={src}
                      className="aspect-video rounded-lg"
                    />
                  ) : (
                    <div
                      key={`preview-empty-${i}`}
                      className="aspect-video rounded-lg border border-dashed border-[color-mix(in_oklab,var(--lagoon)_22%,transparent)] bg-[var(--mist)]/50"
                    />
                  ),
                )}
              </div>
            )}
            <div className="space-y-3 p-5">
              <div className="flex flex-wrap items-center gap-2">
                {previewListing && <SellerBadge listing={previewListing} />}
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
              {draft.category === "vasita" && draft.fields.renk && (
                <p className="text-sm text-[var(--ink)]">
                  Renk: <span className="font-medium">{draft.fields.renk}</span>
                </p>
              )}
              <p className="text-sm">
                İletişim: {draft.contactName} · {draft.contactPhone}
              </p>
              {draft.category === "vasita" && draft.fields.adres && (
                <AddressMap
                  compact
                  address={draft.fields.adres}
                  city={draft.city}
                  district={draft.district}
                />
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" onClick={() => setStep("form")}>
              <ArrowLeft className="size-4" />
              Düzenle
            </Button>
            <Button
              type="button"
              className="bg-[var(--lagoon)] hover:bg-[#be185d]"
              onClick={publish}
              disabled={success}
            >
              Kaydet ve yayınla
              <Check className="size-4" />
            </Button>
          </div>
          <p className="text-xs text-[var(--muted-foreground)]">
            {freeListingCopy.publishHint}
          </p>
        </div>
      )}

      {step === "yayin" && (
        <div className="mt-12 text-center">
          {rejectNotice ? (
            <>
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-red-600 text-white">
                <X className="size-7" />
              </div>
              <p
                className="mt-4 text-center text-base font-semibold text-red-700"
                role="status"
              >
                {rejectNotice}
              </p>
              <p className="mt-2 text-[var(--muted-foreground)]">
                Size e-posta ile de bildirildi. Uygun görsellerle düzenleyip tekrar
                deneyebilirsiniz.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setRejectNotice(null);
                    setStep("form");
                  }}
                >
                  Görselleri düzenle
                </Button>
                <Button asChild variant="outline">
                  <Link href="/hesabim">Hesabıma git</Link>
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-green-600 text-white">
                <Check className="size-7" />
              </div>
              <p
                className="mt-4 text-center text-base font-semibold text-green-600"
                role="status"
              >
                İlanınız Kontrol edildikten sonra yayınlanacaktır
              </p>
              <p className="mt-2 text-[var(--muted-foreground)]">
                {freeListingCopy.detail} Detay sayfasına yönlendiriliyorsunuz…
              </p>
              <Button asChild variant="outline" className="mt-6">
                <Link href="/hesabim">Hesabıma git</Link>
              </Button>
            </>
          )}
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
