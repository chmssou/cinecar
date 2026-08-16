import Image from "next/image";

export default function GlobalLoading() {
  return (
    <div
      className="min-h-[75vh] flex flex-col items-center justify-center bg-[#05080D] px-4 py-20"
      role="status"
      aria-busy="true"
      aria-label="Chargement"
    >
      <div className="flex flex-col items-center space-y-5 animate-fade-in-up">
        {/* Official CINECAR Logo */}
        <Image
          src="/brand/cinecar-logo.png"
          alt="CINECAR"
          width={220}
          height={48}
          priority
          className="h-10 sm:h-12 w-auto max-w-[220px] object-contain opacity-95 transition-opacity"
        />

        {/* Thin Blue Accent Progress Line */}
        <div className="h-[2px] w-28 sm:w-36 rounded-full bg-brand-blue/20 overflow-hidden relative">
          <div className="absolute inset-0 bg-brand-blue animate-line-expand rounded-full" />
        </div>
      </div>
    </div>
  );
}
