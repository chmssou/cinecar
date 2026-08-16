"use client";

import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { CarCard } from "@/components/CarCard";
import { getDictionary, Locale } from "@/lib/i18n";

interface LatestArrivalsShowcaseProps {
  cars: any[];
  totalAvailableCount?: number;
  locale: Locale;
}

export function LatestArrivalsShowcase({
  cars,
  totalAvailableCount,
  locale,
}: LatestArrivalsShowcaseProps) {
  const dict = getDictionary(locale);

  const isRtl = locale === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const sectionTitle = (dict as any).showcase?.title || (locale === "ar" ? "آخر الإضافات" : "Dernières arrivées");
  const topLinkText = (dict as any).showcase?.viewAll || (locale === "ar" ? "عرض جميع الإعلانات" : "VOIR TOUTES LES ANNONCES");
  const voirPlusText = (dict as any).showcase?.voirPlus || (locale === "ar" ? "عرض المزيد" : "Voir plus");

  // Show maximum 6 available vehicles
  const displayedCars = cars.slice(0, 6);

  // Requirement 3: VOIR PLUS is ONLY rendered if totalAvailableCount >= 7
  // Fallback to cars.length if totalAvailableCount is not provided
  const availableCount = totalAvailableCount !== undefined ? totalAvailableCount : cars.length;
  const showVoirPlus = availableCount >= 7;

  return (
    <section className="relative mx-auto max-w-container px-gutter w-full pt-16 pb-20 sm:pt-24 sm:pb-28">
      {/* Editorial Section Header */}
      <div className="flex items-end justify-between border-b border-white/10 pb-5 mb-10">
        <div>
          <h2 className="text-section-title text-2xl sm:text-3xl text-white uppercase font-extrabold font-display tracking-tight">
            {sectionTitle}
          </h2>
        </div>
        <Link
          href={`/${locale}/cars`}
          className="flex items-center gap-1.5 font-label-caps text-xs text-brand-blue hover:text-brand-blue-hover transition-colors uppercase font-semibold group"
        >
          <span>{topLinkText}</span>
          <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
        </Link>
      </div>

      {/* Grid of 6 Available Vehicle Cards */}
      {displayedCars.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayedCars.map((car, index) => (
            <div
              key={car._id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${(index % 3) * 100}ms` }}
            >
              <CarCard car={car} locale={locale} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-white/10 rounded-md">
          <p className="text-xs font-label-caps text-brand-muted tracking-widest uppercase">
            {locale === "ar" ? "لا توجد إعلانات متوفرة حالياً" : "AUCUNE ANNONCE DISPONIBLE POUR LE MOMENT"}
          </p>
        </div>
      )}

      {/* Direct Navigation "VOIR PLUS" / "عرض المزيد" Link — ONLY rendered if total available count >= 7 */}
      {showVoirPlus && (
        <div className="mt-14 flex justify-center">
          <Link
            href={`/${locale}/cars`}
            className="inline-flex items-center gap-2 font-label-caps text-xs text-white hover:text-brand-blue transition-colors uppercase tracking-widest border-b border-white/20 hover:border-brand-blue pb-1 group font-semibold"
          >
            <span>{voirPlusText}</span>
            <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </Link>
        </div>
      )}
    </section>
  );
}
