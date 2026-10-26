# www.harbidenbak.com yayını

Bu ortamda Vercel hesabı bağlı değil; alan adı DNS’i de buradan yönetilemiyor.
Aşağıdaki adımlarla siteyi **www.harbidenbak.com** üzerinde kalıcı yayınlayın.

## 1) Geçici yayını sahiplen

Canlı önizleme (yaklaşık 60 dk geçerli):

- Site: https://prompt-beryl-61np7gz.tmp.now
- Sahiplen: https://vercel.com/claim-deployment?code=d6f577b8-8c1b-42cd-8256-8613c690c038

Claim sayfasında Vercel’e giriş yapıp deployment’ı hesabınıza alın.

## 2) Custom domain ekle

Vercel dashboard → Project → **Settings → Domains**:

1. `www.harbidenbak.com` ekleyin
2. `harbidenbak.com` ekleyin (www’ye yönlendirme önerilir)

## 3) DNS (alan adı sağlayıcınız)

| Tip | Ad  | Değer                          |
|-----|-----|--------------------------------|
| A   | @   | `76.76.21.21` (Vercel)         |
| CNAME | www | `cname.vercel-dns.com`       |

Veya Vercel’in Domain ekranında gösterdiği kayıtları birebir kullanın.

## 4) Sonraki deploy’lar

```bash
cd harbiden-bak
npx vercel login
npx vercel --prod
```

Domain bağlandıktan sonra production URL: https://www.harbidenbak.com
