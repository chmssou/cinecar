"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { RotateCcw, ArrowRight, ArrowLeft } from "lucide-react";
import { getDictionary, Locale } from "@/lib/i18n";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const locale: Locale = pathname?.startsWith("/ar") ? "ar" : "fr";
  const dict = getDictionary(locale);
  const sys = dict.systemStates;
  const isRtl = locale === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  useEffect(() => {
    console.error("[CineCar Error Boundary]", error);
  }, [error]);

  return (
    <div
      className="min-h-[85vh] flex items-center justify-center bg-[#05080D] text-[#E0E3E6] px-gutter pt-20 pb-28 sm:pb-20 relative overflow-hidden"
      role="alert"
    >
      {/* Subtle Background Radial Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-blue/10 via-[#05080D] to-[#05080D] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-lg w-full text-center space-y-8 animate-fade-in-up">
        {/* Brand Header */}
        <div className="flex flex-col items-center space-y-4">
          <Link href={`/${locale}`} className="inline-block group">
            <Image
              src="/brand/cinecar-logo.png"
              alt="CINECAR"
              width={200}
              height={48}
              priority
              className="h-10 sm:h-12 w-auto max-w-[200px] object-contain transition-opacity group-hover:opacity-90"
            />
          </Link>
          <span className="font-label-caps text-[11px] text-brand-blue uppercase tracking-[0.2em] block">
            {sys.errorEyebrow}
          </span>
        </div>

        {/* Main Error Message */}
        <div className="space-y-3 border-y border-white/10 py-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display uppercase tracking-tight leading-tight">
            {sys.errorTitle}
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted max-w-md mx-auto leading-relaxed">
            {sys.errorSubtitle}
          </p>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {/* Retry Button */}
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-blue hover:bg-brand-blue-hover text-white font-label-caps text-xs py-3 px-6 rounded-md transition-colors uppercase tracking-widest font-semibold shadow-lg shadow-brand-blue/10"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{sys.retry}</span>
          </button>

          {/* View Cars Link */}
          <Link
            href={`/${locale}/cars`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-surface hover:bg-brand-surface-high text-white border border-white/15 hover:border-white/30 font-label-caps text-xs py-3 px-6 rounded-md transition-colors uppercase tracking-widest font-semibold"
          >
            <span>{sys.viewCars}</span>
          </Link>

          {/* Home Link */}
          <Link
            href={`/${locale}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent text-brand-muted hover:text-white font-label-caps text-xs py-3 px-4 transition-colors uppercase tracking-widest"
          >
            <span>{sys.home}</span>
            <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
