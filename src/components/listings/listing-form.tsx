"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { NAV_CATEGORIES, getCategory, type CategoryField } from "@/lib/categories";
import { CITY_NAMES, CITIES } from "@/lib/cities";
import { useAuth } from "@/context/auth-context";
import { useListings } from "@/context/listings-context";
import type {
  CategorySlug,
  Listing,
  ListingIdentityDocs,
  ListingStatus,
  MembershipKind,
} from "@/lib/types";
import { formatDateShort } from "@/lib/format";
import {
  freeListingCopy,
  freeListingValidUntil,
} from "@/lib/listing-validity";
import {
  hasRequiredIdentityDocs,
  IDENTITY_DOCS_ERROR,
  readFileAsAppFile,
} from "@/lib/application-file";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BrandModelFields } from "@/components/listings/brand-model-fields";
import { IdentityDocsFields } from "@/components/listings/identity-docs-fields";
import { supportsBrandModelSearch } from "@/lib/brand-models";
import {
  getVasitaSubcategory,
  VASITA_SUBCATEGORIES,
} from "@/lib/vasita-subcategories";

interface FormState {
  category: CategorySlug;
  title: string;
  description: string;
  price: string;
  city: string;
  district: string;
  contactName: string;
  contactPhone: string;
  fields: Record<string, string>;
  status: ListingStatus;
}

