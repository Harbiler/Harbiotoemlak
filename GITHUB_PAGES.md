# GitHub Pages — Harbiden Bak

Repo: https://github.com/Harbiler/Harbiotoemlak  
Custom domain: `public/CNAME` → **www.harbidenbak.com**  
Hosting: Cloudflare DNS (DNS only) + GitHub Pages. **Vercel kullanılmaz.**

## Static export

- `next.config.ts`: `output: "export"`, `trailingSlash`, `images.unoptimized`
- Dinamik rotalar `generateStaticParams` ile seed ID / kategori slug üretir
- Workflow: `.github/workflows/pages.yml` → `npm ci` → `npm run build` → `out/` → deploy-pages

## DNS

Cloudflare’de proxy **kapalı** (gri bulut): apex A → `185.199.108–111.153`, `www` CNAME → `Harbiler.github.io`.
