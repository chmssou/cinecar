"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface HeroMediaProps {
  posterUrl: string;
  videoUrl?: string | null;
  altText?: string;
}

export function HeroMedia({ posterUrl, videoUrl, altText = "CineCar Car Sales" }: HeroMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for prefers-reduced-motion
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener?.("change", handleChange);
      return () => mediaQuery.removeEventListener?.("change", handleChange);
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl || prefersReducedMotion || videoFailed) return;

    // Force muted and playsInline for strict mobile autoplay support
    video.muted = true;
    video.playsInline = true;

    // If video is already actively playing, reveal it
    if (!video.paused && video.readyState >= 3) {
      setIsVideoPlaying(true);
    }

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Playback initiated successfully
        })
        .catch(() => {
          // Autoplay blocked by mobile browser or power saving mode -> graceful fallback to poster image
          setVideoFailed(true);
        });
    }
  }, [videoUrl, prefersReducedMotion, videoFailed]);

  const handleVideoPlaying = () => {
    setIsVideoPlaying(true);
  };

  const handleVideoError = () => {
    setVideoFailed(true);
  };

  const hasVideo = Boolean(videoUrl && videoUrl.trim().length > 0);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#05080D]">
      {/* Dedicated Overscanned Media Wrapper */}
      <div className="relative w-full h-full overflow-hidden">
        {/* 1. Continuous Poster Image Layer (Stays mounted underneath to guarantee zero black flashes) */}
        <Image
          src={posterUrl}
          alt={altText}
          fill
          priority
          sizes="100vw"
          className="object-cover [object-position:center_38%] lg:[object-position:center_36%] md:[object-position:center_38%] sm:[object-position:center_40%] scale-[1.05] transition-transform duration-1000 ease-out"
        />

        {/* 2. HTML5 Background Video Layer (Preloads auto, fades in smoothly ONLY when active playing starts) */}
        {hasVideo && !prefersReducedMotion && !videoFailed && (
          <video
            ref={videoRef}
            poster={posterUrl}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onPlaying={handleVideoPlaying}
            onCanPlayThrough={handleVideoPlaying}
            onError={handleVideoError}
            tabIndex={-1}
            aria-hidden="true"
            className={`absolute inset-0 w-full h-full object-cover [object-position:center_38%] lg:[object-position:center_36%] md:[object-position:center_38%] sm:[object-position:center_40%] scale-[1.05] transition-opacity duration-500 pointer-events-none ${
              isVideoPlaying ? "opacity-100" : "opacity-0"
            }`}
          >
            <source src={videoUrl!} type="video/mp4" />
          </video>
        )}
      </div>

      {/* 3. Top Vignette Overlay for Header Integration */}
      <div className="absolute inset-x-0 top-0 h-40 sm:h-52 bg-gradient-to-b from-black/80 via-black/30 via-20% to-transparent pointer-events-none z-[1]" />

      {/* 4. Left-Side Quiet Zone Overlay (Preserves clean contrast for left-aligned copy) */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#05080D]/85 via-[#05080D]/40 via-45% to-transparent pointer-events-none z-[1]" />

      {/* 5. Continuous Multi-Stage Bottom Darkening & Dissolve into #05080D */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 sm:h-3/5 bg-gradient-to-b from-transparent via-[#05080D]/20 via-40% via-[#05080D]/60 via-70% via-[#05080D]/90 to-[#05080D] pointer-events-none z-[2]" />
    </div>
  );
}
