# www.harbidenbak.com yayını

Bu ortamda Vercel hesabı bağlı değil; alan adı DNS’i Cloudflare’de ve buradan yönetilemiyor.
Aşağıdaki adımlarla siteyi **www.harbidenbak.com** üzerinde kalıcı yayınlayın.

## Durum (28 Eki 2026, Europe/Istanbul)

| Hedef | Durum |
|-------|--------|
| Geçici Vercel URL | Canlı (~60 dk) |
| `www.harbidenbak.com` | **Çalışmıyor** — DNS Cloudflare proxy (A: `104.21.64.195`, `172.67.154.218`); HTTPS **403** `cf-mitigated: challenge`. Vercel A/CNAME değil. |
| Domain attach | Engelli — `vercel whoami` → Logged out; `VERCEL_TOKEN` yok |

## 1) Geçici yayını sahiplen

Canlı önizleme (yaklaşık 60 dk geçerli; **Europe/Istanbul 23:50 civarı** doluyor):

- Site: https://express-perseus-zy3zdnl.tmp.now
- Sahiplen: https://vercel.com/claim-deployment?code=12492454-e84b-4c47-9b0f-fd7d67887783

Claim sayfasında Vercel’e giriş yapıp deployment’ı hesabınıza alın.

## 2) Custom domain ekle

Vercel dashboard → Project → **Settings → Domains**:

1. `www.harbidenbak.com` ekleyin
2. `harbidenbak.com` ekleyin (www’ye yönlendirme önerilir)

## 3) DNS (Cloudflare → Vercel)

NS şu an Cloudflare (`anuj.ns.cloudflare.com`, `donna.ns.cloudflare.com`).
Cloudflare DNS’te proxy’yi kapatın (DNS only / gri bulut) veya kayıtları Vercel’e çevirin:

| Tip | Ad  | Değer                          |
|-----|-----|--------------------------------|
| A   | @   | `76.76.21.21` (Vercel)         |
| CNAME | www | `cname.vercel-dns.com`       |

Veya Vercel’in Domain ekranında gösterdiği kayıtları birebir kullanın.

## 4) Sonraki deploy’lar

```bash
cd harbiden-bak
npx vercel login
# veya: export VERCEL_TOKEN=...
npx vercel --prod
```

Domain bağlandıktan sonra production URL: https://www.harbidenbak.com
