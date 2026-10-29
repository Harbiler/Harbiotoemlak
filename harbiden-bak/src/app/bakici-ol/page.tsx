"use client";

import { useState } from "react";
import Link from "next/link";
import { addCaregiverApplication } from "@/lib/storage";
import type { ApplicationFile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, HeartHandshake, Upload } from "lucide-react";

const MAX_FILE_BYTES = 2.5 * 1024 * 1024;
const DOC_ACCEPTED = "image/jpeg,image/png,image/webp,application/pdf";
const PHOTO_ACCEPTED = "image/jpeg,image/png,image/webp";

async function readFileAsAppFile(
  file: File,
  opts?: { imagesOnly?: boolean },
): Promise<ApplicationFile> {
  if (file.size > MAX_FILE_BYTES) {
    throw new Error(`"${file.name}" 2.5 MB sınırını aşıyor.`);
  }
  const allowed = (opts?.imagesOnly ? PHOTO_ACCEPTED : DOC_ACCEPTED).split(",");
  if (!allowed.includes(file.type)) {
    throw new Error(
      opts?.imagesOnly
        ? `"${file.name}" için JPEG, PNG veya WEBP yükleyin.`
        : `"${file.name}" için JPEG, PNG, WEBP veya PDF yükleyin.`,
    );
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

function FileUploadField({
  id,
  label,
  hint,
  file,
  accept,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  file: File | null;
  accept: string;
  onChange: (file: File | null) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <label
        htmlFor={id}
        className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-[color-mix(in_oklab,var(--lagoon)_28%,transparent)] bg-white/70 px-4 py-6 text-center transition hover:bg-[var(--mist)]"
      >
        <Upload className="size-5 text-[var(--lagoon)]" />
        <span className="text-sm font-medium text-[var(--ink)]">
          {file ? file.name : `${label} yükle`}
        </span>
        <span className="text-xs text-[var(--muted-foreground)]">{hint}</span>
        <Input
          id={id}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
          required
        />
      </label>
    </div>
  );
}

export default function CaregiverApplyPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [residenceFile, setResidenceFile] = useState<File | null>(null);
  const [criminalFile, setCriminalFile] = useState<File | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
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
    if (!residenceFile || !criminalFile || !profileFile) {
      setError("İkametgâh, sabıka kaydı ve profil resmi yüklenmelidir.");
      return;
    }

    setSaving(true);
    try {
      const [residenceDocument, criminalRecordDocument, profilePhoto] =
        await Promise.all([
          readFileAsAppFile(residenceFile),
          readFileAsAppFile(criminalFile),
          readFileAsAppFile(profileFile, { imagesOnly: true }),
        ]);
      addCaregiverApplication({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        residenceDocument,
        criminalRecordDocument,
        profilePhoto,
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
          İkametgâh, sabıka kaydı ve profil fotoğrafınızla başvurun. Başvurular
          otomatik onaylanır.
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

        <FileUploadField
          id="residenceDocument"
          label="İkametgah"
          hint="JPEG, PNG, WEBP veya PDF · en fazla 2.5 MB"
          file={residenceFile}
          accept={DOC_ACCEPTED}
          onChange={setResidenceFile}
        />

        <FileUploadField
          id="criminalRecord"
          label="Sabıka kaydı"
          hint="JPEG, PNG, WEBP veya PDF · en fazla 2.5 MB"
          file={criminalFile}
          accept={DOC_ACCEPTED}
          onChange={setCriminalFile}
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
