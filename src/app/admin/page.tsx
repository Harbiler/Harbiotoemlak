"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useListings } from "@/context/listings-context";
import { getCategory, CATEGORIES } from "@/lib/categories";
import { formatDateShort, formatPrice } from "@/lib/format";
import { freeListingCopy } from "@/lib/listing-validity";
import {
  approvePendingCaregiverApplications,
  approvePendingPetHotelApplications,
  deleteCaregiverApplication,
  updateCaregiverApplicationStatus,
  updatePetHotelApplicationStatus,
} from "@/lib/storage";
import {
  listingNumber,
  type CaregiverApplication,
  type Listing,
  type PetHotelApplication,
  type User,
} from "@/lib/types";
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
import { HEPSI, isHepsi } from "@/lib/filter-all";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Ban,
  Check,
  EyeOff,
  Pencil,
  Plus,
  RotateCcw,
  ShieldOff,
  Trash2,
} from "lucide-react";

type MemberGroup = "all" | "bireysel" | "kurumsal" | "bakici";

function membershipLabel(u: User): string {
  if (u.membershipKind === "kurumsal") {
    if (u.kurumsalType === "galeri") return "Kurumsal · Galeri";
    if (u.kurumsalType === "emlak") return "Kurumsal · Emlak";
    return "Kurumsal";
  }
  return "Bireysel";
}

