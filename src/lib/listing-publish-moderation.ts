import { moderateListingImages } from "@/lib/image-moderation";
import { sendListingRejectedMail, type MailMessage } from "@/lib/mail";
import type { ListingStatus } from "@/lib/types";

export type PublishModerationResult = {
  /** Status to persist — never "approved" when images are flagged. */
  status: ListingStatus;
  rejectReason?: string;
  mail?: MailMessage;
  flagged: boolean;
};

/**
 * Gate used by every listing create/update that intends to go live.
 * Flagged images → status "rejected", reason stored, lister emailed.
 */
export async function gateListingPublish(opts: {
  photos: string[];
  fileNames?: (string | null | undefined)[];
  /** Desired status before moderation (usually "approved"). */
  intendedStatus: ListingStatus;
  recipientEmail: string;
  listingTitle: string;
  listingId?: string;
  /** When true (admin override of non-publish statuses), skip image scan. */
  skipScan?: boolean;
}): Promise<PublishModerationResult> {
  const wantsPublish = opts.intendedStatus === "approved";
  if (!wantsPublish || opts.skipScan) {
    return {
      status: opts.intendedStatus,
      flagged: false,
      ...(opts.intendedStatus === "rejected" ? {} : { rejectReason: undefined }),
    };
  }

  const verdict = await moderateListingImages(opts.photos, {
    fileNames: opts.fileNames,
  });

  if (verdict.ok) {
    return { status: "approved", flagged: false };
  }

  const reason = verdict.reason;
  let mail: MailMessage | undefined;
  if (opts.recipientEmail.trim()) {
    mail = await sendListingRejectedMail({
      to: opts.recipientEmail,
      reason,
      listingTitle: opts.listingTitle,
      listingId: opts.listingId,
    });
  }

  return {
    status: "rejected",
    rejectReason: reason,
    mail,
    flagged: true,
  };
}

export function rejectionUserMessage(reason: string): string {
  return `İlanınız şu neden ile yayınlanamadı: ${reason}`;
}
