"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import { trackEvent } from "@/lib/analytics";

import { Locale } from "@/lib/i18n";

interface GalleryProps {
  images: any[];
  displayTitle: string;
  locale?: Locale;
}

export function Gallery({ images, displayTitle, locale = "fr" }: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isRtl = locale === "ar";
  const PrevChevron = isRtl ? ChevronRight : ChevronLeft;
  const NextChevron = isRtl ? ChevronLeft : ChevronRight;

  const [mainEmblaRef, mainEmblaApi] = useEmblaCarousel({ loop: true });
  const [thumbEmblaRef, thumbEmblaApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const onSelect = useCallback(() => {
    if (!mainEmblaApi) return;
    const index = mainEmblaApi.selectedScrollSnap();
    setSelectedIndex(index);
    if (thumbEmblaApi) {
      thumbEmblaApi.scrollTo(index);
    }
  }, [mainEmblaApi, thumbEmblaApi]);

  useEffect(() => {
    if (!mainEmblaApi) return;
    onSelect();
    mainEmblaApi.on("select", onSelect);
    mainEmblaApi.on("reInit", onSelect);
  }, [mainEmblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => {
      if (mainEmblaApi) mainEmblaApi.scrollTo(index);
    },
    [mainEmblaApi]
  );

  const scrollPrev = useCallback(() => {
    if (mainEmblaApi) mainEmblaApi.scrollPrev();
  }, [mainEmblaApi]);

  const scrollNext = useCallback(() => {
    if (mainEmblaApi) mainEmblaApi.scrollNext();
  }, [mainEmblaApi]);

  // Fullscreen Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      if (e.key === "Escape") setIsFullscreen(false);
      if (e.key === "ArrowLeft") scrollPrev();
      if (e.key === "ArrowRight") scrollNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, scrollPrev, scrollNext]);

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-16/9 w-full rounded-xl bg-[#09111C] border border-white/10 flex items-center justify-center text-brand-subtle font-label-caps text-xs">
        <span>NO SHOWROOM IMAGES AVAILABLE</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main Image Viewport (16:9) */}
      <div className="relative aspect-16/9 w-full overflow-hidden rounded-xl bg-[#05080D] border border-white/10 group">
        <div className="h-full overflow-hidden" ref={mainEmblaRef}>
          <div className="flex h-full">
            {images.map((img, idx) => {
              const imageUrl = urlFor(img).width(1600).height(1000).quality(92).url();
              return (
                <div
                  key={img._key || idx}
                  className="relative h-full w-full flex-none min-w-0"
                >
                  <Image
                    src={imageUrl}
                    alt={img.alt || `${displayTitle} - ${idx + 1}`}
                    fill
                    priority={idx === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 1000px"
                    className="object-cover"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Prev/Next Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              aria-label="Previous image"
              className="absolute start-3 top-1/2 -translate-y-1/2 rounded bg-black/70 p-2.5 text-white backdrop-blur-md hover:bg-brand-blue transition-all border border-white/10 opacity-80 group-hover:opacity-100"
            >
              <PrevChevron className="h-4 w-4" />
            </button>
            <button
              onClick={scrollNext}
              aria-label="Next image"
              className="absolute end-3 top-1/2 -translate-y-1/2 rounded bg-black/70 p-2.5 text-white backdrop-blur-md hover:bg-brand-blue transition-all border border-white/10 opacity-80 group-hover:opacity-100"
            >
              <NextChevron className="h-4 w-4" />
            </button>
          </>
        )}

        {/* Fullscreen & Counter Ribbon */}
        <div className="absolute bottom-3 start-3 end-3 flex items-center justify-between pointer-events-none z-10">
          <span className="rounded bg-black/80 px-2.5 py-1 font-mono text-[11px] font-bold text-white border border-white/10 backdrop-blur-md pointer-events-auto">
            {selectedIndex + 1} / {images.length}
          </span>

          <button
            onClick={() => {
              setIsFullscreen(true);
              trackEvent("gallery_open", { imageCount: images.length });
            }}
            className="pointer-events-auto btn-stitch-secondary px-3 py-1.5 flex items-center gap-1.5 text-[11px] bg-black/80 backdrop-blur-md"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            <span>FULLSCREEN</span>
          </button>
        </div>
      </div>

      {/* Thumbnails Strip */}
      {images.length > 1 && (
        <div className="overflow-hidden" ref={thumbEmblaRef}>
          <div className="flex gap-2.5">
            {images.map((img, idx) => {
              const thumbUrl = urlFor(img).width(240).height(160).quality(80).url();
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={img._key || idx}
                  onClick={() => scrollTo(idx)}
                  className={`relative aspect-4/3 h-16 shrink-0 overflow-hidden rounded border transition-all ${
                    isSelected
                      ? "border-brand-blue scale-[1.02] shadow-md opacity-100"
                      : "border-white/10 opacity-50 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={thumbUrl}
                    alt="Thumbnail"
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4">
          <button
            onClick={() => setIsFullscreen(false)}
            aria-label="Close fullscreen"
            className="absolute top-5 end-5 z-50 rounded bg-white/10 p-2.5 text-white hover:bg-brand-blue transition-all border border-white/20"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="relative h-full w-full max-w-6xl max-h-[85vh] flex items-center justify-center">
            <Image
              src={urlFor(images[selectedIndex]).width(1920).quality(95).url()}
              alt={`${displayTitle} - Fullscreen`}
              fill
              className="object-contain"
            />
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={scrollPrev}
                className="absolute start-6 top-1/2 -translate-y-1/2 rounded bg-white/10 p-3 text-white hover:bg-brand-blue transition-all border border-white/20"
              >
                <PrevChevron className="h-6 w-6" />
              </button>
              <button
                onClick={scrollNext}
                className="absolute end-6 top-1/2 -translate-y-1/2 rounded bg-white/10 p-3 text-white hover:bg-brand-blue transition-all border border-white/20"
              >
                <NextChevron className="h-6 w-6" />
              </button>
            </>
          )}

          <div className="absolute bottom-6 start-1/2 -translate-x-1/2 rounded bg-black/80 px-4 py-1.5 font-mono text-xs text-white border border-white/10 backdrop-blur-md">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}

