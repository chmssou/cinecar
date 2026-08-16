import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, Locale, getDictionary } from "@/lib/i18n";
import { getSiteSettings } from "@/sanity/lib/fetch";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlobalControls } from "@/components/GlobalControls";
import { PageTransitionWrapper } from "@/components/PageTransitionWrapper";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) return {};

  const siteSettings = await getSiteSettings();
  const dict = getDictionary(locale as Locale);

  const businessName = siteSettings?.businessName || "CineCar";
  const defaultTitle =
    siteSettings?.defaultSEO?.title?.[locale] ||
    `${businessName} | ${locale === "ar" ? "معرض السيارات الفاخرة" : "Concessionnaire Automobile"}`;
  const defaultDesc =
    siteSettings?.defaultSEO?.description?.[locale] ||
    (locale === "ar"
      ? "تصفح أحدث السيارات المتوفرة للبيع والاستيراد بأفضل الأسعار"
      : "Découvrez notre sélection de véhicules disponibles et en arrivage");

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    title: {
      default: defaultTitle,
      template: `%s | ${businessName}`,
    },
    description: defaultDesc,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        ar: `${siteUrl}/ar`,
        fr: `${siteUrl}/fr`,
        "x-default": `${siteUrl}/ar`,
      },
    },
    openGraph: {
      title: defaultTitle,
      description: defaultDesc,
      url: `${siteUrl}/${locale}`,
      siteName: businessName,
      locale: locale === "ar" ? "ar_DZ" : "fr_FR",
      type: "website",
    },
  };
}

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const siteSettings = await getSiteSettings();
  const dict = getDictionary(locale as Locale);

  return (
    <div lang={locale} dir={dict.dir} className={`min-h-screen flex flex-col ${dict.fontClass}`}>
      <Navbar locale={locale as Locale} siteSettings={siteSettings} />
      <main className="flex-1 flex flex-col">
        <PageTransitionWrapper>{children}</PageTransitionWrapper>
      </main>
      <GlobalControls locale={locale as Locale} siteSettings={siteSettings} />
      <Footer locale={locale as Locale} siteSettings={siteSettings} />
    </div>
  );
}
