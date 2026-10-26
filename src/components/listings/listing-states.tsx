import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ListingsLoading() {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[color-mix(in_oklab,var(--ink)_12%,transparent)] bg-white/50 px-6 py-12 text-center">
      <Loader2 className="size-8 animate-spin text-[var(--lagoon)]" />
      <p className="text-sm text-[var(--muted-foreground)]">İlanlar yükleniyor…</p>
    </div>
  );
}

export function ListingsEmpty({
  title = "Bu kriterlere uygun ilan yok",
  hint = "Filtreleri temizleyin veya yeni ilan verin.",
  showCta = true,
}: {
  title?: string;
  hint?: string;
  showCta?: boolean;
}) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[color-mix(in_oklab,var(--ink)_12%,transparent)] bg-white/50 px-6 py-12 text-center">
      <Inbox className="size-10 text-[var(--lagoon)]/50" />
      <div>
        <p className="font-semibold text-[var(--ink)]">{title}</p>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">{hint}</p>
      </div>
      {showCta && (
        <Button asChild className="mt-2 bg-[var(--lagoon)] hover:bg-[#0a5a5a]">
          <Link href="/ilan/yeni">İlan Ver</Link>
        </Button>
      )}
    </div>
  );
}

export function ListingsError({
  message = "İlanlar yüklenirken bir sorun oluştu.",
}: {
  message?: string;
}) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50/60 px-6 py-12 text-center">
      <AlertCircle className="size-8 text-red-600" />
      <p className="text-sm text-red-800">{message}</p>
      <Button asChild variant="outline">
        <Link href="/">Ana sayfaya dön</Link>
      </Button>
    </div>
  );
}
