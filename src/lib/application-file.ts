import type { ApplicationFile } from "@/lib/types";
import { putMediaBlob } from "@/lib/media-store";

/** Site-wide upload cap for listing photos, admin images, and ID docs. */
export const MAX_UPLOAD_FILE_MB = 5;
export const MAX_APPLICATION_FILE_BYTES = MAX_UPLOAD_FILE_MB * 1024 * 1024;
export const MAX_UPLOAD_SIZE_LABEL = `${MAX_UPLOAD_FILE_MB} MB`;

export const DOC_ACCEPTED =
  "image/jpeg,image/png,image/webp,application/pdf";
export const PHOTO_ACCEPTED = "image/jpeg,image/png,image/webp";

/**
 * Validate an upload and persist bytes in IndexedDB on this device.
 * Returns an ApplicationFile whose `dataUrl` is an `idb:hb/…` media ref
 * (not a server URL and not an inline localStorage payload).
 */
export async function readFileAsAppFile(
  file: File,
  opts?: { imagesOnly?: boolean },
): Promise<ApplicationFile> {
  if (file.size > MAX_APPLICATION_FILE_BYTES) {
    throw new Error(
      `"${file.name}" ${MAX_UPLOAD_SIZE_LABEL} sınırını aşıyor.`,
    );
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
  const ref = await putMediaBlob(file, {
    name: file.name,
    type: file.type,
  });
  return {
    name: file.name,
    type: file.type,
    size: file.size,
    dataUrl: ref,
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
  `Kimlik ön ve arka birlikte, veya pasaport yükleyin. JPEG, PNG, WEBP veya PDF · en fazla ${MAX_UPLOAD_SIZE_LABEL}`;

export const IDENTITY_DOCS_ERROR =
  "Kimlik ön ve arka birlikte, veya pasaport yüklenmelidir.";
