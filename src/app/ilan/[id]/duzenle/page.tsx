"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useListings } from "@/context/listings-context";
import { ListingForm } from "@/components/listings/listing-form";
import { ListingsError, ListingsLoading } from "@/components/listings/listing-states";

export default function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user, ready: authReady } = useAuth();
  const { getById, ready } = useListings();
  const router = useRouter();
  const listing = getById(id);

  useEffect(() => {
    if (authReady && !user) {
      router.replace(`/giris?next=${encodeURIComponent(`/ilan/${id}/duzenle`)}`);
    }
  }, [authReady, user, router, id]);

  if (!ready || !authReady || !user) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <ListingsLoading />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <ListingsError message="Düzenlenecek ilan bulunamadı." />
      </div>
    );
  }

  if (user.role !== "admin" && user.id !== listing.sellerId) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <ListingsError message="Bu ilanı düzenleme yetkiniz yok." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-pink-950">
        İlanı düzenle
      </h1>
      <p className="mt-1 text-stone-600">{listing.title}</p>
      <div className="mt-8">
        <ListingForm listing={listing} adminMode={user.role === "admin"} />
      </div>
    </div>
  );
}
