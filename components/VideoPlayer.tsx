"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface VideoPlayerProps {
  url: string;
  title: string;
}

export function VideoPlayer({ url, title }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!url) return null;

  // Extract YouTube or Vimeo embed ID
  const getEmbedUrl = (videoUrl: string): string | null => {
    try {
      if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
        let videoId = "";
        if (videoUrl.includes("youtu.be")) {
          videoId = videoUrl.split("/").pop()?.split("?")[0] || "";
        } else {
          const urlObj = new URL(videoUrl);
          videoId = urlObj.searchParams.get("v") || "";
        }
        return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1` : null;
      }

      if (videoUrl.includes("vimeo.com")) {
        const videoId = videoUrl.split("/").pop()?.split("?")[0] || "";
        return videoId ? `https://player.vimeo.com/video/${videoId}?autoplay=1` : null;
      }
    } catch (e) {
      return null;
    }
    return null;
  };

  const embedUrl = getEmbedUrl(url);
  if (!embedUrl) return null;

  return (
    <div className="relative aspect-16/9 w-full overflow-hidden rounded-2xl bg-black border border-brand-border">
      {isPlaying ? (
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full border-0"
        />
      ) : (
        <button
          onClick={() => {
            setIsPlaying(true);
            trackEvent("video_play", { url });
          }}
          className="group relative flex h-full w-full items-center justify-center bg-brand-surface text-white"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-blue/90 shadow-2xl transition-transform group-hover:scale-110">
            <Play className="h-8 w-8 text-white fill-current ms-1" />
          </div>
          <span className="absolute bottom-4 font-mono text-xs text-brand-muted">
            Click to Play Video Presentation
          </span>
        </button>
      )}
    </div>
  );
}
