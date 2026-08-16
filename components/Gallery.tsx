"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Maximize2, X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
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
  const [mounted, setMounted] = useState(false);

  const savedScrollY = useRef(0);

  // Pan & Zoom state for fullscreen modal
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [touchStartDist, setTouchStartDist] = useState<number | null>(null);
  const [touchStartZoom, setTouchStartZoom] = useState(1);

  const isRtl = locale === "ar";
  const PrevChevron = isRtl ? ChevronRight : ChevronLeft;
  const NextChevron = isRtl ? ChevronLeft : ChevronRight;

  const [mainEmblaRef, mainEmblaApi] = useEmblaCarousel({ loop: true });
  const [thumbEmblaRef, thumbEmblaApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const resetZoomPan = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIsDragging(false);
  }, []);

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

  // Reset zoom & pan whenever image changes or fullscreen mode toggles
  useEffect(() => {
    resetZoomPan();
  }, [selectedIndex, isFullscreen, resetZoomPan]);

  // Keyboard navigation & Esc handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      if (e.key === "Escape") {
        setIsFullscreen(false);
        resetZoomPan();
      }
      if (e.key === "ArrowLeft") {
        resetZoomPan();
        scrollPrev();
      }
      if (e.key === "ArrowRight") {
        resetZoomPan();
        scrollNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen, scrollPrev, scrollNext, resetZoomPan]);

  // Robust Body Scroll Lock & Exact Scroll Position Restoration
  useEffect(() => {
    if (!isFullscreen) return;

    const scrollY = window.scrollY || window.pageYOffset || 0;
    savedScrollY.current = scrollY;

    const originalStyle = {
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
    };

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.position = originalStyle.position;
      document.body.style.top = originalStyle.top;
      document.body.style.width = originalStyle.width;
      document.body.style.overflow = originalStyle.overflow;

      window.scrollTo(0, savedScrollY.current);
    };
  }, [isFullscreen]);

  const clampPan = useCallback((newPan: { x: number; y: number }, currentZoom: number) => {
    if (currentZoom <= 1) return { x: 0, y: 0 };
    const maxOffset = (currentZoom - 1) * 350;
    return {
      x: Math.min(maxOffset, Math.max(-maxOffset, newPan.x)),
      y: Math.min(maxOffset, Math.max(-maxOffset, newPan.y)),
    };
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom((z) => {
      const next = Math.min(4, z + 0.5);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((z) => {
      const next = Math.max(1, z - 0.5);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.3 : -0.3;
      setZoom((prevZoom) => {
        const nextZoom = Math.min(4, Math.max(1, prevZoom + delta));
        if (nextZoom === 1) {
          setPan({ x: 0, y: 0 });
        } else {
          setPan((p) => clampPan(p, nextZoom));
        }
        return nextZoom;
      });
    },
    [clampPan]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newPan = {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    };
    setPan(clampPan(newPan, zoom));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDoubleClick = () => {
    if (zoom > 1) {
      resetZoomPan();
    } else {
      setZoom(2.5);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setTouchStartDist(dist);
      setTouchStartZoom(zoom);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging && zoom > 1) {
      const touch = e.touches[0];
      const newPan = {
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      };
      setPan(clampPan(newPan, zoom));
    } else if (e.touches.length === 2 && touchStartDist !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scale = dist / touchStartDist;
      const newZoom = Math.min(4, Math.max(1, touchStartZoom * scale));
      setZoom(newZoom);
      if (newZoom === 1) setPan({ x: 0, y: 0 });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTouchStartDist(null);
  };

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-16/9 w-full rounded-xl bg-[#09111C] border border-white/10 flex items-center justify-center text-brand-subtle font-label-caps text-xs">
        <span>NO SHOWROOM IMAGES AVAILABLE</span>
      </div>
    );
  }

  const currentFullscreenUrl = urlFor(images[selectedIndex]).width(1920).quality(95).url();
  const currentAmbientUrl = urlFor(images[selectedIndex]).width(400).quality(30).url();

  const renderFullscreenModal = () => {
    if (!isFullscreen || !mounted) return null;

    const modalContent = (
      <div
        className="fixed inset-0 z-[99999] w-screen h-[100dvh] bg-[#04070C] overflow-hidden select-none touch-none animate-fade-in"
        style={{ top: 0, left: 0 }}
      >
        {/* Subtle Ambient Backdrop Layer */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <Image
            src={currentAmbientUrl}
            alt=""
            fill
            className="object-cover opacity-25 blur-3xl scale-125 pointer-events-none"
            priority
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        {/* Close Button — Anchored Top-End of Viewport */}
        <button
          type="button"
          onClick={() => {
            setIsFullscreen(false);
            resetZoomPan();
          }}
          aria-label="Close Gallery"
          className="absolute top-4 end-4 sm:top-6 sm:end-6 z-[100001] rounded-full bg-black/70 p-3 text-white hover:bg-brand-blue transition-all border border-white/20 backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Desktop Zoom Toolbar — Centered Top of Viewport (Hidden on Mobile) */}
        <div className="hidden md:flex absolute top-4 start-1/2 -translate-x-1/2 z-[100001] items-center gap-2 rounded-full bg-black/70 px-4 py-1.5 border border-white/20 backdrop-blur-md">
          <button
            type="button"
            onClick={handleZoomOut}
            aria-label="Zoom Out"
            className="rounded-full p-1.5 text-white/80 hover:text-white hover:bg-white/15 transition-colors"
          >
            <ZoomOut className="h-4 w-4" />
          </button>

          <span className="font-mono text-xs font-bold text-white px-1">
            {Math.round(zoom * 100)}%
          </span>

          <button
            type="button"
            onClick={handleZoomIn}
            aria-label="Zoom In"
            className="rounded-full p-1.5 text-white/80 hover:text-white hover:bg-white/15 transition-colors"
          >
            <ZoomIn className="h-4 w-4" />
          </button>

          {zoom > 1 && (
            <button
              type="button"
              onClick={resetZoomPan}
              aria-label="Reset Zoom"
              className="ms-1 rounded-full p-1.5 text-white/70 hover:text-white hover:bg-white/15 transition-colors border-s border-white/20"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Viewport-Anchored Previous Button (Left / Start) */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={() => {
              resetZoomPan();
              scrollPrev();
            }}
            aria-label="Previous Image"
            className="absolute start-3 sm:start-6 top-1/2 -translate-y-1/2 z-[100001] rounded-full bg-black/70 p-2.5 sm:p-3.5 text-white hover:bg-brand-blue transition-all border border-white/20 backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
          >
            <PrevChevron className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        )}

        {/* Viewport-Anchored Next Button (Right / End) */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={() => {
              resetZoomPan();
              scrollNext();
            }}
            aria-label="Next Image"
            className="absolute end-3 sm:end-6 top-1/2 -translate-y-1/2 z-[100001] rounded-full bg-black/70 p-2.5 sm:p-3.5 text-white hover:bg-brand-blue transition-all border border-white/20 backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
          >
            <NextChevron className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        )}

        {/* Main Interactive Image Viewport Area */}
        <div
          className="relative z-10 w-full h-full flex items-center justify-center p-4 sm:p-10 overflow-hidden"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onDoubleClick={handleDoubleClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in",
          }}
        >
          <div
            className="flex items-center justify-center transition-transform max-w-full max-h-full"
            style={{
              transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
              transitionDuration: isDragging ? "0ms" : "150ms",
              transformOrigin: "center center",
            }}
          >
            {/* eslint-disable-next-html-element-for-img */}
            <img
              key={images[selectedIndex]._key || selectedIndex}
              src={currentFullscreenUrl}
              alt={`${displayTitle} - Fullscreen photo ${selectedIndex + 1}`}
              className="max-w-[90vw] max-h-[85vh] w-auto h-auto object-contain rounded shadow-2xl pointer-events-none select-none"
              draggable={false}
            />
          </div>
        </div>

        {/* Viewport-Anchored Image Counter Ribbon (Bottom Center) */}
        <div className="absolute bottom-4 sm:bottom-6 start-1/2 -translate-x-1/2 z-[100001] rounded-full bg-black/80 px-4 py-1.5 font-mono text-xs font-bold text-white border border-white/20 backdrop-blur-md">
          {selectedIndex + 1} / {images.length}
        </div>
      </div>
    );

    return createPortal(modalContent, document.body);
  };

  return (
    <div className="flex flex-col gap-3 min-w-0">
      {/* Main Image Viewport (Normal Mode) */}
      <div className="relative aspect-16/9 sm:aspect-16/10 w-full overflow-hidden rounded-xl bg-[#05080D] border border-white/10 group min-w-0">
        <div className="h-full overflow-hidden" ref={mainEmblaRef}>
          <div className="flex h-full">
            {images.map((img, idx) => {
              const imageUrl = urlFor(img).width(1600).quality(92).url();
              return (
                <div
                  key={img._key || idx}
                  className="relative h-full w-full flex-none min-w-0 bg-[#060B12] flex items-center justify-center p-2 group/slide"
                >
                  {/* Subtle Premium Image Loading Skeleton */}
                  <div className="absolute inset-2 bg-gradient-to-tr from-[#070D18] via-[#0D1625] to-[#070D18] animate-pulse rounded-lg pointer-events-none -z-0" />

                  <Image
                    src={imageUrl}
                    alt={img.alt || `${displayTitle} - ${idx + 1}`}
                    fill
                    priority={idx === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 85vw, 1200px"
                    className="object-contain transition-opacity duration-300 z-10"
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
              className="absolute start-3 top-1/2 -translate-y-1/2 rounded-full bg-black/75 p-2.5 text-white backdrop-blur-md hover:bg-brand-blue hover:scale-105 transition-all border border-white/15 opacity-80 group-hover:opacity-100 z-10 shadow-lg"
            >
              <PrevChevron className="h-4 w-4" />
            </button>
            <button
              onClick={scrollNext}
              aria-label="Next image"
              className="absolute end-3 top-1/2 -translate-y-1/2 rounded-full bg-black/75 p-2.5 text-white backdrop-blur-md hover:bg-brand-blue hover:scale-105 transition-all border border-white/15 opacity-80 group-hover:opacity-100 z-10 shadow-lg"
            >
              <NextChevron className="h-4 w-4" />
            </button>
          </>
        )}

        {/* Fullscreen & Counter Ribbon */}
        <div className="absolute bottom-3 start-3 end-3 flex items-center justify-between pointer-events-none z-10">
          <span className="rounded-full bg-black/75 px-3 py-1 font-mono text-[11px] font-semibold text-white/90 border border-white/15 backdrop-blur-md pointer-events-auto shadow-sm">
            {selectedIndex + 1} / {images.length}
          </span>

          <button
            type="button"
            onClick={() => {
              setIsFullscreen(true);
              trackEvent("gallery_open", { imageCount: images.length });
            }}
            className="pointer-events-auto rounded-full bg-black/75 px-3 py-1 flex items-center gap-1.5 font-label-caps text-[11px] uppercase tracking-wider text-white/90 border border-white/15 backdrop-blur-md hover:border-brand-blue hover:text-white transition-all shadow-sm"
          >
            <Maximize2 className="h-3 w-3" />
            <span>FULLSCREEN</span>
          </button>
        </div>
      </div>

      {/* Thumbnails Strip */}
      {images.length > 1 && (
        <div className="overflow-hidden min-w-0" ref={thumbEmblaRef}>
          <div className="flex gap-2.5">
            {images.map((img, idx) => {
              const thumbUrl = urlFor(img).width(240).height(160).quality(80).url();
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={img._key || idx}
                  type="button"
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

      {/* React Portal Fullscreen Lightbox Modal */}
      {renderFullscreenModal()}
    </div>
  );
}




