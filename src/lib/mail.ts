/**
 * Outbound mail for Harbiden Bak.
 * Static export has no server SMTP — messages go to a local outbox unless a
 * webhook/SMTP bridge URL is configured via NEXT_PUBLIC_SMTP_WEBHOOK_URL.
 */

export type MailMessage = {
  id: string;
  to: string;
  subject: string;
  body: string;
  createdAt: string;
  /** "sent" via webhook, otherwise stored locally */
  transport: "smtp-webhook" | "local-mock";
  meta?: Record<string, string>;
};

const OUTBOX_KEY = "harbidenbak.mailOutbox";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function loadMailOutbox(): MailMessage[] {
  if (!canUseStorage()) return [];
  try {
    return JSON.parse(localStorage.getItem(OUTBOX_KEY) || "[]") as MailMessage[];
  } catch {
    return [];
  }
}

function saveMailOutbox(messages: MailMessage[]): void {
  if (!canUseStorage()) return;
  localStorage.setItem(OUTBOX_KEY, JSON.stringify(messages.slice(0, 200)));
}

function smtpWebhookUrl(): string | null {
  const url =
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_SMTP_WEBHOOK_URL?.trim()
      : undefined;
  return url || null;
}

/**
 * Deliver an email. Uses webhook when configured; otherwise appends to the
 * local mock outbox and logs to the console.
 */
export async function sendMail(input: {
  to: string;
  subject: string;
  body: string;
  meta?: Record<string, string>;
}): Promise<MailMessage> {
  const message: MailMessage = {
    id: `mail-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    to: input.to.trim(),
    subject: input.subject,
    body: input.body,
    createdAt: new Date().toISOString(),
    transport: "local-mock",
    meta: input.meta,
  };

  const webhook = smtpWebhookUrl();
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: message.to,
          subject: message.subject,
          text: message.body,
          meta: message.meta,
        }),
      });
      if (res.ok) {
        message.transport = "smtp-webhook";
      }
    } catch {
      // Fall through to local mock.
    }
  }

  const outbox = loadMailOutbox();
  outbox.unshift(message);
  saveMailOutbox(outbox);

  if (typeof console !== "undefined") {
    console.info(
      `[Harbiden Bak mail · ${message.transport}] → ${message.to}\n${message.subject}\n${message.body}`,
    );
  }

  return message;
}

/** Rejection notice copy required by product preference. */
export function listingRejectedMailBody(reason: string, listingTitle?: string): string {
  const titleLine = listingTitle?.trim()
    ? `İlan: “${listingTitle.trim()}”\n\n`
    : "";
  return (
    `${titleLine}` +
    `İlanınız şu neden ile yayınlanamadı: ${reason.trim()}\n\n` +
    `Lütfen uygun görsellerle tekrar deneyin.\n\n` +
    `Harbiden Bak`
  );
}

export async function sendListingRejectedMail(opts: {
  to: string;
  reason: string;
  listingTitle?: string;
  listingId?: string;
}): Promise<MailMessage> {
  return sendMail({
    to: opts.to,
    subject: "İlanınız yayınlanamadı — Harbiden Bak",
    body: listingRejectedMailBody(opts.reason, opts.listingTitle),
    meta: {
      kind: "listing-rejected",
      reason: opts.reason,
      ...(opts.listingId ? { listingId: opts.listingId } : {}),
    },
  });
}
