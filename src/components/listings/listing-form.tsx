"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, getCategory, type CategoryField } from "@/lib/categories";
import { CITY_NAMES, CITIES } from "@/lib/cities";
import { useAuth } from "@/context/auth-context";
import { useListings } from "@/context/listings-context";
import type { CategorySlug, Listing, ListingStatus, MembershipKind } from "@/lib/types";
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
import { supportsBrandModelSearch } from "@/lib/brand-models";

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
    status: "pending",
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
    return (
      <Select value={value || undefined} onValueChange={(v) => onChange(v ?? "")}>
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

  const category = getCategory(form.category);
  const districts = CITIES[form.city] ?? [];

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
    for (const field of categoryFields) {
      if (field.required && !form.fields[field.key]?.toString().trim()) {
        return `${field.label} alanı zorunludur.`;
      }
    }
    return null;
  }

  function onSubmit(e: React.FormEvent) {
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

    const parsedFields: Record<string, string | number | boolean> = {};
    for (const field of categoryFields) {
      const raw = form.fields[field.key];
      if (raw === undefined || raw === "") continue;
      parsedFields[field.key] = field.type === "number" ? Number(raw) : raw;
    }

    const sellerType: MembershipKind = user.membershipKind;
    const status: ListingStatus = adminMode
      ? form.status
      : listing
        ? listing.status
        : "pending";

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
      status: adminMode || user.role === "admin" ? status : "pending",
      featured: listing?.featured,
      fields: parsedFields,
    };

    if (listing) {
      updateListing(listing.id, payload);
      router.push(adminMode ? "/admin" : `/ilan/${listing.id}`);
    } else {
      const created = createListing(payload);
      router.push(
        user.role === "admin" || adminMode
          ? `/ilan/${created.id}`
          : `/ilan/${created.id}?pending=1`,
      );
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
            onValueChange={(v) =>
              setForm((f) => ({
                ...f,
                category: (v as CategorySlug) ?? f.category,
                fields: {},
              }))
            }
            disabled={!!listing && !adminMode}
          >
            <SelectTrigger className="mt-1.5 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
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
              value={form.district}
              onValueChange={(district) =>
                setForm({ ...form, district: district ?? form.district })
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

      {categoryFields.length > 0 && (
        <div className="space-y-4 rounded-xl border border-pink-500/20 bg-[color-mix(in_oklab,#fff7fa_90%,#fce7f0)] p-5">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--ink)]">
            {category?.name} detayları
          </h2>
          {supportsBrandModelSearch(form.category) && (
            <BrandModelFields
              category={form.category}
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
            >
              <SelectTrigger className="mt-1.5 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Onay bekliyor</SelectItem>
                <SelectItem value="approved">Yayında</SelectItem>
                <SelectItem value="hidden">Gizli</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={saving} className="bg-[var(--lagoon)] hover:bg-[#be185d]">
          {listing ? "Kaydet" : "İlanı yayınla"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Vazgeç
        </Button>
      </div>
      {!listing && user?.role !== "admin" && (
        <p className="text-xs text-stone-500">
          Yeni ilanlar admin onayından sonra yayına alınır. Demo admin hesabıyla anında onaylayabilirsiniz.
        </p>
      )}
    </form>
  );
}