function listingMatchesQuery(l: Listing, needle: string): boolean {
  if (!needle) return true;
  const n = needle.toLowerCase().trim();
  const cat = getCategory(l.category);
  const hay = [
    l.id,
    listingNumber(l.id),
    l.title,
    l.city,
    l.district,
    l.contactName,
    l.category,
    cat?.name ?? "",
    cat?.shortName ?? "",
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(n);
}

function userMatchesQuery(u: User, needle: string): boolean {
  if (!needle) return true;
  const n = needle.toLowerCase().trim();
  const hay = [
    u.id,
    u.name,
    u.email,
    u.phone,
    u.companyName ?? "",
    u.tcKimlikNo ?? "",
    u.address ?? "",
    membershipLabel(u),
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(n);
}

function caregiverMatchesQuery(a: CaregiverApplication, needle: string): boolean {
  if (!needle) return true;
  const n = needle.toLowerCase().trim();
  const hay = [
    a.id,
    a.fullName,
    a.email,
    a.phone,
    a.vatandaslik,
    a.city ?? "",
    a.address ?? "",
    "bakıcı",
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(n);
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
  const [statusFilter, setStatusFilter] = useState<string>(HEPSI);
  const [categoryFilter, setCategoryFilter] = useState<string>(HEPSI);
  const [userQ, setUserQ] = useState("");
  const [memberGroup, setMemberGroup] = useState<MemberGroup>("all");
  const [deleteTarget, setDeleteTarget] = useState<Listing | null>(null);
  const [userDelete, setUserDelete] = useState<User | null>(null);
  const [caregiverDelete, setCaregiverDelete] =
    useState<CaregiverApplication | null>(null);
  const [petApps, setPetApps] = useState<PetHotelApplication[]>([]);
  const [caregiverApps, setCaregiverApps] = useState<CaregiverApplication[]>(
    [],
  );

  const statusItems = {
    [HEPSI]: "Tüm durumlar",
    pending: "Onay bekliyor",
    approved: "Yayında",
    hidden: "Gizli",
  };

  const categoryItems = useMemo(() => {
    const map: Record<string, string> = { [HEPSI]: "Tüm kategoriler" };
    for (const c of CATEGORIES) map[c.slug] = c.name;
    return map;
  }, []);

  useEffect(() => {
    if (ready && !user) router.replace("/giris?admin=1&next=/admin");
    else if (ready && user && user.role !== "admin") router.replace("/");
  }, [ready, user, router]);

  useEffect(() => {
    if (ready && user?.role === "admin") {
      setPetApps(approvePendingPetHotelApplications());
      setCaregiverApps(approvePendingCaregiverApplications());
    }
  }, [ready, user]);

  function refreshPetApps() {
    setPetApps(approvePendingPetHotelApplications());
  }

  function refreshCaregiverApps() {
    setCaregiverApps(approvePendingCaregiverApplications());
  }

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      if (!isHepsi(statusFilter) && l.status !== statusFilter) return false;
      if (!isHepsi(categoryFilter) && l.category !== categoryFilter) return false;
      return listingMatchesQuery(l, q);
    });
  }, [listings, q, statusFilter, categoryFilter]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (memberGroup === "bireysel" && u.membershipKind !== "bireysel")
        return false;
      if (memberGroup === "kurumsal" && u.membershipKind !== "kurumsal")
        return false;
      if (memberGroup === "bakici") return false;
      return userMatchesQuery(u, userQ);
    });
  }, [users, userQ, memberGroup]);

  const filteredCaregivers = useMemo(() => {
    if (memberGroup === "bireysel" || memberGroup === "kurumsal") return [];
    return caregiverApps.filter((a) => caregiverMatchesQuery(a, userQ));
  }, [caregiverApps, userQ, memberGroup]);

  const bireyselCount = users.filter((u) => u.membershipKind === "bireysel").length;
  const kurumsalCount = users.filter((u) => u.membershipKind === "kurumsal").length;

  function toggleRestrict(u: User) {
    if (u.id === user?.id) return;
    updateUser(u.id, { restricted: !u.restricted });
  }

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
            Tüm ilanları arayın, düzenleyin veya silin; üyeleri gruplar halinde
            yönetin.
          </p>
          <p className="mt-2 max-w-xl text-xs text-stone-500">
            {freeListingCopy.adminNote}
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
          <TabsTrigger value="pet-hotels">
            Pet otel başvuruları
            {petApps.filter((a) => a.status === "pending").length > 0 && (
              <Badge className="ml-1 bg-[var(--lagoon)]">
                {petApps.filter((a) => a.status === "pending").length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="caregivers">
            Bakıcı başvuruları
            {caregiverApps.filter((a) => a.status === "pending").length > 0 && (
              <Badge className="ml-1 bg-[var(--lagoon)]">
                {caregiverApps.filter((a) => a.status === "pending").length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-3">
            <Input
              placeholder="Başlık, no, şehir veya kategori ara…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="max-w-sm"
              aria-label="İlan ara"
            />
            <Select
              value={isHepsi(statusFilter) ? HEPSI : statusFilter}
              onValueChange={(v) => setStatusFilter(v ?? HEPSI)}
              items={statusItems}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent className="z-[200]">
                <SelectItem value={HEPSI}>Tüm durumlar</SelectItem>
                <SelectItem value="pending">Onay bekliyor</SelectItem>
                <SelectItem value="approved">Yayında</SelectItem>
                <SelectItem value="hidden">Gizli</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={isHepsi(categoryFilter) ? HEPSI : categoryFilter}
              onValueChange={(v) => setCategoryFilter(v ?? HEPSI)}
              items={categoryItems}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent className="z-[200]">
                <SelectItem value={HEPSI}>Tüm kategoriler</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <p className="text-xs text-stone-500">
            {filtered.length} / {listings.length} ilan gösteriliyor
          </p>

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
                    <TableHead>Geçerlilik</TableHead>
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
                          {listingNumber(l.id)} · {l.city}/{l.district} ·{" "}
                          {l.contactName}
                        </p>
                      </TableCell>
                      <TableCell className="text-sm">
                        {getCategory(l.category)?.shortName}
                      </TableCell>
                      <TableCell className="text-sm">{formatPrice(l.price)}</TableCell>
                      <TableCell>
                        <Select
                          value={l.status}
                          onValueChange={(v) => {
                            if (v === "pending" || v === "approved" || v === "hidden") {
                              setStatus(l.id, v);
                            }
                          }}
                          items={{
                            pending: "Onay bekliyor",
                            approved: "Yayında",
                            hidden: "Gizli",
                          }}
                        >
                          <SelectTrigger className="h-8 w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="z-[200]">
                            <SelectItem value="pending">Onay bekliyor</SelectItem>
                            <SelectItem value="approved">Yayında</SelectItem>
                            <SelectItem value="hidden">Gizli</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-xs text-stone-600">
                        <span className="font-medium text-[var(--lagoon)]">
                          Ücretsiz
                        </span>
                        <br />
                        {l.validUntil ? formatDateShort(l.validUntil) : "—"}
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
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            asChild
                            title="Düzenle"
                          >
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
                      <TableCell
                        colSpan={6}
                        className="py-8 text-center text-sm text-stone-500"
                      >
                        Eşleşen ilan yok.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="users" className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-3">
            <Input
              placeholder="Üye ara (ad, e-posta, telefon, şirket)…"
              value={userQ}
              onChange={(e) => setUserQ(e.target.value)}
              className="max-w-sm"
              aria-label="Üye ara"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: "all" as const, label: `Tümü (${users.length + caregiverApps.length})` },
                { id: "bireysel" as const, label: `Bireysel (${bireyselCount})` },
                { id: "kurumsal" as const, label: `Kurumsal (${kurumsalCount})` },
                {
                  id: "bakici" as const,
                  label: `Bakıcı (${caregiverApps.length})`,
                },
              ] as const
            ).map((g) => (
              <Button
                key={g.id}
                size="sm"
                variant={memberGroup === g.id ? "default" : "outline"}
                className={
                  memberGroup === g.id
                    ? "bg-[var(--lagoon)] hover:bg-[#be185d]"
                    : undefined
                }
                onClick={() => setMemberGroup(g.id)}
              >
                {g.label}
              </Button>
            ))}
          </div>

          {(memberGroup === "all" ||
            memberGroup === "bireysel" ||
            memberGroup === "kurumsal") && (
            <div className="space-y-2">
              {memberGroup === "all" && (
                <h2 className="text-sm font-semibold text-[var(--ink)]">
                  Bireysel / Kurumsal üyeler
                </h2>
              )}
              <div className="overflow-x-auto hb-surface">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Üye</TableHead>
                      <TableHead>Üyelik</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead className="text-right">İşlem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((u) => (
                      <TableRow
                        key={u.id}
                        className={u.restricted ? "bg-red-50/60" : undefined}
                      >
                        <TableCell>
                          <p className="font-medium">{u.name}</p>
                          <p className="text-xs text-stone-500">
                            {u.email} · {u.phone}
                          </p>
                          {u.companyName && (
                            <p className="text-xs text-stone-500">
                              {u.companyName}
                            </p>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {membershipLabel(u)}
                        </TableCell>
                        <TableCell>
                          {u.restricted ? (
                            <Badge variant="destructive">Kısıtlı</Badge>
                          ) : (
                            <Badge variant="secondary">Aktif</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={u.role}
                            onValueChange={(role) =>
                              updateUser(u.id, {
                                role: (role as "user" | "admin") ?? u.role,
                              })
                            }
                            disabled={u.id === user.id}
                            items={{ user: "Kullanıcı", admin: "Admin" }}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="z-[200]">
                              <SelectItem value="user">Kullanıcı</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-wrap justify-end gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={u.id === user.id}
                              title={
                                u.restricted
                                  ? "Kısıtlamayı kaldır"
                                  : "Kısıtla"
                              }
                              onClick={() => toggleRestrict(u)}
                            >
                              {u.restricted ? (
                                <>
                                  <ShieldOff className="size-4" />
                                  Kaldır
                                </>
                              ) : (
                                <>
                                  <Ban className="size-4" />
                                  Kısıtla
                                </>
                              )}
                            </Button>
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              disabled={u.id === user.id}
                              title="Sil"
                              onClick={() => setUserDelete(u)}
                            >
                              <Trash2 className="size-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredUsers.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="py-8 text-center text-sm text-stone-500"
                        >
                          Eşleşen üye yok.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {(memberGroup === "all" || memberGroup === "bakici") && (
            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-[var(--ink)]">
                Bakıcı başvuruları
              </h2>
              <div className="overflow-x-auto hb-surface">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Başvuran</TableHead>
                      <TableHead>İletişim</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead className="text-right">İşlem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCaregivers.map((app) => (
                      <TableRow
                        key={app.id}
                        className={
                          app.status === "rejected" ? "bg-red-50/60" : undefined
                        }
                      >
                        <TableCell>
                          <p className="font-medium">{app.fullName}</p>
                          <p className="text-xs text-stone-500">
                            {new Date(app.createdAt).toLocaleString("tr-TR")}
                          </p>
                          {app.city && (
                            <p className="text-xs text-stone-500">
                              Şehir: {app.city}
                            </p>
                          )}
                          {app.address && (
                            <p className="text-xs text-stone-500 whitespace-pre-wrap">
                              Adres: {app.address}
                            </p>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          <p>{app.email}</p>
                          <p className="text-xs text-stone-500">{app.phone}</p>
                          {app.vatandaslik && (
                            <p className="text-xs text-stone-500">
                              {app.vatandaslik}
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          {app.status === "rejected" ? (
                            <Badge variant="destructive">Kısıtlı</Badge>
                          ) : app.status === "reviewed" ? (
                            <Badge variant="secondary">Onaylı</Badge>
                          ) : (
                            <Badge variant="outline">Bekliyor</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-wrap justify-end gap-1">
                            {app.status === "rejected" ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  updateCaregiverApplicationStatus(
                                    app.id,
                                    "reviewed",
                                  );
                                  refreshCaregiverApps();
                                }}
                              >
                                <ShieldOff className="size-4" />
                                Kaldır
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  updateCaregiverApplicationStatus(
                                    app.id,
                                    "rejected",
                                  );
                                  refreshCaregiverApps();
                                }}
                              >
                                <Ban className="size-4" />
                                Kısıtla
                              </Button>
                            )}
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              title="Sil"
                              onClick={() => setCaregiverDelete(app)}
                            >
                              <Trash2 className="size-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredCaregivers.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="py-8 text-center text-sm text-stone-500"
                        >
                          Eşleşen bakıcı başvurusu yok.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="pet-hotels" className="mt-4">
          <div className="overflow-x-auto hb-surface">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Başvuran</TableHead>
                  <TableHead>İletişim</TableHead>
                  <TableHead>Belgeler</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">İşlem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {petApps.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <p className="font-medium">{app.fullName}</p>
                      <p className="text-xs text-stone-500">
                        {new Date(app.createdAt).toLocaleString("tr-TR")}
                      </p>
                    </TableCell>
                    <TableCell className="text-sm">
                      <p>{app.email}</p>
                      <p className="text-xs text-stone-500">{app.phone}</p>
                      {app.address ? (
                        <p className="mt-1 max-w-[220px] text-xs text-stone-500">
                          {app.address}
                        </p>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex flex-col gap-1">
                        <a
                          href={app.idDocument.dataUrl}
                          download={app.idDocument.name}
                          className="text-[var(--lagoon)] hover:underline"
                        >
                          Kimlik: {app.idDocument.name}
                        </a>
                        <a
                          href={app.residenceDocument.dataUrl}
                          download={app.residenceDocument.name}
                          className="text-[var(--lagoon)] hover:underline"
                        >
                          İkametgâh: {app.residenceDocument.name}
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {app.status === "pending"
                          ? "Bekliyor"
                          : app.status === "reviewed"
                            ? "İncelendi"
                            : "Reddedildi"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {app.status !== "reviewed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              updatePetHotelApplicationStatus(app.id, "reviewed");
                              refreshPetApps();
                            }}
                          >
                            Onayla
                          </Button>
                        )}
                        {app.status !== "rejected" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              updatePetHotelApplicationStatus(app.id, "rejected");
                              refreshPetApps();
                            }}
                          >
                            Reddet
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {petApps.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-8 text-center text-sm text-stone-500"
                    >
                      Henüz pet otel başvurusu yok.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="caregivers" className="mt-4">
          <div className="overflow-x-auto hb-surface">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Başvuran</TableHead>
                  <TableHead>İletişim</TableHead>
                  <TableHead>Belgeler</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">İşlem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {caregiverApps.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={app.profilePhoto.dataUrl}
                          alt=""
                          className="size-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium">{app.fullName}</p>
                          <p className="text-xs text-stone-500">
                            {new Date(app.createdAt).toLocaleString("tr-TR")}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <p>{app.email}</p>
                      <p className="text-xs text-stone-500">{app.phone}</p>
                      {app.vatandaslik && (
                        <p className="mt-1 text-xs text-stone-600">
                          Vatandaşlık: {app.vatandaslik}
                        </p>
                      )}
                      {app.city && (
                        <p className="text-xs text-stone-600">
                          Şehir: {app.city}
                        </p>
                      )}
                      {app.address && (
                        <p className="text-xs text-stone-600 whitespace-pre-wrap">
                          Adres: {app.address}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex flex-col gap-1">
                        {app.idFront && (
                          <a
                            href={app.idFront.dataUrl}
                            download={app.idFront.name}
                            className="text-[var(--lagoon)] hover:underline"
                          >
                            Kimlik ön: {app.idFront.name}
                          </a>
                        )}
                        {app.idBack && (
                          <a
                            href={app.idBack.dataUrl}
                            download={app.idBack.name}
                            className="text-[var(--lagoon)] hover:underline"
                          >
                            Kimlik arka: {app.idBack.name}
                          </a>
                        )}
                        {app.passport && (
                          <a
                            href={app.passport.dataUrl}
                            download={app.passport.name}
                            className="text-[var(--lagoon)] hover:underline"
                          >
                            Pasaport: {app.passport.name}
                          </a>
                        )}
                        {app.residenceDocument && (
                          <a
                            href={app.residenceDocument.dataUrl}
                            download={app.residenceDocument.name}
                            className="text-[var(--lagoon)] hover:underline"
                          >
                            İkametgâh: {app.residenceDocument.name}
                          </a>
                        )}
                        {app.criminalRecordDocument && (
                          <a
                            href={app.criminalRecordDocument.dataUrl}
                            download={app.criminalRecordDocument.name}
                            className="text-[var(--lagoon)] hover:underline"
                          >
                            Sabıka: {app.criminalRecordDocument.name}
                          </a>
                        )}
                        <a
                          href={app.profilePhoto.dataUrl}
                          download={app.profilePhoto.name}
                          className="text-[var(--lagoon)] hover:underline"
                        >
                          Profil: {app.profilePhoto.name}
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {app.status === "pending"
                          ? "Bekliyor"
                          : app.status === "reviewed"
                            ? "Onaylandı"
                            : "Reddedildi"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {app.status !== "reviewed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              updateCaregiverApplicationStatus(
                                app.id,
                                "reviewed",
                              );
                              refreshCaregiverApps();
                            }}
                          >
                            Onayla
                          </Button>
                        )}
                        {app.status !== "rejected" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              updateCaregiverApplicationStatus(
                                app.id,
                                "rejected",
                              );
                              refreshCaregiverApps();
                            }}
                          >
                            Reddet
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {caregiverApps.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-8 text-center text-sm text-stone-500"
                    >
                      Henüz bakıcı başvurusu yok.
                    </TableCell>
                  </TableRow>
                )}
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
              “{deleteTarget?.title}” kalıcı olarak silinecek. Bu işlem geri
              alınamaz.
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

      <Dialog
        open={!!caregiverDelete}
        onOpenChange={(o) => !o && setCaregiverDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bakıcı başvurusunu sil</DialogTitle>
            <DialogDescription>
              “{caregiverDelete?.fullName}” başvurusu kalıcı olarak silinecek.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCaregiverDelete(null)}>
              Vazgeç
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (caregiverDelete) {
                  deleteCaregiverApplication(caregiverDelete.id);
                  refreshCaregiverApps();
                }
                setCaregiverDelete(null);
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
