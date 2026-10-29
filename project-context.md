# Harbiden Bak — resmi proje tanımı

**Project:** Harbiden Bak  
**Ürün / marka adı:** Harbiden Bak  
**Eski geçici ad:** Habiden (kullanma)  
**Kayıt:** 26 Ekim 2026, 05:36 (Europe/Istanbul) — proje olarak kaydedildi; marka Harbiden Bak olarak sabitlendi  
**Son kayıt:** 27 Ekim 2026, 02:44 (Europe/Istanbul) — değişiklik yok; DNS `YAYIN.md` + Context  


**İndirme:** [harbiden-bak.zip](/cursor/stores/self/docs/harbiden-bak.zip) — `npm install` + `npm run dev`  
**Yayın:** Hedef Cloudflare + **GitHub Pages** (Vercel yok). Domain: `www.harbidenbak.com`.

### DNS (Cloudflare — DNS only / gri bulut)

| Tip | Ad | Değer |
|-----|-----|--------|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `Harbiler.github.io` (repo: `Harbiler/harbidenbak.com`) |

Vercel A/CNAME kayıtlarını kaldır. GitHub Pages → Custom domain + repo `CNAME`.

## Özet

**Harbiden Bak**, Türkiye için modern bir **ilan sitesidir**: otomobil, emlak ve çok kategorili sınıflandırılmış ilanlar. Arayüz ve metinler Türkçe. Akış: ana sayfa → kategori / arama → ilan detayı → üyelik → İlan Ver → admin moderasyonu.

## Üyelik

| Tip | Açıklama |
| --- | --- |
| Bireysel | Kişisel hesap |
| Kurumsal → Galeri | Vasıta galerisi |
| Kurumsal → Emlak | Emlak ofisi |

Giriş / Üye Ol zorunlu akışlar; demo / mock auth kabul.

## Admin

Giriş Yap üzerinden **Admin Yönetim Paneli**. Admin her şeyi kontrol eder: ilan CRUD, kullanıcılar, gizleme. İlanlar ve evcil hayvan hoteli başvuruları **otomatik onaylanır** (beklemede kalanlar açılışta onaylanır).

## İlan sitesi özellikleri

- Global arama; kategori gezintisi
- Filtre: il / ilçe, fiyat; sıralama (en yeni, fiyat ↑↓)
- İlan kartı: foto, başlık, fiyat, konum, tarih, satıcı rozeti (Bireysel / Galeri / Emlak)
- Detay: galeri, özellik grid’i, açıklama, satıcı kartı, ilan no, benzer ilanlar
- **İlan Ver:** kategori → form → önizleme → yayınla
- Favoriler (mock); boş / yükleniyor / hata durumları
- Modern arayüz; mobil + masaüstü
- Ana sayfa: ortada logo / “Harbiden Bak” yazısı yok; üstte kalp/büyüteç yok; **İlan ara** ve **Ücretsiz ilan ver**; kategoriler; pembe hero / kurumsal üye kapsayıcı yok
- Tema: pembe vurgular (pembe hero bloğu yok)
- Evcil hayvan otelleri: metin/arama paneli yok; konum (GPS veya ilçe) + **15 km** mesafe; kartlarda mesafe
- Evcil Hayvan Hoteli Ol başvurusu: zorunlu **Adres** (admin’de görünür)
- Evcil hayvan oteli üyeleri: **Müsait / Dolu** durumunu Hesabım veya ilan sayfasından değiştirir; kartlarda görünür
- Bakıcı Olmak İstiyorum: isim, mail, telefon, ikametgâh, sabıka kaydı, profil resmi (güneş gözlüğü olmasın); otomatik onay
- Emlak arama: sade; satılık/kiralık, konut tipi, il, ilçe, oda, bina yaşı **4’lü yan yana**; ilçe yalnızca seçili ile ait; ekstra “Daha fazla filtre” altında; tüm yazılar Türkçe
- Vasıta detaylı arama: Marka · Model · Yakıt · Vites (ve diğerleri) **4’lü yan yana**
- Vasıta alt kategorileri (alt alta): Otomobil, Elektrikli Araçlar, Arazi/SUV & Pickup, Motorsiklet, Minivan & Panelvan, Ticari, Kiralık, Deniz, Hasarlı, Engelli Plakalı, Karavan, Klasik, Hava, ATV, UTV — her tipte marka ve seçili markanın modelleri
- Preview: http://127.0.0.1:43127 (bu Project makinesi)

## Kategoriler (üst menü / ana sayfa)

1. Emlak  
2. Vasıta (Motorsiklet alt kategori olarak burada)  
3. Yedek Parça & Aksesuar  
4. İş Makineleri & Sanayi  
5. Ustalar ve Hizmetler  
6. Evcil Hayvan Otelleri  
7. Yardımcı Arayanlar  
8. Bakıcı Arayanlar  
9. İş İlanları  

Ana menüden kaldırıldı: Motorsiklet (ayrı), Hayvanlar Alemi, Özel Ders Verenler.

Ana sayfa: Bakıcı Arayanlar ile İş Makineleri yer değiştirdi (son düzenleme).

## Teknik

Next.js (App Router) · TypeScript · Tailwind · shadcn/ui · seed demo ilanlar ve hesaplar

## Demo (kurulum sonrası)

- Uygulama (worker VM): `http://127.0.0.1:43127` — masaüstü: `[Try Live](bc-0312cda0-1022-5a4e-ae0a-a01a6a9b6f0d#desktop)`
- Admin: `admin@harbidenbak.com` / `admin123`
- Bireysel: `ayse@ornek.com` / `demo123`
- Galeri: `galeri@ornek.com` / `demo123`
- Emlak: `emlak@ornek.com` / `demo123`
- Branch: `cursor/habiden-classifieds-6f0d` (PR: gerçek repo yokken açılamadı)

## Bağlantılar

- Yan panel: [Harbiden Bak özet](https://cursor.com/canvas/store-32c0e3f3-d840-4b8a-ba03-a51d95461d14/90601e0f-a160-4249-b8c4-5ee804117361)
- Kurulum worker: `bc-0312cda0-1022-5a4e-ae0a-a01a6a9b6f0d`
