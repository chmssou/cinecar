"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { CarCard } from "@/components/CarCard";
import { Locale } from "@/lib/i18n";

interface LatestArrivalsShowcaseProps {
  cars: any[];
  locale: Locale;
}

export function LatestArrivalsShowcase({ cars, locale }: LatestArrivalsShowcaseProps) {
  const [visibleCount, setVisibleCount] = useState(3);
  const [loading, setLoading] = useState(false);

  const isRtl = locale === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const sectionTitle = locale === "ar" ? "آخر الإضافات" : "DERNIÈRES ARRIVÉES";
  const topLinkText = locale === "ar" ? "عرض جميع الإعلانات" : "VOIR TOUTES LES ANNONCES";
  const showMoreText = locale === "ar" ? "عرض المزيد" : "VOIR PLUS";

  // Maximum vehicles allowed on the Homepage section is 9
  const maxCars = Math.min(cars.length, 9);
  const visibleCars = cars.slice(0, visibleCount);
  const hasMore = visibleCount < maxCars;

  const handleShowMore = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 3, maxCars));
      setLoading(false);
    }, 150);
  };

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

      {/* Grid of Vehicle Cards with Progressive Stagger Reveal */}
      {visibleCars.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleCars.map((car, index) => (
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

      {/* Progressive Reveal "VOIR PLUS" Button */}
      {hasMore && (
        <div className="mt-14 flex justify-center">
          <button
            type="button"
            onClick={handleShowMore}
            disabled={loading}
            className="inline-flex items-center gap-2 font-label-caps text-xs text-white hover:text-brand-blue transition-colors uppercase tracking-widest border-b border-white/20 hover:border-brand-blue pb-1 group cursor-pointer disabled:opacity-50 font-semibold"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-blue" />
            ) : (
              <>
                <span>{showMoreText}</span>
                <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
}
