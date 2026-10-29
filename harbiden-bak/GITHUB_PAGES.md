# GitHub Pages notu

Repo hedefi: https://github.com/Harbiler/Harbidenbak.com  
Custom domain CNAME: `public/CNAME` → **www.harbidenbak.com**

## Önemli

Bu uygulama **Next.js App Router** (sunucu/SSR + dinamik rotalar). GitHub Pages yalnızca **statik** dosya sunar; `next start` / Vercel serverless burada çalışmaz.

**Önerilen yayın:** Vercel (veya benzeri) + domain `www.harbidenbak.com`.

## Pages ile denemek (opsiyonel)

1. `next.config.ts` içine `output: "export"` ve `images: { unoptimized: true }` ekleyin.
2. Dinamik rotalar (`/ilan/[id]`, `/kategori/[slug]`, …) için `generateStaticParams` ekleyin (client page’lerde sunucu sarmalayıcı gerekir).
3. Repo **Settings → Pages**: Source = GitHub Actions.
4. Workflow: `.github/workflows/pages.yml` (statik export build → `out/` → Pages).

Yeni kullanıcı ilanları yalnızca `localStorage`’da olduğu için Pages’te build-time dışı `/ilan/...` URL’leri 404 verebilir.

## Push / auth

Bu Cloud Agent ortamında `gh` oturumu ve `GH_TOKEN` / `GITHUB_TOKEN` yok. Push için:

```bash
gh auth login
# veya
export GH_TOKEN=ghp_...   # repo write scope
git remote add github https://github.com/Harbiler/Harbidenbak.com.git
git push -u github main
```
