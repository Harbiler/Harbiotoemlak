/**
 * Device-local media store (IndexedDB).
 * Listing photos, member/ID docs, and large image payloads live here —
 * not on a server and not inline in localStorage JSON.
 */

const DB_NAME = "harbidenbak.media";
const DB_VERSION = 1;
const STORE_NAME = "blobs";

/** Stable ref prefix stored in listing.photos / ApplicationFile.dataUrl */
export const MEDIA_REF_PREFIX = "idb:hb/";

type MediaRecord = {
  id: string;
  blob: Blob;
  type: string;
  size: number;
  name?: string;
  createdAt: string;
};

function canUseIdb(): boolean {
  return typeof window !== "undefined" && typeof indexedDB !== "undefined";
}

export function isMediaRef(src: string | undefined | null): boolean {
  return Boolean(src && src.startsWith(MEDIA_REF_PREFIX));
}

export function mediaIdFromRef(ref: string): string | null {
  if (!isMediaRef(ref)) return null;
  const id = ref.slice(MEDIA_REF_PREFIX.length);
  return id || null;
}

export function mediaRefFromId(id: string): string {
  return `${MEDIA_REF_PREFIX}${id}`;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!canUseIdb()) {
      reject(new Error("Bu cihazda yerel medya deposu kullanılamıyor."));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () =>
      reject(req.error ?? new Error("Yerel medya deposu açılamadı."));
  });
}

function newMediaId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `m-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Persist a File/Blob on this device; returns an `idb:hb/…` ref. */
export async function putMediaBlob(
  blob: Blob,
  meta?: { name?: string; type?: string },
): Promise<string> {
  const id = newMediaId();
  const type = meta?.type || blob.type || "application/octet-stream";
  const record: MediaRecord = {
    id,
    blob,
    type,
    size: blob.size,
    name: meta?.name,
    createdAt: new Date().toISOString(),
  };
  const db = await openDb();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.oncomplete = () => resolve();
      tx.onerror = () =>
        reject(tx.error ?? new Error("Medya kaydedilemedi."));
      tx.objectStore(STORE_NAME).put(record);
    });
  } finally {
    db.close();
  }
  return mediaRefFromId(id);
}

/** Legacy helper: store a data URL as a Blob in IndexedDB. */
export async function putMediaDataUrl(
  dataUrl: string,
  meta?: { name?: string },
): Promise<string> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return putMediaBlob(blob, { name: meta?.name, type: blob.type });
}

export async function getMediaRecord(
  refOrId: string,
): Promise<MediaRecord | null> {
  const id = isMediaRef(refOrId) ? mediaIdFromRef(refOrId) : refOrId;
  if (!id || !canUseIdb()) return null;
  const db = await openDb();
  try {
    return await new Promise<MediaRecord | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const req = tx.objectStore(STORE_NAME).get(id);
      req.onsuccess = () => resolve((req.result as MediaRecord) ?? null);
      req.onerror = () =>
        reject(req.error ?? new Error("Medya okunamadı."));
    });
  } finally {
    db.close();
  }
}

export async function getMediaBlob(refOrId: string): Promise<Blob | null> {
  const record = await getMediaRecord(refOrId);
  return record?.blob ?? null;
}

/**
 * Resolve any stored photo/doc src to a browser-displayable URL.
 * - `idb:hb/…` → object URL (caller should revoke when done if ephemeral)
 * - data:/http(s)/blob:/path → returned as-is
 */
export async function resolveMediaUrl(
  src: string | undefined | null,
): Promise<string | undefined> {
  if (!src) return undefined;
  if (!isMediaRef(src)) return src;
  const blob = await getMediaBlob(src);
  if (!blob) return undefined;
  return URL.createObjectURL(blob);
}

/** True for anything PhotoPlaceholder / <img> can eventually show. */
export function isStoredOrRemotePhoto(
  src: string | undefined | null,
): src is string {
  if (!src) return false;
  return (
    isMediaRef(src) ||
    src.startsWith("data:image/") ||
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("blob:") ||
    src.startsWith("/")
  );
}

export async function deleteMedia(refOrId: string): Promise<void> {
  const id = isMediaRef(refOrId) ? mediaIdFromRef(refOrId) : refOrId;
  if (!id || !canUseIdb()) return;
  const db = await openDb();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.oncomplete = () => resolve();
      tx.onerror = () =>
        reject(tx.error ?? new Error("Medya silinemedi."));
      tx.objectStore(STORE_NAME).delete(id);
    });
  } finally {
    db.close();
  }
}

/** Wipe all device-local media (demo reset). */
export async function clearAllMedia(): Promise<void> {
  if (!canUseIdb()) return;
  const db = await openDb();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.oncomplete = () => resolve();
      tx.onerror = () =>
        reject(tx.error ?? new Error("Medya deposu temizlenemedi."));
      tx.objectStore(STORE_NAME).clear();
    });
  } finally {
    db.close();
  }
}
