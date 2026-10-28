# www.harbidenbak.com yayını

Bu ortamda Vercel hesabı bağlı değil; alan adı DNS’i Cloudflare’de ve buradan yönetilemiyor.
Aşağıdaki adımlarla siteyi **www.harbidenbak.com** üzerinde kalıcı yayınlayın.

## Durum (28 Eki 2026, Europe/Istanbul ~23:00)

| Hedef | Durum |
|-------|--------|
| Geçici Vercel URL | Canlı: https://express-perseus-zy3zdnl.tmp.now (~23:50’ye kadar) |
| DNS `www` / apex | **Hazır** — `www` → `cname.vercel-dns.com`; apex A → `76.76.21.21` |
| `www.harbidenbak.com` HTTPS | **Çalışmıyor** — TLS yok; HTTP **404** `DEPLOYMENT_NOT_FOUND` (domain henüz bir Vercel projesine bağlı değil) |
| Domain attach | **Hesap şart** — bu ortamda `vercel` Logged out; anonymous deploy custom domain bağlayamaz |

## 1) Projeyi hesabınıza alın (zorunlu adım)

Anonim tmp URL claim olmadan kalıcı olmaz ve www’ye bağlanamaz.

- Site (geçici): https://express-perseus-zy3zdnl.tmp.now
- Sahiplen (isterseniz): https://vercel.com/claim-deployment?code=12492454-e84b-4c47-9b0f-fd7d67887783
- veya: `npx vercel login` → `npx vercel --prod`

## 2) Custom domain ekle

Vercel dashboard → Project → **Settings → Domains**:

1. `www.harbidenbak.com` ekleyin
2. `harbidenbak.com` ekleyin (www’ye yönlendirme önerilir)

DNS zaten Vercel’e dönük; domain eklenince SSL otomatik çıkar.

## 3) DNS (doğrulandı)

| Tip | Ad  | Değer                          | Not |
|-----|-----|--------------------------------|-----|
| A   | @   | `76.76.21.21`                  | OK |
| CNAME | www | `cname.vercel-dns.com`       | OK |

## 4) Sonraki deploy’lar

```bash
cd harbiden-bak
npx vercel login
# veya: export VERCEL_TOKEN=...
npx vercel --prod
```

Domain bağlandıktan sonra production URL: https://www.harbidenbak.com
