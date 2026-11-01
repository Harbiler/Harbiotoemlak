export type InfoPageDef = {
  slug: string;
  title: string;
  description: string;
  paragraphs: string[];
};

export const CORPORATE_LINKS: { title: string; href: string }[] = [
  { title: "Hakkımızda", href: "/hakkimizda" },
  { title: "Sürdürülebilirlik", href: "/surdurulebilirlik" },
  { title: "İnsan Kaynakları", href: "/insan-kaynaklari" },
  { title: "İletişim", href: "/iletisim" },
];

export const LEGAL_LINKS: { title: string; href: string }[] = [
  { title: "Gizlilik ve Kullanım", href: "/gizlilik-ve-kullanim" },
  { title: "Güvenli Alışverişin İpuçları", href: "/guvenli-alisveris" },
  { title: "Sözleşmeler ve Kurallar", href: "/sozlesmeler-ve-kurallar" },
  { title: "Hesap Sözleşmesi", href: "/hesap-sozlesmesi" },
  { title: "Kullanım Koşulları", href: "/kullanim-kosullari" },
  { title: "Kişisel Verilerin Korunması", href: "/kisisel-verilerin-korunmasi" },
  { title: "Çerez Yönetimi", href: "/cerez-yonetimi" },
  { title: "Yardım ve İşlem Rehberi", href: "/yardim" },
];

const pages: InfoPageDef[] = [
  {
    slug: "hakkimizda",
    title: "Hakkımızda",
    description: "Harbiden Bak hakkında kısa bilgi.",
    paragraphs: [
      "Harbiden Bak; otomobil, emlak ve sınıflandırılmış ilanları bir araya getiren yerel bir ilan platformudur.",
      "Amacımız satıcılarla alıcıları sade, güvenilir ve Türkçe bir arayüzde buluşturmaktır.",
    ],
  },
  {
    slug: "surdurulebilirlik",
    title: "Sürdürülebilirlik",
    description: "Harbiden Bak sürdürülebilirlik yaklaşımı.",
    paragraphs: [
      "Dijital ilanlarla gereksiz basılı materyali azaltmayı ve ikinci el alışverişi kolaylaştırmayı hedefliyoruz.",
      "Üyelik ve ilan verileri tarayıcınızda tutulur; gereksiz sunucu yükünü düşük tutmaya çalışırız.",
    ],
  },
  {
    slug: "insan-kaynaklari",
    title: "İnsan Kaynakları",
    description: "Harbiden Bak kariyer ve iş birliği.",
    paragraphs: [
      "Açık pozisyonlar ve iş birliği talepleri için destek adresimize yazabilirsiniz.",
      "Başvurularda ad, iletişim bilgisi ve kısa bir özgeçmiş yeterli olur.",
    ],
  },
  {
    slug: "iletisim",
    title: "İletişim",
    description: "Harbiden Bak destek iletişimi.",
    paragraphs: [
      "Destek ve sorularınız için tek iletişim kanalımız e-postadır:",
      "harbidenbakdestek@hotmail.com",
    ],
  },
  {
    slug: "gizlilik-ve-kullanim",
    title: "Gizlilik ve Kullanım",
    description: "Gizlilik ve kullanım özeti.",
    paragraphs: [
      "Harbiden Bak’ı kullanarak site kurallarına ve ilgili sözleşmelere uyacağınızı kabul etmiş olursunuz.",
      "Kişisel verilerinizin işlenmesi, çerezler ve hesap kuralları için ilgili alt sayfaları inceleyin.",
    ],
  },
  {
    slug: "guvenli-alisveris",
    title: "Güvenli Alışverişin İpuçları",
    description: "Güvenli alışveriş için öneriler.",
    paragraphs: [
      "Ödemeyi yüz yüze ve ürünü gördükten sonra yapın; havale veya kapora için acele etmeyin.",
      "İlan sahibinin iletişim bilgilerini doğrulayın, şüpheli teklifleri bildirin.",
      "Araç ve emlak işlemlerinde resmi belgeleri mutlaka kontrol edin.",
    ],
  },
  {
    slug: "sozlesmeler-ve-kurallar",
    title: "Sözleşmeler ve Kurallar",
    description: "Site sözleşmeleri ve kurallar.",
    paragraphs: [
      "İlan içeriği yasalara uygun olmalı; yanıltıcı, müstehcen veya izinsiz içerik yayınlanamaz.",
      "Kurallara aykırı ilanlar kaldırılabilir; tekrarlayan ihlallerde hesap kısıtlanabilir.",
    ],
  },
  {
    slug: "hesap-sozlesmesi",
    title: "Hesap Sözleşmesi",
    description: "Üyelik hesap sözleşmesi özeti.",
    paragraphs: [
      "Hesabınızı oluştururken verdiğiniz bilgilerin doğru ve güncel olması gerekir.",
      "Hesap güvenliğinden siz sorumlusunuz; şifrenizi başkalarıyla paylaşmayın.",
    ],
  },
  {
    slug: "kullanim-kosullari",
    title: "Kullanım Koşulları",
    description: "Harbiden Bak kullanım koşulları.",
    paragraphs: [
      "Siteyi yalnızca yasal amaçlarla ve diğer kullanıcıların haklarına saygı göstererek kullanın.",
      "Otomatik veri toplama, spam ve sisteme zarar verecek girişimler yasaktır.",
    ],
  },
  {
    slug: "kisisel-verilerin-korunmasi",
    title: "Kişisel Verilerin Korunması",
    description: "Kişisel verilerin korunması hakkında bilgilendirme.",
    paragraphs: [
      "Üyelik ve ilan bilgileri tarayıcınızda saklanır; üçüncü taraflarla pazarlama amacıyla paylaşılmaz.",
      "KVKK kapsamındaki talepleriniz için harbidenbakdestek@hotmail.com adresine yazabilirsiniz.",
    ],
  },
  {
    slug: "cerez-yonetimi",
    title: "Çerez Yönetimi",
    description: "Çerez kullanımı hakkında bilgi.",
    paragraphs: [
      "Harbiden Bak temel site işlevleri için tarayıcı depolaması kullanır.",
      "Tarayıcı ayarlarınızdan site verilerini temizleyerek bu kayıtları silebilirsiniz.",
    ],
  },
  {
    slug: "yardim",
    title: "Yardım ve İşlem Rehberi",
    description: "Yardım ve işlem rehberi.",
    paragraphs: [
      "Üye olmak için Üye Ol, ilan vermek için Ücretsiz İlan Ver adımlarını izleyin.",
      "İlanlarınızı Hesabım sayfasından görüntüleyebilir ve düzenleyebilirsiniz.",
      "Takıldığınız noktada harbidenbakdestek@hotmail.com adresine yazın.",
    ],
  },
];

export function getInfoPage(slug: string): InfoPageDef | undefined {
  return pages.find((p) => p.slug === slug);
}

export const ALL_INFO_PAGES = pages;