function buildInitial(listing?: Listing, defaultCategory?: CategorySlug, userName?: string, userPhone?: string): FormState {
  if (listing) {
    const fields: Record<string, string> = {};
    Object.entries(listing.fields).forEach(([k, v]) => {
      fields[k] = String(v);
    });
    return {
      category: listing.category,
      title: listing.title,
      description: listing.description,
      price: listing.price ? String(listing.price) : "",
      city: listing.city,
      district: listing.district,
      contactName: listing.contactName,
      contactPhone: listing.contactPhone,
      fields,
      status: listing.status,
    };
  }
  return {
    category: defaultCategory ?? "emlak",
    title: "",
    description: "",
    price: "",
    city: "İstanbul",
    district: "Kadıköy",
    contactName: userName ?? "",
    contactPhone: userPhone ?? "",
    fields: {},
    status: "approved",
  };
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: CategoryField;
  value: string;
  onChange: (v: string) => void;
}) {
  if (field.type === "select" && field.options) {
    const items = Object.fromEntries(field.options.map((o) => [o, o]));
    return (
      <Select
        value={value || undefined}
        onValueChange={(v) => onChange(v ?? "")}
        items={items}
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
    );
  }
  if (field.type === "textarea") {
    return (
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        rows={3}
      />
    );
  }
  return (
    <Input
      type={field.type === "number" ? "number" : "text"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
    />
  );
}

export function ListingForm({
  listing,
  defaultCategory,
  adminMode,
}: {
  listing?: Listing;
  defaultCategory?: CategorySlug;
  adminMode?: boolean;
}) {
  const { user } = useAuth();
  const { createListing, updateListing } = useListings();
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() =>
    buildInitial(listing, defaultCategory, user?.companyName || user?.name, user?.phone),
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [idFrontFile, setIdFrontFile] = useState<File | null>(null);
  const [idBackFile, setIdBackFile] = useState<File | null>(null);
  const [passportFile, setPassportFile] = useState<File | null>(null);

  const category = getCategory(form.category);
  const districts = CITIES[form.city] ?? [];
  const needsIdentityDocs = form.category === "bakici-arayanlar";

  const categoryFields = useMemo(() => category?.fields ?? [], [category]);

  function setField(key: string, value: string) {
    setForm((f) => ({ ...f, fields: { ...f.fields, [key]: value } }));
  }

  function validate(): string | null {
    if (!form.title.trim()) return "Başlık zorunludur.";
    if (!form.description.trim() || form.description.trim().length < 20) {
      return "Açıklama en az 20 karakter olmalıdır.";
    }
    if (!form.city || !form.district) return "İl ve ilçe seçin.";
    if (!form.contactName.trim() || !form.contactPhone.trim()) {
      return "İletişim adı ve telefon zorunludur.";
    }
    if (form.category === "vasita" && !form.fields.altKategori) {
      return "Vasıta alt kategorisi seçin.";
    }
    for (const field of categoryFields) {
      if (field.required && !form.fields[field.key]?.toString().trim()) {
        return `${field.label} alanı zorunludur.`;
      }
    }
    if (needsIdentityDocs) {
      const existing = listing?.identityDocs;
      const ok = hasRequiredIdentityDocs({
        idFront: idFrontFile ?? existing?.idFront,
        idBack: idBackFile ?? existing?.idBack,
        passport: passportFile ?? existing?.passport,
      });
      if (!ok) return IDENTITY_DOCS_ERROR;
    }
    return null;
  }

  async function resolveIdentityDocs(): Promise<
    ListingIdentityDocs | undefined
  > {
    if (!needsIdentityDocs) return undefined;
    const existing = listing?.identityDocs;
    const [idFront, idBack, passport] = await Promise.all([
      idFrontFile
        ? readFileAsAppFile(idFrontFile)
        : Promise.resolve(existing?.idFront),
      idBackFile
        ? readFileAsAppFile(idBackFile)
        : Promise.resolve(existing?.idBack),
      passportFile
        ? readFileAsAppFile(passportFile)
        : Promise.resolve(existing?.passport),
    ]);
    const docs: ListingIdentityDocs = {};
    if (idFront) docs.idFront = idFront;
    if (idBack) docs.idBack = idBack;
    if (passport) docs.passport = passport;
    return docs;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      router.push("/giris?next=/ilan/yeni");
      return;
    }
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setSaving(true);
    setError(null);

    try {
      const parsedFields: Record<string, string | number | boolean> = {};
      for (const field of categoryFields) {
        const raw = form.fields[field.key];
        if (raw === undefined || raw === "") continue;
        parsedFields[field.key] = field.type === "number" ? Number(raw) : raw;
      }
      if (form.category === "vasita" && form.fields.altKategori) {
        parsedFields.altKategori = form.fields.altKategori;
      }

      const sellerType: MembershipKind = user.membershipKind;
      const status: ListingStatus = adminMode
        ? form.status
        : listing
          ? listing.status
          : "approved";

      const nextStatus: ListingStatus = adminMode
        ? status
        : listing
          ? listing.status
          : "approved";
      const nowIso = new Date().toISOString();
      const validUntil =
        !listing
          ? freeListingValidUntil(nowIso)
          : nextStatus === "approved" && listing.status !== "approved"
            ? freeListingValidUntil(nowIso)
            : listing.validUntil || freeListingValidUntil(listing.createdAt);

      const identityDocs = await resolveIdentityDocs();

      const payload = {
        category: form.category,
        title: form.title.trim(),
        description: form.description.trim(),
        price: form.price ? Number(form.price) : 0,
        city: form.city,
        district: form.district,
        photos: listing?.photos ?? [`${form.category}-new`],
        contactName: form.contactName.trim(),
        contactPhone: form.contactPhone.trim(),
        sellerType,
        sellerKurumsalType: listing?.sellerKurumsalType ?? user.kurumsalType,
        sellerId: listing?.sellerId ?? user.id,
        status: nextStatus,
        featured: listing?.featured,
        validUntil,
        fields: parsedFields,
        ...(identityDocs ? { identityDocs } : {}),
      };

      if (listing) {
        updateListing(listing.id, payload);
        router.push(adminMode ? "/admin" : `/ilan/${listing.id}`);
      } else {
        const created = createListing(payload);
        router.push(`/ilan/${created.id}`);
      }
    } catch (submitErr) {
      setError(
        submitErr instanceof Error ? submitErr.message : "İlan kaydedilemedi.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4 rounded-xl border border-pink-500/20 bg-[color-mix(in_oklab,#fff7fa_90%,#fce7f0)] p-5">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--ink)]">
          Temel bilgiler
        </h2>
        <div>
          <Label>Kategori</Label>
          <Select
            value={form.category}
            onValueChange={(v) => {
              const next = (v as CategorySlug) ?? form.category;
              setForm((f) => ({
                ...f,
                category: next,
                fields: {},
              }));
              if (next !== "bakici-arayanlar") {
                setIdFrontFile(null);
                setIdBackFile(null);
                setPassportFile(null);
              }
            }}
            disabled={!!listing && !adminMode}
            items={Object.fromEntries(NAV_CATEGORIES.map((c) => [c.slug, c.name]))}
          >
            <SelectTrigger className="mt-1.5 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-[200]">
              {NAV_CATEGORIES.map((c) => (
                <SelectItem key={c.slug} value={c.slug}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="title">Başlık</Label>
          <Input
            id="title"
            className="mt-1.5"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Kısa ve net bir başlık yazın"
          />
        </div>
        <div>
          <Label htmlFor="desc">Açıklama</Label>
          <Textarea
            id="desc"
            className="mt-1.5"
            rows={5}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="İlanınızı detaylı anlatın…"
          />
        </div>
        <div>
          <Label htmlFor="price">Fiyat (₺)</Label>
          <Input
            id="price"
            type="number"
            className="mt-1.5"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="0 = fiyat sorulur"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>İl</Label>
            <Select
              value={form.city}
              onValueChange={(city) => {
                const c = city ?? form.city;
                const first = CITIES[c]?.[0] ?? "";
                setForm({ ...form, city: c, district: first });
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
              value={form.district}
              onValueChange={(district) =>
                setForm({ ...form, district: district ?? form.district })
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

      {categoryFields.length > 0 && (
        <div className="space-y-4 rounded-xl border border-pink-500/20 bg-[color-mix(in_oklab,#fff7fa_90%,#fce7f0)] p-5">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--ink)]">
            {category?.name} detayları
          </h2>
          {form.category === "vasita" && (
            <div>
              <Label>Vasıta alt kategori *</Label>
              <Select
                value={form.fields.altKategori || undefined}
                onValueChange={(v) => {
                  setForm((f) => ({
                    ...f,
                    fields: {
                      ...f.fields,
                      altKategori: v ?? "",
                      marka: "",
                      model: "",
                    },
                  }));
                }}
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
          {supportsBrandModelSearch(form.category) && (
            <BrandModelFields
              category={form.category}
              catalog={
                form.category === "vasita" && form.fields.altKategori
                  ? getVasitaSubcategory(form.fields.altKategori)?.brands
                  : undefined
              }
              marka={form.fields.marka ?? ""}
              model={form.fields.model ?? ""}
              onMarkaChange={(v) => setField("marka", v)}
              onModelChange={(v) => setField("model", v)}
              markaLabel={form.category === "yedek-parca" ? "Uyumlu Marka" : "Marka"}
              modelLabel={form.category === "yedek-parca" ? "Uyumlu Model" : "Model"}
              required
            />
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            {categoryFields
              .filter((field) => {
                if (!supportsBrandModelSearch(form.category)) return true;
                return field.key !== "marka" && field.key !== "model";
              })
              .map((field) => (
              <div key={field.key} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                <Label>
                  {field.label}
                  {field.required ? " *" : ""}
                </Label>
                <div className="mt-1.5">
                  <FieldInput
                    field={field}
                    value={form.fields[field.key] ?? ""}
                    onChange={(v) => setField(field.key, v)}
                  />
                </div>
              </div>
            ))}
          </div>
          {needsIdentityDocs && (
            <IdentityDocsFields
              idPrefix="listing-form"
              idFront={idFrontFile}
              idBack={idBackFile}
              passport={passportFile}
              existing={{
                idFrontName: listing?.identityDocs?.idFront?.name,
                idBackName: listing?.identityDocs?.idBack?.name,
                passportName: listing?.identityDocs?.passport?.name,
              }}
              onIdFront={setIdFrontFile}
              onIdBack={setIdBackFile}
              onPassport={setPassportFile}
            />
          )}
        </div>
      )}

      <div className="space-y-4 rounded-xl border border-pink-500/20 bg-[color-mix(in_oklab,#fff7fa_90%,#fce7f0)] p-5">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--ink)]">
          İletişim
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="cname">Ad / Firma</Label>
            <Input
              id="cname"
              className="mt-1.5"
              value={form.contactName}
              onChange={(e) => setForm({ ...form, contactName: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="cphone">Telefon</Label>
            <Input
              id="cphone"
              className="mt-1.5"
              value={form.contactPhone}
              onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
            />
          </div>
        </div>
        {user && (
          <p className="text-xs text-stone-500">
            Satıcı tipi:{" "}
            <strong>{user.membershipKind === "kurumsal" ? "Kurumsal" : "Bireysel"}</strong>
            {user.kurumsalType === "galeri" && " · Galeri"}
            {user.kurumsalType === "emlak" && " · Emlak ofisi"}
          </p>
        )}
        {(adminMode || user?.role === "admin") && (
          <div>
            <Label>Durum</Label>
            <Select
              value={form.status}
              onValueChange={(status) =>
                setForm({ ...form, status: (status as ListingStatus) ?? form.status })
              }
              items={{
                pending: "Onay bekliyor",
                approved: "Yayında",
                hidden: "Gizli",
              }}
            >
              <SelectTrigger className="mt-1.5 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[200]">
                <SelectItem value="pending">Onay bekliyor</SelectItem>
                <SelectItem value="approved">Yayında</SelectItem>
                <SelectItem value="hidden">Gizli</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-pink-500/20 bg-[color-mix(in_oklab,#fff7fa_90%,#fce7f0)] p-4 text-sm text-[var(--ink)]">
        <p className="font-medium">{freeListingCopy.badge}</p>
        <p className="mt-1 text-xs text-stone-600">{freeListingCopy.detail}</p>
        {listing?.validUntil && (
          <p className="mt-1 text-xs text-stone-500">
            Geçerli süre: {formatDateShort(listing.validUntil)} tarihine kadar
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={saving} className="bg-[var(--lagoon)] hover:bg-[#be185d]">
          {listing ? "Kaydet" : "Ücretsiz yayınla"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Vazgeç
        </Button>
      </div>
      {!listing && (
        <p className="text-xs text-stone-500">{freeListingCopy.publishHint}</p>
      )}
    </form>
  );
}
