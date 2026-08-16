import Link from "next/link";
import { getDictionary, Locale } from "@/lib/i18n";
import { getHomepageShowcaseData, getSiteSettings } from "@/sanity/lib/fetch";
import { LatestArrivalsShowcase } from "@/components/LatestArrivalsShowcase";
import { HeroMedia } from "@/components/HeroMedia";
import { urlFor } from "@/sanity/lib/image";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const currentLocale = locale as Locale;
  const dict = getDictionary(currentLocale);

  const [siteSettings, showcaseData] = await Promise.all([
    getSiteSettings(),
    getHomepageShowcaseData(6),
  ]);

  const latestCars = showcaseData?.vehicles || [];
  const totalAvailableCount = showcaseData?.totalAvailable || 0;

  const whatsappNumber = siteSettings?.whatsappNumber || "+213550000000";
  const primaryPhone = siteSettings?.phoneNumbers?.[0] || "+213 550 12 34 56";

  const isRtl = currentLocale === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  // Corporate Hero Media URLs (Derived strictly from Site Settings — NEVER from vehicle inventory)
  const heroImageUrl = siteSettings?.heroImage
    ? urlFor(siteSettings.heroImage).width(1920).height(1080).quality(95).url()
    : "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=2070&auto=format&fit=crop";

  const heroVideoUrl = siteSettings?.heroVideoFileUrl || siteSettings?.heroVideo || null;


  let heroEyebrow =
    siteSettings?.heroEyebrow?.[currentLocale] ||
    (currentLocale === "ar" ? "CINECAR إعلانات السيارات" : "CINECAR ANNONCES AUTOMOBILES");

  let heroTitle =
    siteSettings?.heroContent?.title?.[currentLocale] ||
    (currentLocale === "ar" ? "بيع وشراء بكل ثقة وأمان" : "AUTOMOBILES D'EXCEPTION.");

  if (currentLocale === "ar" && (!siteSettings?.heroContent?.title?.ar || siteSettings.heroContent.title.ar.includes("سيارات فاخرة"))) {
    heroTitle = "بيع وشراء بكل ثقة وأمان";
  }

  let heroSubtitle =
    siteSettings?.heroContent?.subtitle?.[currentLocale] ||
    (currentLocale === "ar"
      ? "وجهتك الموثوقة لبيع سيارتك أو العثور على السيارة التي تناسبك في الجزائر."
      : "Une sélection rigoureuse d'automobiles de prestige et d'importation dédiée.");

  if (currentLocale === "ar") {
    if (!siteSettings?.heroContent?.subtitle?.ar || siteSettings.heroContent.subtitle.ar !== "وجهتك الموثوقة لبيع سيارتك أو العثور على السيارة التي تناسبك في الجزائر.") {
      heroSubtitle = "وجهتك الموثوقة لبيع سيارتك أو العثور على السيارة التي تناسبك في الجزائر.";
    }
  }

  const heroCtaLabel =
    siteSettings?.heroContent?.ctaText?.[currentLocale] || dict.hero.viewInventory;

  const heroCtaUrl = siteSettings?.heroContent?.ctaUrl || `/${currentLocale}/cars`;

  return (
    <div className="flex flex-col bg-[#05080D] text-[#E0E3E6]">
      {/* 1. CORPORATE AUTOMOTIVE CINEMATIC HERO (88–95vh Desktop, 80vh Mobile) */}
      <section className="relative w-full h-[80vh] lg:h-[92vh] overflow-hidden flex flex-col justify-end">
        {/* Cinematic Automotive Video & Fallback Poster Layer */}
        <HeroMedia
          posterUrl={heroImageUrl}
          videoUrl={heroVideoUrl}
          altText={siteSettings?.businessName || "CINECAR"}
        />

        {/* Minimal Corporate Brand Overlay Statement */}
        <div className="relative z-10 mx-auto max-w-container px-gutter w-full pb-16 sm:pb-24">
          <div className="max-w-2xl space-y-4">
            <span className="animate-hero-fade-1 font-label-caps text-[11px] text-brand-blue uppercase tracking-[0.2em] block">
              {heroEyebrow}
            </span>

            <h1 className="animate-hero-fade-2 text-4xl sm:text-6xl font-extrabold text-white font-display uppercase tracking-tight leading-[0.95] drop-shadow-xl">
              {heroTitle}
            </h1>

            <p className="animate-hero-fade-3 text-xs sm:text-sm text-brand-muted tracking-wider drop-shadow max-w-lg">
              {heroSubtitle}
            </p>

            <div className="animate-hero-fade-4 pt-3">
              <Link
                href={heroCtaUrl}
                className="inline-flex items-center gap-2 font-label-caps text-xs text-white hover:text-brand-blue transition-colors uppercase tracking-widest border-b border-white/30 hover:border-brand-blue pb-1 group"
              >
                <span>{heroCtaLabel}</span>
                <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LATEST ARRIVALS SHOWCASE WITH CONDITIONAL VOIR PLUS */}
      <LatestArrivalsShowcase
        cars={latestCars}
        totalAvailableCount={totalAvailableCount}
        locale={currentLocale}
      />

      {/* 3. MINIMAL RESTRAINED EDITORIAL CTA SECTION */}
      <section id="contact" className="w-full scroll-mt-24 py-16 sm:py-24 bg-[#05080D] border-t border-white/5 relative overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-brand-blue/5 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-[680px] px-gutter text-center space-y-6">
          {/* Eyebrow, Heading & Subtitle */}
          <div className="space-y-3">
            <span className="font-label-caps text-[11px] text-brand-blue uppercase tracking-[0.2em] block font-semibold">
              {dict.homepageCta?.eyebrow || (currentLocale === "ar" ? "تواصل معنا" : "CONTACT")}
            </span>
            <h2 className="text-2xl sm:text-4xl text-white uppercase leading-tight font-extrabold font-display tracking-tight">
              {dict.homepageCta?.title || (currentLocale === "ar" ? "هل تبحث عن سيارة معينة؟" : "UNE VOITURE EN TÊTE ?")}
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted max-w-md mx-auto leading-relaxed">
              {dict.homepageCta?.subtitle || (currentLocale === "ar"
                ? "تصفح أحدث إعلاناتنا أو تواصل مباشرة مع فريق CINECAR."
                : "Découvrez nos annonces ou contactez directement CINECAR.")}
            </p>
          </div>

          {/* Two Restrained CTA Actions */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
            {/* Primary Action — View Announcements */}
            <Link
              href={`/${currentLocale}/cars`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-blue hover:bg-brand-blue-hover text-white font-label-caps text-xs py-3.5 px-6 rounded-md transition-colors uppercase tracking-widest font-semibold shadow-lg shadow-brand-blue/10 group"
            >
              <span>{dict.homepageCta?.viewCars || (currentLocale === "ar" ? "عرض الإعلانات" : "VOIR LES ANNONCES")}</span>
              <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Link>

            {/* Secondary Action — Contact via WhatsApp */}
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-surface hover:bg-brand-surface-high text-white border border-white/15 hover:border-white/30 font-label-caps text-xs py-3.5 px-6 rounded-md transition-colors uppercase tracking-widest font-semibold group"
            >
              <span>{dict.homepageCta?.contactUs || (currentLocale === "ar" ? "تواصل معنا" : "NOUS CONTACTER")}</span>
              <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
