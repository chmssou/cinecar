import Image from "next/image";

export default function CarsLoading() {
  return (
    <div className="mx-auto max-w-container px-gutter pt-24 pb-20 sm:pb-28">
      {/* 1. Header Skeleton */}
      <div className="mb-8 space-y-2">
        <div className="h-3 w-28 rounded bg-brand-blue/20 animate-pulse" />
        <div className="h-9 w-64 sm:w-80 rounded bg-white/10 animate-pulse" />
        <div className="h-4 w-40 rounded bg-white/5 animate-pulse" />
      </div>

      {/* 2. Stable Filter Bar Skeleton Container */}
      <div className="mb-10 rounded-md border border-white/10 bg-[#080D14] p-4 sm:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search Input Placeholder */}
          <div className="h-11 w-full md:w-80 rounded-md bg-white/5 border border-white/10 animate-pulse" />
          {/* Filter Pills Placeholder */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="h-9 w-28 rounded-md bg-white/5 border border-white/10 animate-pulse" />
            <div className="h-9 w-28 rounded-md bg-white/5 border border-white/10 animate-pulse" />
            <div className="h-9 w-28 rounded-md bg-white/5 border border-white/10 animate-pulse" />
            <div className="h-9 w-24 rounded-md bg-white/5 border border-white/10 animate-pulse" />
          </div>
        </div>
      </div>

      {/* 3. Stable 3-Column Vehicle Grid Skeletons */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="group relative flex flex-col overflow-hidden rounded-md border border-white/5 bg-[#070C14] shadow-lg"
          >
            {/* Aspect Ratio Reserved Image Area */}
            <div className="relative aspect-[16/10] w-full bg-[#05080D] overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent animate-pulse" />
              <Image
                src="/brand/cinecar-logo.png"
                alt="CINECAR"
                width={120}
                height={24}
                className="h-6 w-auto object-contain opacity-20"
              />
            </div>

            {/* Content Area Skeleton */}
            <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
              <div className="space-y-2">
                <div className="h-3 w-20 rounded bg-brand-blue/30 animate-pulse" />
                <div className="h-5 w-3/4 rounded bg-white/10 animate-pulse" />
                <div className="h-3 w-1/2 rounded bg-white/5 animate-pulse" />
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <div className="h-6 w-28 rounded bg-white/10 animate-pulse" />
                <div className="h-8 w-20 rounded bg-white/5 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
