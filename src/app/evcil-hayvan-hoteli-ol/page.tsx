"use client";

import { useState } from "react";
import Link from "next/link";
import { addPetHotelApplication } from "@/lib/storage";
import type { PetHotelApplicationFile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Hotel, Upload } from "lucide-react";

const MAX_FILE_BYTES = 2.5 * 1024 * 1024;
const ACCEPTED = "image/jpeg,image/png,image/webp,application/pdf";

async function readFileAsAppFile(file: File): Promise<PetHotelApplicationFile> {
  if (file.size > MAX_FILE_BYTES) {
    throw new Error(`"${file.name}" 2.5 MB sınırını aşıyor.`);
  }
  const allowed = ACCEPTED.split(",");
  if (!allowed.includes(file.type)) {
    throw new Error(`"${file.name}" için JPEG, PNG, WEBP veya PDF yükleyin.`);
  }
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Dosya okunamadı."));
    reader.readAsDataURL(file);
  });
  return {
    name: file.name,
    type: file.type,
    size: file.size,
    dataUrl,
  };
}

export default function PetHotelApplyPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [idFile, setIdFile] = useState<File | null>(null);
  const [residenceFile, setResidenceFile] = useState<File | null>(null);
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
    if (!idFile || !residenceFile) {
      setError("Kimlik fotokopisi ve ikametgâh belgesi yüklenmelidir.");
      return;
    }

    setSaving(true);
    try {
      const [idDocument, residenceDocument] = await Promise.all([
        readFileAsAppFile(idFile),
        readFileAsAppFile(residenceFile),
      ]);
      addPetHotelApplication({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        idDocument,
        residenceDocument,
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
            <Hotel className="size-7" />
          </div>
          <h1 className="hb-display text-2xl font-bold text-[var(--ink)]">
            Başvurunuz alındı
          </h1>
          <p className="text-[var(--muted-foreground)]">
            Evcil hayvan hoteli başvurunuz incelenecek. Belgeleriniz ve iletişim
            bilgileriniz kaydedildi.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button asChild className="bg-[var(--lagoon)] hover:bg-[#be185d]">
              <Link href="/kategori/evcil-hayvan-otelleri">Kategoriye dön</Link>
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
        href="/kategori/evcil-hayvan-otelleri"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] transition hover:text-[var(--lagoon)]"
      >
        <ArrowLeft className="size-4" />
        Evcil Hayvan Otelleri
      </Link>

      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--lagoon)]">
          Partner başvurusu
        </p>
        <h1 className="hb-display mt-1 text-3xl font-bold text-[var(--ink)]">
          Evcil Hayvan Hoteli Ol
        </h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          Tesisinizi Harbiden Bak&apos;ta yayınlamak için kimlik ve ikametgâh
          belgelerinizle başvurun.
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
          <Label htmlFor="idDocument">Kimlik fotokopisi</Label>
          <label
            htmlFor="idDocument"
            className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-[color-mix(in_oklab,var(--lagoon)_28%,transparent)] bg-white/70 px-4 py-6 text-center transition hover:bg-[var(--mist)]"
          >
            <Upload className="size-5 text-[var(--lagoon)]" />
            <span className="text-sm font-medium text-[var(--ink)]">
              {idFile ? idFile.name : "Kimlik fotokopisi yükle"}
            </span>
            <span className="text-xs text-[var(--muted-foreground)]">
              JPEG, PNG, WEBP veya PDF · en fazla 2.5 MB
            </span>
            <Input
              id="idDocument"
              type="file"
              accept={ACCEPTED}
              className="sr-only"
              onChange={(e) => setIdFile(e.target.files?.[0] ?? null)}
              required
            />
          </label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="residenceDocument">İkametgah</Label>
          <label
            htmlFor="residenceDocument"
            className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-[color-mix(in_oklab,var(--lagoon)_28%,transparent)] bg-white/70 px-4 py-6 text-center transition hover:bg-[var(--mist)]"
          >
            <Upload className="size-5 text-[var(--lagoon)]" />
            <span className="text-sm font-medium text-[var(--ink)]">
              {residenceFile ? residenceFile.name : "İkametgâh belgesi yükle"}
            </span>
            <span className="text-xs text-[var(--muted-foreground)]">
              JPEG, PNG, WEBP veya PDF · en fazla 2.5 MB
            </span>
            <Input
              id="residenceDocument"
              type="file"
              accept={ACCEPTED}
              className="sr-only"
              onChange={(e) => setResidenceFile(e.target.files?.[0] ?? null)}
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
