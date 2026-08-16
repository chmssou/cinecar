"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { MessageSquare } from "lucide-react";
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

  // Sync document level lang and dir attributes dynamically
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    }
  }, [locale]);

  const isVehicleDetailPage =
    pathname.includes("/cars/") && pathname.split("/").filter(Boolean).length >= 3;

  return (
    <>
      {/* REFINED DESKTOP BOTTOM SOCIAL DOCK (Hidden on Mobile) */}
      <div
        className={`fixed bottom-6 z-40 hidden md:flex ${
          locale === "ar" ? "right-6" : "left-6"
        } ${isVehicleDetailPage ? "opacity-90" : "opacity-100"}`}
      >
        <div className="flex items-center gap-3 rounded-full border border-white/15 bg-[#09111C]/90 px-4 py-2 shadow-2xl backdrop-blur-md transition-all hover:border-white/30 hover:bg-[#0D1624]">
          {/* Primary WhatsApp Action */}
          <a
            href={links.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("whatsapp_click", { source: "desktop_dock" })}
            className="flex items-center gap-2 text-xs font-bold tracking-wider text-white transition-colors hover:text-brand-blue"
            aria-label="WhatsApp Contact"
          >
            <MessageSquare className="h-3.5 w-3.5 text-brand-blue" strokeWidth={2} />
            <span className="font-label-caps text-[11px] uppercase">WhatsApp</span>
          </a>

          <span className="h-3.5 w-[1px] bg-white/15" />

          {/* Social Platforms Cluster */}
          <div className="flex items-center gap-2.5">
            <a
              href={links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("social_click", { platform: "instagram", source: "desktop_dock" })}
              className="p-1 text-white/70 transition-colors hover:text-white"
              aria-label="Instagram"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>

            <a
              href={links.facebook}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("social_click", { platform: "facebook", source: "desktop_dock" })}
              className="p-1 text-white/70 transition-colors hover:text-white"
              aria-label="Facebook"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>

            <a
              href={links.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("social_click", { platform: "tiktok", source: "desktop_dock" })}
              className="p-1 text-white/70 transition-colors hover:text-white"
              aria-label="TikTok"
            >
              <TikTokIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
