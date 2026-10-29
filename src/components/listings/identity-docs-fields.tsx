"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DOC_ACCEPTED, IDENTITY_DOCS_HINT } from "@/lib/application-file";
import { Upload } from "lucide-react";

function FileSlot({
  id,
  label,
  file,
  existingName,
  onChange,
}: {
  id: string;
  label: string;
  file: File | null;
  existingName?: string;
  onChange: (file: File | null) => void;
}) {
  const shown = file?.name ?? existingName;
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <label
        htmlFor={id}
        className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-[color-mix(in_oklab,var(--lagoon)_28%,transparent)] bg-white/70 px-4 py-5 text-center transition hover:bg-[var(--mist)]"
      >
        <Upload className="size-5 text-[var(--lagoon)]" />
        <span className="text-sm font-medium text-[var(--ink)]">
          {shown ? shown : `${label} yükle`}
        </span>
        <span className="text-xs text-[var(--muted-foreground)]">
          JPEG, PNG, WEBP veya PDF · en fazla 2.5 MB
        </span>
        <Input
          id={id}
          type="file"
          accept={DOC_ACCEPTED}
          className="sr-only"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
      </label>
    </div>
  );
}

export function IdentityDocsFields({
  idPrefix = "identity",
  idFront,
  idBack,
  passport,
  existing,
  onIdFront,
  onIdBack,
  onPassport,
}: {
  idPrefix?: string;
  idFront: File | null;
  idBack: File | null;
  passport: File | null;
  existing?: {
    idFrontName?: string;
    idBackName?: string;
    passportName?: string;
  };
  onIdFront: (file: File | null) => void;
  onIdBack: (file: File | null) => void;
  onPassport: (file: File | null) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-[var(--ink)]">
          Kimlik Ön / Arka veya Pasaport *
        </p>
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
          {IDENTITY_DOCS_HINT}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <FileSlot
          id={`${idPrefix}-front`}
          label="Kimlik ön"
          file={idFront}
          existingName={existing?.idFrontName}
          onChange={onIdFront}
        />
        <FileSlot
          id={`${idPrefix}-back`}
          label="Kimlik arka"
          file={idBack}
          existingName={existing?.idBackName}
          onChange={onIdBack}
        />
        <FileSlot
          id={`${idPrefix}-passport`}
          label="Pasaport"
          file={passport}
          existingName={existing?.passportName}
          onChange={onPassport}
        />
      </div>
    </div>
  );
}
