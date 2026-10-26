"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useListings } from "@/context/listings-context";
import { getCategory, CATEGORIES } from "@/lib/categories";
import { formatPrice } from "@/lib/format";
import type { Listing, ListingStatus, User } from "@/lib/types";
import { ListingsLoading } from "@/components/listings/listing-states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, EyeOff, Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";

function statusLabel(s: ListingStatus) {
  if (s === "approved") return "Yayında";
  if (s === "pending") return "Onay bekliyor";
  return "Gizli";
}

export default function AdminPage() {
  const { user, users, ready, updateUser, deleteUser } = useAuth();
  const {
    listings,
    ready: listingsReady,
    setStatus,
    deleteListing,
    resetData,
  } = useListings();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [deleteTarget, setDeleteTarget] = useState<Listing | null>(null);
  const [userDelete, setUserDelete] = useState<User | null>(null);

  useEffect(() => {
    if (ready && !user) router.replace("/giris?admin=1&next=/admin");
    else if (ready && user && user.role !== "admin") router.replace("/");
  }, [ready, user, router]);

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (categoryFilter !== "all" && l.category !== categoryFilter) return false;
      if (q) {
        const needle = q.toLowerCase();
        if (
          !l.title.toLowerCase().includes(needle) &&
          !l.city.toLowerCase().includes(needle) &&
          !l.contactName.toLowerCase().includes(needle)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [listings, q, statusFilter, categoryFilter]);

  if (!ready || !user || user.role !== "admin") {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <ListingsLoading />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--lagoon)]">
            Yönetim
          </p>
          <h1 className="hb-display text-3xl font-bold text-[var(--ink)]">
            Admin Yönetim Paneli
          </h1>
          <p className="mt-1 text-sm text-stone-600">
            İlanları onaylayın, gizleyin, düzenleyin; üyelikleri yönetin.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild className="bg-[var(--lagoon)] hover:bg-[#be185d]">
            <Link href="/ilan/yeni">
              <Plus className="size-4" />
              Yeni ilan
            </Link>
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (confirm("Tüm demo verileri sıfırlansın mı?")) {
                resetData();
                window.location.reload();
              }
            }}
          >
            <RotateCcw className="size-4" />
            Demo veriyi sıfırla
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="hb-surface p-4">
          <p className="text-xs text-stone-500">Toplam ilan</p>
          <p className="text-2xl font-bold text-[var(--ink)]">{listings.length}</p>
        </div>
        <div className="hb-surface p-4">
          <p className="text-xs text-stone-500">Onay bekleyen</p>
          <p className="text-2xl font-bold text-amber-700">
            {listings.filter((l) => l.status === "pending").length}
          </p>
        </div>
        <div className="hb-surface p-4">
          <p className="text-xs text-stone-500">Üye</p>
          <p className="text-2xl font-bold text-[var(--ink)]">{users.length}</p>
        </div>
      </div>

      <Tabs defaultValue="listings" className="mt-8">
        <TabsList>
          <TabsTrigger value="listings">İlanlar</TabsTrigger>
          <TabsTrigger value="users">Üyeler</TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-3">
            <Input
              placeholder="İlan ara…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="max-w-xs"
            />
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm durumlar</SelectItem>
                <SelectItem value="pending">Onay bekliyor</SelectItem>
                <SelectItem value="approved">Yayında</SelectItem>
                <SelectItem value="hidden">Gizli</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={categoryFilter}
              onValueChange={(v) => setCategoryFilter(v ?? "all")}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm kategoriler</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!listingsReady ? (
            <ListingsLoading />
          ) : (
            <div className="overflow-x-auto hb-surface">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>İlan</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Fiyat</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead className="text-right">İşlem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell>
                        <Link
                          href={`/ilan/${l.id}`}
                          className="font-medium text-pink-950 hover:underline"
                        >
                          {l.title}
                        </Link>
                        <p className="text-xs text-stone-500">
                          {l.city}/{l.district} · {l.contactName}
                        </p>
                      </TableCell>
                      <TableCell className="text-sm">
                        {getCategory(l.category)?.shortName}
                      </TableCell>
                      <TableCell className="text-sm">{formatPrice(l.price)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            l.status === "approved"
                              ? "default"
                              : l.status === "pending"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {statusLabel(l.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap justify-end gap-1">
                          {l.status !== "approved" && (
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              title="Onayla"
                              onClick={() => setStatus(l.id, "approved")}
                            >
                              <Check className="size-4 text-pink-700" />
                            </Button>
                          )}
                          {l.status !== "hidden" && (
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              title="Gizle"
                              onClick={() => setStatus(l.id, "hidden")}
                            >
                              <EyeOff className="size-4" />
                            </Button>
                          )}
                          <Button size="icon-sm" variant="ghost" asChild title="Düzenle">
                            <Link href={`/ilan/${l.id}/duzenle`}>
                              <Pencil className="size-4" />
                            </Link>
                          </Button>
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            title="Sil"
                            onClick={() => setDeleteTarget(l)}
                          >
                            <Trash2 className="size-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center text-sm text-stone-500">
                        Eşleşen ilan yok.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <div className="overflow-x-auto hb-surface">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Üye</TableHead>
                  <TableHead>Üyelik</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead className="text-right">İşlem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <p className="font-medium">{u.name}</p>
                      <p className="text-xs text-stone-500">
                        {u.email} · {u.phone}
                      </p>
                      {u.companyName && (
                        <p className="text-xs text-stone-500">{u.companyName}</p>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {u.membershipKind === "kurumsal" ? (
                        <>
                          Kurumsal
                          {u.kurumsalType === "galeri" && " · Galeri"}
                          {u.kurumsalType === "emlak" && " · Emlak"}
                        </>
                      ) : (
                        "Bireysel"
                      )}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={u.role}
                        onValueChange={(role) =>
                          updateUser(u.id, { role: (role as "user" | "admin") ?? u.role })
                        }
                        disabled={u.id === user.id}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">Kullanıcı</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        disabled={u.id === user.id}
                        onClick={() => setUserDelete(u)}
                      >
                        <Trash2 className="size-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>İlanı sil</DialogTitle>
            <DialogDescription>
              “{deleteTarget?.title}” kalıcı olarak silinecek. Bu işlem geri alınamaz.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Vazgeç
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteTarget) deleteListing(deleteTarget.id);
                setDeleteTarget(null);
              }}
            >
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!userDelete} onOpenChange={(o) => !o && setUserDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Üyeyi sil</DialogTitle>
            <DialogDescription>
              “{userDelete?.name}” hesabı silinecek.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserDelete(null)}>
              Vazgeç
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (userDelete) deleteUser(userDelete.id);
                setUserDelete(null);
              }}
            >
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
