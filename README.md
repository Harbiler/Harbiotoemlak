# Harbiden Bak

Türkiye’nin otomobil ve emlak odaklı **ilan sitesi**.  
Next.js (App Router), TypeScript, Tailwind CSS ve shadcn/ui.

## Yerelde çalıştırma

```bash
npm install
npm run dev
```

Uygulama: **http://127.0.0.1:43127**

```bash
npm run build && npm start   # port 43127
npm run lint
```

Veriler `localStorage` içinde (mock auth + seed ilanlar).

## Demo hesaplar

| Rol | E-posta | Şifre |
|-----|---------|-------|
| **Admin** | `admin@harbidenbak.com` | `admin123` |
| Bireysel | `ayse@ornek.com` | `demo123` |
| Kurumsal · Galeri | `galeri@ornek.com` | `demo123` |
| Kurumsal · Emlak | `emlak@ornek.com` | `demo123` |

Admin: `/giris?admin=1` veya `/admin`

## Özellikler

- **Marka:** Harbiden Bak — modern Türkçe ilan sitesi arayüzü
- **Üyelik:** Bireysel / Kurumsal (Galeri · Emlak)
- **12 kategori** + global arama, il/ilçe, fiyat, sıralama
- İlan kartı, detay (galeri, özellikler, satıcı, ilan no, benzerler)
- **İlan Ver:** kategori → form → önizleme → yayınla
- Favoriler, son görüntülenenler
- **Admin:** CRUD, onay / gizleme, üye yönetimi

## Tech

Next.js 16 · TypeScript · Tailwind v4 · shadcn/ui
