function isScannablePhoto(src: string | undefined | null): src is string {
  if (!src) return false;
  return (
    src.startsWith("data:image/") ||
    src.startsWith("blob:") ||
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("/")
  );
}

/** Human-readable reject reasons (Turkish). */
export const MODERATION_REASONS = {
  obscenity:
    "Yüklenen görsellerde müstehcenlik veya çıplaklık tespit edildi",
  marker:
    "Yüklenen görsel dosya adı / içeriği müstehcen içerik olarak işaretlendi",
} as const;

export type ImageModerationVerdict = {
  ok: true;
} | {
  ok: false;
  reason: string;
  flaggedPhotoIndexes: number[];
};

const NSFW_NAME_RE =
  /nsfw|nude|naked|porn|xxx|sex|müstehcen|mustehcen|çıplak|ciplak|obscene|erotik|erotic/i;

/** Explicit test marker that can be embedded in a data URL query/hash or alt text. */
const NSFW_MARKER_RE = /hb-nsfw-test|hb-moderation-reject/i;

function isSkinYCbCr(r: number, g: number, b: number): boolean {
  // Standard compressed-domain skin heuristic (RGB → YCbCr).
  const y = 0.299 * r + 0.587 * g + 0.114 * b;
  const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
  const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
  return (
    y > 40 &&
    y < 240 &&
    cb > 85 &&
    cb < 135 &&
    cr > 135 &&
    cr < 180 &&
    r > 60 &&
    g > 30 &&
    b > 20 &&
    r > g &&
    r > b
  );
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Görsel yüklenemedi"));
    img.src = src;
  });
}

/**
 * Sample pixels and estimate skin coverage. High coverage on a non-trivial
 * image is treated as likely nudity/obscenity for this client-side gate.
 */
async function skinRatio(src: string): Promise<number | null> {
  if (typeof document === "undefined") return null;
  try {
    const img = await loadImage(src);
    const max = 96;
    const scale = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight, 1));
    const w = Math.max(1, Math.round(img.naturalWidth * scale));
    const h = Math.max(1, Math.round(img.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, w, h);
    const { data } = ctx.getImageData(0, 0, w, h);
    let skin = 0;
    let opaque = 0;
    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3];
      if (a < 20) continue;
      opaque += 1;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      // Ignore near-white / near-black (studio backgrounds, text).
      if (r > 245 && g > 245 && b > 245) continue;
      if (r < 18 && g < 18 && b < 18) continue;
      if (isSkinYCbCr(r, g, b)) skin += 1;
    }
    if (opaque < 40) return 0;
    return skin / opaque;
  } catch {
    return null;
  }
}

function nameLooksNsfw(label: string | undefined | null): boolean {
  if (!label) return false;
  return NSFW_NAME_RE.test(label) || NSFW_MARKER_RE.test(label);
}

/**
 * Scan listing photos (data URLs / http(s) / blob) for obscenity/nudity.
 * Placeholder tokens (e.g. "emlak-new") are skipped.
 */
export async function moderateListingImages(
  photos: string[],
  opts?: { fileNames?: (string | null | undefined)[] },
): Promise<ImageModerationVerdict> {
  const flaggedPhotoIndexes: number[] = [];
  let reason: string | undefined;

  for (let i = 0; i < photos.length; i++) {
    const src = photos[i];
    const fileName = opts?.fileNames?.[i];

    if (nameLooksNsfw(fileName) || nameLooksNsfw(src)) {
      flaggedPhotoIndexes.push(i);
      reason = MODERATION_REASONS.marker;
      continue;
    }

    if (!isScannablePhoto(src)) continue;

    const ratio = await skinRatio(src);
    if (ratio != null && ratio >= 0.42) {
      flaggedPhotoIndexes.push(i);
      reason = MODERATION_REASONS.obscenity;
    }
  }

  if (flaggedPhotoIndexes.length > 0) {
    return {
      ok: false,
      reason: reason ?? MODERATION_REASONS.obscenity,
      flaggedPhotoIndexes,
    };
  }
  return { ok: true };
}
