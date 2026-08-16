"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, useTransition } from "react";
import { Search, X, SlidersHorizontal, ChevronDown, RotateCcw, Check } from "lucide-react";
import { getDictionary, Locale } from "@/lib/i18n";
import { trackEvent } from "@/lib/analytics";

interface CarFiltersProps {
  locale: Locale;
  brands?: any[];
  models?: any[];
}

export function CarFilters({ locale }: CarFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const dict = getDictionary(locale);
  const isRtl = locale === "ar";

  // URL search parameter values
  const urlQ = searchParams.get("q") || "";
  const currentSort = searchParams.get("sort") || "newest";
  const currentStatus = searchParams.get("status") || "";

  // Local state for live responsive typing
  const [localQ, setLocalQ] = useState(urlQ);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Sync local search string when URL changes externally (e.g. browser back/forward or reset)
  useEffect(() => {
    setLocalQ(urlQ);
  }, [urlQ]);

  // Live debounced search while typing (250ms)
  useEffect(() => {
    // Skip if local state matches current URL state
    if (localQ === urlQ) return;

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1");

      if (localQ.trim()) {
        params.set("q", localQ.trim());
      } else {
        params.delete("q");
      }

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
      trackEvent("filter_applied", { q: localQ.trim() });
    }, 250);

    return () => clearTimeout(timer);
  }, [localQ, urlQ, pathname, router, searchParams]);

  // Click outside to close dropdown menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    if (value === null || value === "" || value === "newest" || (key === "status" && value === "all")) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
    setIsMenuOpen(false);
  };

  const handleReset = () => {
    setLocalQ("");
    startTransition(() => {
      router.push(pathname);
    });
    setIsMenuOpen(false);
  };

  // Determine if active non-default filters exist
  const isFiltered = Boolean(urlQ || (currentSort && currentSort !== "newest") || currentStatus);

  const searchPlaceholder = isRtl
    ? "ابحث عن علامة أو موديل..."
    : "Rechercher une marque, un modèle...";

  const buttonLabel = isRtl ? "ترتيب / تصفية" : "TRIER / FILTRER";
  const resetLabel = isRtl ? "إعادة ضبط" : "Réinitialiser";

  return (
    <div className="w-full relative my-6">
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Prominent Live Search Input */}
        <div className="relative flex-1">
          <Search className="absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-subtle pointer-events-none" />
          <input
            type="text"
            value={localQ}
            onChange={(e) => setLocalQ(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-12 w-full rounded-sm border border-white/10 bg-[#05080D] ps-10 pe-10 text-xs sm:text-sm text-brand-text placeholder-brand-subtle focus:border-brand-blue outline-none transition-colors shadow-inner"
          />
          {localQ && (
            <button
              type="button"
              onClick={() => {
                setLocalQ("");
                const params = new URLSearchParams(searchParams.toString());
                params.delete("q");
                params.set("page", "1");
                startTransition(() => {
                  router.push(`${pathname}?${params.toString()}`);
                });
              }}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-brand-subtle hover:text-white p-1 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Compact Single Action Button */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="h-12 px-4 flex items-center gap-2 rounded-sm border border-white/10 bg-[#070C14] hover:bg-[#0C1420] text-xs font-bold font-label-caps uppercase tracking-wider text-white transition-colors cursor-pointer shrink-0"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-brand-blue" />
            <span className="hidden sm:inline">{buttonLabel}</span>
            <span className="sm:hidden">{isRtl ? "ترتيب" : "TRIER"}</span>
            <ChevronDown className={`h-3.5 w-3.5 text-brand-subtle transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}`} />
            {isFiltered && (
              <span className="h-2 w-2 rounded-full bg-brand-blue" />
            )}
          </button>

          {/* Compact Dropdown Popover */}
          {isMenuOpen && (
            <div className="absolute end-0 top-full mt-2 w-64 rounded-sm border border-white/10 bg-[#070C14] p-3 shadow-2xl z-40 space-y-4 animate-fade-in-up">
              {/* Section 1: Sorting */}
              <div>
                <span className="font-label-caps text-[10px] uppercase tracking-widest text-brand-subtle block mb-2 px-2 font-bold">
                  {isRtl ? "الترتيب" : "TRIER PAR"}
                </span>
                <div className="space-y-1">
                  {[
                    { id: "newest", label: isRtl ? "الأحدث" : "Plus récentes" },
                    { id: "price_asc", label: isRtl ? "Prix : moins cher" : "Prix : moins cher" },
                    { id: "price_desc", label: isRtl ? "Prix : plus cher" : "Prix : plus cher" },
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => updateParam("sort", option.id)}
                      className={`w-full text-start px-2.5 py-2 text-xs rounded transition-colors flex items-center justify-between ${
                        currentSort === option.id
                          ? "bg-brand-blue/15 text-brand-blue font-bold"
                          : "text-brand-text hover:bg-white/5"
                      }`}
                    >
                      <span>{option.label}</span>
                      {currentSort === option.id && <Check className="h-3.5 w-3.5 text-brand-blue" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/5" />

              {/* Section 2: Availability */}
              <div>
                <span className="font-label-caps text-[10px] uppercase tracking-widest text-brand-subtle block mb-2 px-2 font-bold">
                  {isRtl ? "الإتاحة" : "DISPONIBILITÉ"}
                </span>
                <div className="space-y-1">
                  {[
                    { id: "available", label: isRtl ? "المتاحة فقط" : "Disponibles" },
                    { id: "not_available", label: isRtl ? "غير المتاحة" : "Non disponibles" },
                    { id: "all", label: isRtl ? "الكل" : "Tous" },
                  ].map((option) => {
                    const isSelected =
                      option.id === "all"
                        ? currentStatus === "all"
                        : currentStatus === option.id || (!currentStatus && option.id === "available");
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => updateParam("status", option.id)}
                        className={`w-full text-start px-2.5 py-2 text-xs rounded transition-colors flex items-center justify-between ${
                          isSelected
                            ? "bg-brand-blue/15 text-brand-blue font-bold"
                            : "text-brand-text hover:bg-white/5"
                        }`}
                      >
                        <span>{option.label}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-brand-blue" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional Reset within Menu */}
              {isFiltered && (
                <>
                  <div className="border-t border-white/5" />
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-brand-subtle hover:text-white transition-colors font-label-caps uppercase tracking-wider"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>{resetLabel}</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Small Standalone Reset Button (if filters active) */}
        {isFiltered && (
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-brand-subtle hover:text-white transition-colors font-label-caps uppercase tracking-wider px-2 py-1"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden md:inline">{resetLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
}
