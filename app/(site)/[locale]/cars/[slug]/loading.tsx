import Image from "next/image";

export default function VehicleDetailLoading() {
  return (
    <div className="mx-auto max-w-5xl px-gutter pt-24 pb-24 sm:pb-28">
      {/* 1. Breadcrumb Skeleton */}
      <div className="mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
        <div className="h-3 w-16 rounded bg-white/10 animate-pulse" />
        <div className="h-3 w-3 rounded bg-white/5" />
        <div className="h-3 w-20 rounded bg-white/10 animate-pulse" />
        <div className="h-3 w-3 rounded bg-white/5" />
        <div className="h-3 w-36 rounded bg-white/15 animate-pulse" />
      </div>

      {/* 2. Identity Header Skeleton */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-white/10 pb-8">
        <div className="space-y-2">
          <div className="h-3 w-24 rounded bg-brand-blue/30 animate-pulse" />
          <div className="h-10 w-64 sm:w-96 rounded bg-white/10 animate-pulse" />
        </div>
        <div className="flex flex-col sm:items-end space-y-2">
          <div className="h-8 w-36 rounded bg-white/15 animate-pulse" />
          <div className="h-3 w-24 rounded bg-emerald-500/20 animate-pulse" />
        </div>
      </div>

      {/* 3. Main Reserved Gallery Showcase Skeleton */}
      <div className="space-y-10">
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-md border border-white/10 bg-[#070C14] overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent animate-pulse" />
          <Image
            src="/brand/cinecar-logo.png"
            alt="CINECAR"
            width={160}
            height={32}
            className="h-10 w-auto object-contain opacity-25"
          />
        </div>

        {/* 4. Specifications Strip Skeleton */}
        <div className="grid grid-cols-2 gap-y-6 gap-x-4 sm:grid-cols-4 border-y border-white/10 py-6">
          <div className="space-y-2 sm:pe-4 sm:border-e border-white/10">
            <div className="h-3 w-16 rounded bg-white/10 animate-pulse" />
            <div className="h-6 w-20 rounded bg-white/15 animate-pulse" />
          </div>
          <div className="space-y-2 sm:px-4 sm:border-e border-white/10">
            <div className="h-3 w-16 rounded bg-white/10 animate-pulse" />
            <div className="h-6 w-24 rounded bg-white/15 animate-pulse" />
          </div>
          <div className="space-y-2 sm:px-4 sm:border-e border-white/10">
            <div className="h-3 w-16 rounded bg-white/10 animate-pulse" />
            <div className="h-6 w-20 rounded bg-white/15 animate-pulse" />
          </div>
          <div className="space-y-2 sm:ps-4">
            <div className="h-3 w-16 rounded bg-white/10 animate-pulse" />
            <div className="h-6 w-24 rounded bg-white/15 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
