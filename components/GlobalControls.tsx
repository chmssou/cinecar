"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { MessageSquare, X } from "lucide-react";
import { Locale } from "@/lib/i18n";
import { getSocialLinks } from "@/lib/social";
import { trackEvent } from "@/lib/analytics";

interface GlobalControlsProps {
  locale: Locale;
  siteSettings?: any;
}

// Custom SVG Icons for Instagram, Facebook, TikTok for crisp rendering
function InstagramIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

function FacebookIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
  );
}

function TikTokIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
    </svg>
  );
}

export function GlobalControls({ locale, siteSettings }: GlobalControlsProps) {
  const pathname = usePathname();
  const links = getSocialLinks(siteSettings);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync document level lang and dir attributes dynamically
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    }
  }, [locale]);

  // Handle click outside to collapse on mobile / tap
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isVehicleDetailPage =
    pathname.includes("/cars/") && pathname.split("/").filter(Boolean).length >= 3;

  const isRtl = locale === "ar";
  const ariaLabel = isRtl
    ? isOpen ? "إغلاق خيارات التواصل" : "فتح خيارات التواصل"
    : isOpen ? "Fermer les options de contact" : "Ouvrir les options de contact";

  return (
    <div
      className={`fixed bottom-4 sm:bottom-6 z-40 pointer-events-none ${
        isRtl ? "right-4 sm:right-6 2xl:right-12" : "left-4 sm:left-6 2xl:left-12"
      } ${isVehicleDetailPage ? "opacity-95" : "opacity-100"}`}
    >
      <div
        ref={containerRef}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="pointer-events-auto relative flex items-center"
      >
        {/* Floating Bubble Pill Container */}
        <div
          className={`flex items-center rounded-full border border-white/15 bg-[#09111C]/95 shadow-2xl backdrop-blur-md transition-all duration-300 ease-out hover:border-brand-blue/50 ${
            isOpen
              ? "px-3.5 py-2 bg-[#0D1624]"
              : "p-0 h-11 w-11 sm:h-12 sm:w-12 justify-center"
          }`}
        >
          {/* Main Trigger Button */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={ariaLabel}
            aria-expanded={isOpen}
            className={`flex items-center justify-center shrink-0 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded-full ${
              isOpen ? "me-2.5 opacity-80 hover:opacity-100" : "h-full w-full"
            }`}
          >
            {isOpen ? (
              <X className="h-4 w-4 text-white/70 hover:text-white" />
            ) : (
              <MessageSquare className="h-5 w-5 text-brand-blue" strokeWidth={2} />
            )}
          </button>

          {/* Expanded Links Cluster */}
          <div
            className={`flex items-center transition-all duration-300 ease-out overflow-hidden ${
              isOpen
                ? "opacity-100 max-w-[280px] pointer-events-auto"
                : "opacity-0 max-w-0 pointer-events-none"
            }`}
          >
            {/* Primary WhatsApp Action */}
            <a
              href={links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("whatsapp_click", { source: "floating_bubble" })}
              className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-white transition-colors hover:text-brand-blue whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded"
              aria-label="WhatsApp Contact"
            >
              <MessageSquare className="h-3.5 w-3.5 text-brand-blue shrink-0" strokeWidth={2} />
              <span className="font-label-caps text-[11px] uppercase">WhatsApp</span>
            </a>

            <span className="h-3.5 w-[1px] bg-white/15 mx-2.5 shrink-0" />

            {/* Social Platforms Cluster */}
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("social_click", { platform: "instagram", source: "floating_bubble" })}
                className="p-1 text-white/70 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>

              <a
                href={links.facebook}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("social_click", { platform: "facebook", source: "floating_bubble" })}
                className="p-1 text-white/70 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded"
                aria-label="Facebook"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>

              <a
                href={links.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("social_click", { platform: "tiktok", source: "floating_bubble" })}
                className="p-1 text-white/70 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded"
                aria-label="TikTok"
              >
                <TikTokIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
