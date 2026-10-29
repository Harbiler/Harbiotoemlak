import Link from "next/link";
import { NAV_CATEGORIES } from "@/lib/categories";
import { BrandLogo } from "@/components/brand-logo";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[color-mix(in_oklab,#9d174d_20%,transparent)] bg-[linear-gradient(160deg,#4a1830_0%,#831843_48%,#be185d_100%)] text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <BrandLogo inverted wordmarkClassName="text-2xl sm:text-2xl" />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/65">
            Otomobil ve emlak odaklı sınıflandırılmış ilan sitesi. Güvenilir satıcılar, net
            kategoriler, tek adres.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
            Kategoriler
          </p>
          <ul className="mt-4 grid grid-cols-1 gap-2 text-sm text-white/80 sm:grid-cols-2 lg:grid-cols-1">
            {NAV_CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/kategori/${c.slug}`} className="transition hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
            Üyelik
          </p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>
              <Link href="/uye-ol" className="hover:text-white">
                Bireysel üye ol
              </Link>
            </li>
            <li>
              <Link href="/uye-ol" className="hover:text-white">
                Kurumsal (Galeri / Emlak)
              </Link>
            </li>
            <li>
              <Link href="/giris" className="hover:text-white">
                Giriş Yap
              </Link>
            </li>
            <li>
              <Link href="/ilan/yeni" className="hover:text-white">
                Ücretsiz İlan Ver
              </Link>
            </li>
            <li>
              <Link href="/giris?admin=1" className="hover:text-white">
                Admin Yönetim Paneli
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
            İletişim
          </p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>destek@harbidenbak.com</li>
            <li>0850 000 00 00</li>
            <li>Hafta içi 09:00–18:00</li>
            <li className="pt-2 text-white/50">Demo uygulama — gerçek destek hattı değildir.</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">
        © 2026 Harbiden Bak · Demo ilan sitesi · Veriler tarayıcınızda saklanır
      </div>
    </footer>
  );
}
