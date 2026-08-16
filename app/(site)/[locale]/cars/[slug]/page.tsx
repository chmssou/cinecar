import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  formatNumber,
  formatPrice,
  getDictionary,
  Locale,
} from "@/lib/i18n";
import {
  getCarBySlug,
  getSimilarCars,
  getSiteSettings,
} from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import { Gallery } from "@/components/Gallery";
import { CarCard } from "@/components/CarCard";
import { VideoPlayer } from "@/components/VideoPlayer";
import { StickyMobileContact } from "@/components/StickyMobileContact";
import { generateWhatsAppUrl } from "@/lib/whatsapp";
import { getSocialLinks } from "@/lib/social";

import {
  Share2,
  Check,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const currentLocale = locale as Locale;
  const car = await getCarBySlug(slug);

  if (!car) {
    const isAr = currentLocale === "ar";
    return {
      title: isAr ? "سيارة غير متوفرة | CINECAR" : "Véhicule non disponible | CINECAR",
    };
  }

  const siteSettings = await getSiteSettings();
  const businessName = siteSettings?.businessName || "CineCar";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const title =
    car.seoTitle?.[currentLocale] ||
    `${car.displayTitle} | ${businessName}`;

  const description =
    car.seoDescription?.[currentLocale] ||
    car.description?.[currentLocale] ||
    `${car.displayTitle} - ${car.year} | ${car.mileage ? formatNumber(car.mileage) + " km" : ""}`;

  const ogImageUrl = car.images && car.images.length > 0
    ? urlFor(car.images[0]).width(1200).height(630).fit("crop").url()
    : null;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/${currentLocale}/cars/${slug}`,
      languages: {
        ar: `${siteUrl}/ar/cars/${slug}`,
        fr: `${siteUrl}/fr/cars/${slug}`,
        "x-default": `${siteUrl}/ar/cars/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${currentLocale}/cars/${slug}`,
      siteName: businessName,
      images: ogImageUrl ? [{ url: ogImageUrl, width: 1200, height: 630 }] : [],
    },
  };
}

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const currentLocale = locale as Locale;
  const dict = getDictionary(currentLocale);

  const car = await getCarBySlug(slug);
  if (!car) {
    notFound();
  }

  const siteSettings = await getSiteSettings();
  const similarCars = await getSimilarCars(
    car._id,
    car.brand?.slug?.current,
    car.model?.slug?.current,
    car.price,
    4
  );

  const whatsappNumber = siteSettings?.whatsappNumber || "+213550000000";
  const primaryPhone = siteSettings?.phoneNumbers?.[0] || "+213 550 12 34 56";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const currentVehicleUrl = `${siteUrl}/${currentLocale}/cars/${slug}`;

  const isRtl = currentLocale === "ar";
  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight;

  const descriptionText = car.description?.[currentLocale] || "";

  const brandName = car.brand?.name || car.displayTitle.split(" ")[0];
  const fuelText = car.fuel ? (dict.fuelTypes as any)[car.fuel] || car.fuel : null;
  const transmissionText = car.transmission
    ? (dict.transmissionTypes as any)[car.transmission] || car.transmission
    : null;

  const specParts = [
    car.year ? `${car.year}` : null,
    car.mileage !== undefined && car.mileage !== null ? `${formatNumber(car.mileage)} KM` : null,
    transmissionText ? `${transmissionText}` : null,
  ].filter(Boolean);

  const secondarySpecLine = specParts.join(" · ");

  const statusTextMap: Record<string, string> = {
    available: dict.status.available,
    not_available: dict.status.not_available,
    reserved: dict.status.reserved,
    sold: dict.status.sold,
  };

  const statusColorMap: Record<string, string> = {
    available: "text-emerald-400",
    not_available: "text-rose-400",
    reserved: "text-amber-400",
    sold: "text-rose-400",
  };

  // Full Specifications List
  const specItems = [
    { label: dict.specs.brand, value: car.brand?.name },
    { label: dict.specs.model, value: car.model?.name },
    { label: dict.specs.trim, value: car.trim },
    { label: dict.specs.year, value: car.year },
    {
      label: dict.specs.mileage,
      value: car.mileage !== undefined ? `${formatNumber(car.mileage)} km` : null,
    },
    {
      label: dict.specs.fuel,
      value: fuelText,
    },
    {
      label: dict.specs.transmission,
      value: transmissionText,
    },
    { label: dict.specs.engine, value: car.engine },
    {
      label: dict.specs.engineCapacity,
      value: car.engineCapacity ? `${formatNumber(car.engineCapacity)} cc` : null,
    },
    {
      label: dict.specs.power,
      value: car.power ? `${formatNumber(car.power)} HP` : null,
    },
    { label: dict.specs.driveType, value: car.driveType?.toUpperCase() },
    { label: dict.specs.exteriorColor, value: car.exteriorColor },
    { label: dict.specs.interiorColor, value: car.interiorColor },
    { label: dict.specs.doors, value: car.doors },
    { label: dict.specs.seats, value: car.seats },
    {
      label: dict.specs.condition,
      value: car.condition ? (dict.conditionTypes as any)[car.condition] || car.condition : null,
    },
    { label: dict.specs.origin, value: car.origin },
    { label: dict.specs.registration, value: car.registration },
  ].filter((item) => item.value !== undefined && item.value !== null && item.value !== "");

  // Structured Data
  const jsonLdVehicle = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: car.displayTitle,
    description: descriptionText || car.displayTitle,
    modelDate: car.year,
    mileageFromOdometer: car.mileage
      ? { "@type": "QuantitativeValue", value: car.mileage, unitCode: "KMT" }
      : undefined,
    fuelType: car.fuel,
    vehicleTransmission: car.transmission,
    offers: car.showPrice && car.price
      ? {
          "@type": "Offer",
          price: car.price,
          priceCurrency: car.currency || "DZD",
          availability:
            car.salesStatus === "available"
              ? "https://schema.org/InStock"
              : car.salesStatus === "reserved"
              ? "https://schema.org/LimitedAvailability"
              : "https://schema.org/OutOfStock",
        }
      : undefined,
  };

  return (
    <div className="mx-auto max-w-5xl px-gutter pt-24 pb-24 sm:pb-28">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdVehicle) }}
      />

      {/* Breadcrumbs Navigation */}
      <nav className="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-2 font-label-caps text-[11px] uppercase tracking-wider text-white/50">
          <Link href={`/${currentLocale}`} className="hover:text-white transition-colors">
            {dict.nav.home}
          </Link>
          <ChevronIcon className="h-3.5 w-3.5" />
          <Link href={`/${currentLocale}/cars`} className="hover:text-white transition-colors">
            {dict.nav.cars}
          </Link>
          <ChevronIcon className="h-3.5 w-3.5" />
          <span className="text-white font-semibold truncate max-w-xs sm:max-w-md">
            {car.displayTitle}
          </span>
        </div>
      </nav>

      {/* Vehicle Identity Header (Full Width Editorial) */}
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-white/10 pb-8">
        <div className="space-y-2">
          {/* Brand Label */}
          <span className="font-label-caps text-xs font-bold uppercase tracking-[0.25em] text-brand-blue block">
            {brandName}
          </span>

          {/* Vehicle Name */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display uppercase tracking-tight">
            <span dir="auto">{car.displayTitle}</span>
          </h1>
        </div>

        {/* Pricing & Status Block */}
        <div className="flex flex-col sm:items-end space-y-1">
          {car.showPrice && car.price ? (
            <>
              {car.oldPrice && car.oldPrice > car.price && (
                <span className="font-mono text-xs text-white/40 line-through" dir="ltr">
                  {formatPrice(car.oldPrice, car.currency, currentLocale)}
                </span>
              )}
              <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-display" dir="ltr">
                {formatPrice(car.price, car.currency, currentLocale)}
              </span>
            </>
          ) : (
            <span className="font-label-caps text-sm font-bold text-brand-blue uppercase tracking-widest">
              {dict.status.contactForPrice}
            </span>
          )}

          <div className="flex items-center gap-2 font-label-caps text-[11px] uppercase tracking-wider pt-1">
            <span className={`font-semibold ${statusColorMap[car.salesStatus] || statusColorMap.available}`}>
              {statusTextMap[car.salesStatus] || dict.status.available}
            </span>
            <span className="text-white/20">•</span>
            <span className="text-white/50 font-mono text-[10px]">
              #{car.stockNumber || "STOCK"}
            </span>
          </div>
        </div>
      </header>

      {/* Main Vehicle Showcase Centerpiece */}
      <div className="space-y-12">
        {/* Large Hero Gallery */}
        <section aria-label="Vehicle Gallery">
          <Gallery images={car.images} displayTitle={car.displayTitle} locale={currentLocale} />
        </section>

        {/* Key Specification Strip (4 Equal Columns with Thin Vertical Separators) */}
        <section className="grid grid-cols-2 gap-y-6 gap-x-4 sm:grid-cols-4 border-y border-white/10 py-6">
          <div className="space-y-1 sm:pe-4 sm:border-e border-white/10">
            <span className="block font-label-caps text-[10px] uppercase tracking-widest text-white/50">
              {dict.specs.year}
            </span>
            <span className="text-base sm:text-lg font-bold text-white uppercase font-display">
              {car.year || "-"}
            </span>
          </div>

          <div className="space-y-1 sm:px-4 sm:border-e border-white/10">
            <span className="block font-label-caps text-[10px] uppercase tracking-widest text-white/50">
              {dict.specs.mileage}
            </span>
            <span className="text-base sm:text-lg font-bold text-white uppercase font-display">
              {car.mileage !== undefined ? `${formatNumber(car.mileage)} km` : "-"}
            </span>
          </div>

          <div className="space-y-1 sm:px-4 sm:border-e border-white/10">
            <span className="block font-label-caps text-[10px] uppercase tracking-widest text-white/50">
              {dict.specs.fuel}
            </span>
            <span className="text-base sm:text-lg font-bold text-white uppercase font-display truncate block">
              {fuelText || "-"}
            </span>
          </div>

          <div className="space-y-1 sm:ps-4">
            <span className="block font-label-caps text-[10px] uppercase tracking-widest text-white/50">
              {dict.specs.transmission}
            </span>
            <span className="text-base sm:text-lg font-bold text-white uppercase font-display truncate block">
              {transmissionText || "-"}
            </span>
          </div>
        </section>

        {/* Editorial Description */}
        {descriptionText && (
          <section className="max-w-3xl space-y-3">
            <h2 className="font-label-caps text-xs font-bold text-brand-blue uppercase tracking-[0.2em]">
              {dict.details.description}
            </h2>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed whitespace-pre-line font-sans">
              {descriptionText}
            </p>
          </section>
        )}

        {/* Full Specifications Section */}
        <section className="space-y-6 pt-4 border-t border-white/10">
          <h2 className="font-label-caps text-xs font-bold text-white uppercase tracking-[0.2em]">
            {dict.details.keySpecs}
          </h2>

          <div className="grid grid-cols-1 gap-x-12 gap-y-1 sm:grid-cols-2">
            {specItems.map((spec, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-white/5 py-3 font-label-caps text-xs"
              >
                <span className="text-white/50 uppercase tracking-wider">{spec.label}</span>
                <span className="font-bold text-white uppercase tracking-wide">{spec.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Features & Options */}
        {car.features && car.features.length > 0 && (
          <section className="space-y-6 pt-4 border-t border-white/10">
            <h2 className="font-label-caps text-xs font-bold text-white uppercase tracking-[0.2em]">
              {dict.details.features}
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {car.features.map((featKey: string) => {
                const label = (dict.features as any)[featKey] || featKey;
                return (
                  <div key={featKey} className="flex items-center gap-3 font-label-caps text-xs uppercase tracking-wider text-white/90">
                    <Check className="h-4 w-4 text-brand-blue shrink-0" strokeWidth={2} />
                    <span>{label}</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Video Presentation */}
        {car.videoUrl && (
          <section className="space-y-6 pt-4 border-t border-white/10">
            <h2 className="font-label-caps text-xs font-bold text-white uppercase tracking-[0.2em]">
              {dict.details.video}
            </h2>
            <div className="overflow-hidden rounded-[2px] bg-[#05080D]">
              <VideoPlayer url={car.videoUrl} title={car.displayTitle} />
            </div>
          </section>
        )}

        {/* Similar Vehicles Showcase */}
        {similarCars && similarCars.length > 0 && (
          <section className="pt-12 border-t border-white/10 space-y-8">
            <div className="flex flex-col gap-1">
              <span className="font-label-caps text-xs font-bold text-brand-blue uppercase tracking-[0.2em]">
                {dict.details.similarCars}
              </span>
              <h2 className="text-2xl font-extrabold text-white font-display uppercase tracking-tight">
                {currentLocale === "ar" ? "تشكيلة مختارة لك" : "SÉLECTION RECOMMANDÉE"}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {similarCars.map((simCar) => (
                <CarCard key={simCar._id} car={simCar} locale={currentLocale} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky Mobile Contact Actions (WhatsApp + Appeler) */}
      <StickyMobileContact
        locale={currentLocale}
        whatsappNumber={whatsappNumber}
        phoneNumber={primaryPhone}
        car={car}
      />
    </div>
  );
}
