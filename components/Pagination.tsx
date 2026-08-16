"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getDictionary, Locale } from "@/lib/i18n";

interface PaginationProps {
  locale: Locale;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function Pagination({
  locale,
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dict = getDictionary(locale);

  if (totalPages <= 1) return null;

  const navigateToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const isRtl = locale === "ar";
  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;

  return (
    <div className="mt-10 flex items-center justify-center gap-4">
      <button
        onClick={() => navigateToPage(currentPage - 1)}
        disabled={!hasPrevPage}
        className="flex items-center gap-1 rounded-xl border border-brand-border bg-brand-card px-4 py-2.5 text-xs font-semibold text-brand-text shadow-sm hover:border-brand-blue disabled:opacity-40 disabled:hover:border-brand-border transition-all"
      >
        <PrevIcon className="h-4 w-4" />
        <span>{dict.pagination.previous}</span>
      </button>

      <span className="text-xs font-medium text-brand-muted">
        {dict.pagination.page} <strong className="text-brand-text font-bold">{currentPage}</strong> {dict.pagination.of} {totalPages}
      </span>

      <button
        onClick={() => navigateToPage(currentPage + 1)}
        disabled={!hasNextPage}
        className="flex items-center gap-1 rounded-xl border border-brand-border bg-brand-card px-4 py-2.5 text-xs font-semibold text-brand-text shadow-sm hover:border-brand-blue disabled:opacity-40 disabled:hover:border-brand-border transition-all"
      >
        <span>{dict.pagination.next}</span>
        <NextIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
