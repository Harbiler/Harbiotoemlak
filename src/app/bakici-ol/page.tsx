"use client";

import { useState } from "react";
import Link from "next/link";
import { IdentityDocsFields } from "@/components/listings/identity-docs-fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  PHOTO_ACCEPTED,
  hasRequiredIdentityDocs,
  IDENTITY_DOCS_ERROR,
  readFileAsAppFile,
} from "@/lib/application-file";
import { addCaregiverApplication } from "@/lib/storage";
import { ArrowLeft, HeartHandshake, Upload } from "lucide-react";

export default function CaregiverApplyPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [vatandaslik, setVatandaslik] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [idFrontFile, setIdFrontFile] = useState<File | null>(null);
  const [idBackFile, setIdBackFile] = useState<File | null>(null);
  const [passportFile, setPassportFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setError("İsim soyisim, e-posta ve telefon zorunludur.");
      return;
    }
    if (!vatandaslik.trim()) {
      setError("Vatandaşlık / ülke zorunludur.");
      return;
    }
    if (!city.trim()) {
      setError("Yaşadığınız şehir zorunludur.");
      return;
    }
    if (!address.trim()) {
      setError("Adres bilgisi zorunludur.");
      return;
    }
    if (!profileFile) {
      setError("Profil resmi yüklenmelidir.");
      return;
    }
    if (
      !hasRequiredIdentityDocs({
        idFront: idFrontFile,
        idBack: idBackFile,
        passport: passportFile,
      })
    ) {
      setError(IDENTITY_DOCS_ERROR);
      return;
    }

    setSaving(true);
    try {
      const [profilePhoto, idFront, idBack, passport] = await Promise.all([
        readFileAsAppFile(profileFile, { imagesOnly: true }),
        idFrontFile ? readFileAsAppFile(idFrontFile) : Promise.resolve(undefined),
        idBackFile ? readFileAsAppFile(idBackFile) : Promise.resolve(undefined),
        passportFile ? readFileAsAppFile(passportFile) : Promise.resolve(undefined),
      ]);
      addCaregiverApplication({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        vatandaslik: vatandaslik.trim(),
        city: city.trim(),
        address: address.trim(),
        profilePhoto,
        ...(idFront ? { idFront } : {}),
        ...(idBack ? { idBack } : {}),
        ...(passport ? { passport } : {}),
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Başvuru kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <div className="hb-surface space-y-4 p-8 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[var(--lagoon)] text-white">
            <HeartHandshake className="size-7" />
          </div>
          <h1 className="hb-display text-2xl font-bold text-[var(--ink)]">
            Başvurunuz onaylandı
          </h1>
          <p className="text-[var(--muted-foreground)]">
            Bakıcı başvurunuz otomatik olarak onaylandı. Belgeleriniz ve iletişim
            bilgileriniz kaydedildi.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button asChild className="bg-[var(--lagoon)] hover:bg-[#be185d]">
              <Link href="/kategori/bakici-arayanlar">Kategoriye dön</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Ana sayfa</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <Link
        href="/kategori/bakici-arayanlar"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] transition hover:text-[var(--lagoon)]"
      >
        <ArrowLeft className="size-4" />
        Bakıcı Arayanlar
      </Link>

      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--lagoon)]">
          Bakıcı başvurusu
        </p>
        <h1 className="hb-display mt-1 text-3xl font-bold text-[var(--ink)]">
          Bakıcı Olmak İstiyorum
        </h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          Vatandaşlık, kimlik veya pasaport, yaşadığınız şehir, adres
          bilgisi ve profil fotoğrafınızla başvurun. Başvurular otomatik
          onaylanır.
        </p>
      </div>

      <form onSubmit={onSubmit} className="hb-surface space-y-5 p-6 sm:p-8">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="fullName">İsim Soyisim</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Adınız ve soyadınız"
            required
            className="h-10 bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Mail Adres</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@eposta.com"
            required
            className="h-10 bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefon</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="05xx xxx xx xx"
            required
            className="h-10 bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vatandaslik">Vatandaşlık / Ülke</Label>
          <Input
            id="vatandaslik"
            value={vatandaslik}
            onChange={(e) => setVatandaslik(e.target.value)}
            placeholder="Türkmenistanlı"
            required
            className="h-10 bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Şehir</Label>
          <Input
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Örn. İstanbul"
            required
            className="h-10 bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Adres Bilgisi</Label>
          <Textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Açık adres (ilçe, mahalle, sokak, no)"
            required
            rows={3}
            className="bg-white"
          />
        </div>

        <IdentityDocsFields
          idPrefix="bakici"
          idFront={idFrontFile}
          idBack={idBackFile}
          passport={passportFile}
          onIdFront={setIdFrontFile}
          onIdBack={setIdBackFile}
          onPassport={setPassportFile}
        />

        <div className="space-y-2">
          <Label htmlFor="profilePhoto">Profil Resmi</Label>
          <p className="text-xs text-[var(--muted-foreground)]">
            Yüzünüz net görünsün. Profil resminde güneş gözlüğü olmasın.
          </p>
          <label
            htmlFor="profilePhoto"
            className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-[color-mix(in_oklab,var(--lagoon)_28%,transparent)] bg-white/70 px-4 py-6 text-center transition hover:bg-[var(--mist)]"
          >
            <Upload className="size-5 text-[var(--lagoon)]" />
            <span className="text-sm font-medium text-[var(--ink)]">
              {profileFile ? profileFile.name : "Profil resmi yükle"}
            </span>
            <span className="text-xs text-[var(--muted-foreground)]">
              JPEG, PNG veya WEBP · en fazla 2.5 MB · güneş gözlüğü yok
            </span>
            <Input
              id="profilePhoto"
              type="file"
              accept={PHOTO_ACCEPTED}
              className="sr-only"
              onChange={(e) => setProfileFile(e.target.files?.[0] ?? null)}
              required
            />
          </label>
        </div>

        <Button
          type="submit"
          disabled={saving}
          className="h-11 w-full bg-[var(--lagoon)] hover:bg-[#be185d]"
        >
          {saving ? "Gönderiliyor…" : "Başvuruyu gönder"}
        </Button>
      </form>
    </div>
  );
}
