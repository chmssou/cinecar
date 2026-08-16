import Link from "next/link";
import Image from "next/image";
import "@/app/globals.css";

export default function RootNotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#05080D] text-[#E0E3E6] px-4 py-20 relative overflow-hidden"
      role="status"
    >
      {/* Ambient Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-blue/10 via-[#05080D] to-[#05080D] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-lg w-full text-center space-y-8 animate-fade-in-up">
        {/* CINECAR Official Logo */}
        <div className="flex flex-col items-center space-y-4">
          <Link href="/fr" className="inline-block group">
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
            PAGE INTROUVABLE / صفحة غير موجودة
          </span>
        </div>

        {/* Message */}
        <div className="space-y-3 border-y border-white/10 py-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display uppercase tracking-tight leading-tight">
            PAGE INTROUVABLE
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted max-w-md mx-auto leading-relaxed">
            La page que vous recherchez n&apos;existe pas ou a été déplacée.
            <br />
            <span dir="rtl" className="block pt-1">
              الصفحة التي تبحث عنها غير موجودة أو تم تغيير عنوانها.
            </span>
          </p>
        </div>

        {/* Bilingual Action Links */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/fr/cars"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-blue hover:bg-brand-blue-hover text-white font-label-caps text-xs py-3 px-6 rounded-md transition-colors uppercase tracking-widest font-semibold shadow-lg shadow-brand-blue/10"
          >
            <span>ANNONCES (FR)</span>
          </Link>

          <Link
            href="/ar/cars"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-surface hover:bg-brand-surface-high text-white border border-white/15 hover:border-white/30 font-label-caps text-xs py-3 px-6 rounded-md transition-colors uppercase tracking-widest font-semibold"
          >
            <span>الإعلانات (AR)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
