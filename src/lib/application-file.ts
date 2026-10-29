import type { ApplicationFile } from "@/lib/types";

export const MAX_APPLICATION_FILE_BYTES = 2.5 * 1024 * 1024;
export const DOC_ACCEPTED =
  "image/jpeg,image/png,image/webp,application/pdf";
export const PHOTO_ACCEPTED = "image/jpeg,image/png,image/webp";

export async function readFileAsAppFile(
  file: File,
  opts?: { imagesOnly?: boolean },
): Promise<ApplicationFile> {
  if (file.size > MAX_APPLICATION_FILE_BYTES) {
    throw new Error(`"${file.name}" 2.5 MB sınırını aşıyor.`);
  }
  const allowed = (opts?.imagesOnly ? PHOTO_ACCEPTED : DOC_ACCEPTED).split(
    ",",
  );
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

export type IdentityDocsInput = {
  idFront?: ApplicationFile | File | null;
  idBack?: ApplicationFile | File | null;
  passport?: ApplicationFile | File | null;
};

/** Kimlik ön+arka birlikte veya pasaport yeterli. */
export function hasRequiredIdentityDocs(docs: IdentityDocsInput): boolean {
  if (docs.passport) return true;
  return Boolean(docs.idFront && docs.idBack);
}

export const IDENTITY_DOCS_HINT =
  "Kimlik ön ve arka birlikte, veya pasaport yükleyin. JPEG, PNG, WEBP veya PDF · en fazla 2.5 MB";

export const IDENTITY_DOCS_ERROR =
  "Kimlik ön ve arka birlikte, veya pasaport yüklenmelidir.";
