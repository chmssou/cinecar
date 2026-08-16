"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Phone, MessageSquare } from "lucide-react";
import { getDictionary, Locale } from "@/lib/i18n";
import { getSocialLinks } from "@/lib/social";
import { trackEvent } from "@/lib/analytics";
import { urlFor } from "@/sanity/lib/image";

interface NavbarProps {
  locale: Locale;
  siteSettings?: any;
}

function WhatsAppIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 2C6.477 2 2 6.477 2 12c0 2.158.683 4.157 1.849 5.8L2.5 21.5l3.815-1.325C7.905 21.282 9.882 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.87 0-3.606-.523-5.09-1.433l-.365-.224-2.261.786.797-2.221-.246-.39A7.95 7.95 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
    </svg>
  );
}

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

export function Navbar({ locale, siteSettings }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dict = getDictionary(locale);
  const socialLinks = getSocialLinks(siteSettings);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const switchLocale = (targetLocale: Locale) => {
    if (targetLocale === locale) return;
    document.cookie = `NEXT_LOCALE=${targetLocale}; max-age=31536000; path=/; samesite=lax`;
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) {
      router.push(`/${targetLocale}`);
    } else {
      segments[0] = targetLocale;
      router.push(`/${segments.join("/")}`);
    }
  };

  const navLinks = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/cars`, label: dict.nav.cars },
    { href: `/${locale}#contact`, label: dict.nav.contact },
  ];

  const drawerPositionClass = locale === "ar" ? "left-0" : "right-0";
  const borderPositionClass = locale === "ar" ? "border-r" : "border-l";
  const drawerAnimationClass = locale === "ar" ? "animate-drawer-slide-rtl" : "animate-drawer-slide-ltr";

  const mobileDrawerJSX = (
    <div className="fixed inset-0 z-[100] md:hidden">
      {/* Dedicated Viewport Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-md animate-backdrop-fade transition-opacity"
        aria-hidden="true"
      />

      {/* Viewport-Fixed Isolated Mobile Drawer Container */}
      <div
        className={`fixed inset-y-0 ${drawerPositionClass} z-[100] w-[85%] max-w-xs h-[100dvh] bg-[#080D14] shadow-2xl border-white/10 flex flex-col justify-between overflow-y-auto ${borderPositionClass} ${drawerAnimationClass} pt-[calc(1.25rem+env(safe-area-inset-top))] pb-[calc(1.25rem+env(safe-area-inset-bottom))] px-6`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
      >
        {/* Top Section: Brand & Navigation */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-5 border-b border-white/10">
            <Link href={`/${locale}`} onClick={() => setIsOpen(false)} className="block">
              <img
                src={siteSettings?.logo?.asset ? urlFor(siteSettings.logo).url() : "/brand/cinecar-logo.png"}
                alt={siteSettings?.businessName || "CineCar Car Sales"}
                className="h-8 w-auto max-w-[160px] object-contain"
              />
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2 pt-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-md font-label-caps text-xs uppercase tracking-[0.18em] transition-all ${
                    isActive
                      ? "text-brand-blue font-bold bg-brand-blue/10 border-l-2 border-brand-blue rtl:border-l-0 rtl:border-r-2"
                      : "text-white/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Compact Actions & Utilities */}
        <div className="pt-6 border-t border-white/10 space-y-5 mt-6">
          {/* Refined 2-Column Action Row: WhatsApp + Appeler */}
          <div className="grid grid-cols-2 gap-3">
            {/* WhatsApp - Primary */}
            <a
              href={socialLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                setIsOpen(false);
                trackEvent("whatsapp_click", { source: "mobile_drawer" });
              }}
              className="flex items-center justify-center gap-2 rounded-md bg-brand-blue hover:bg-brand-blue-hover py-2.5 px-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all active:scale-[0.98]"
            >
              <WhatsAppIcon className="h-4 w-4 shrink-0 fill-current text-white" />
              <span className="truncate">WhatsApp</span>
            </a>

            {/* Appeler - Secondary */}
            <a
              href={socialLinks.phone}
              onClick={() => {
                setIsOpen(false);
                trackEvent("phone_click", { source: "mobile_drawer" });
              }}
              className="flex items-center justify-center gap-2 rounded-md bg-white/5 border border-white/15 py-2.5 px-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-white/10 hover:border-white/30 active:scale-[0.98]"
            >
              <Phone className="h-4 w-4 text-brand-blue shrink-0" />
              <span className="truncate">{locale === "ar" ? "اتصال" : "Appeler"}</span>
            </a>
          </div>

          {/* Social Links Cluster */}
          <div className="flex items-center justify-center gap-6 pt-1">
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("social_click", { platform: "instagram", source: "mobile_drawer" })}
              className="p-1.5 text-white/70 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <InstagramIcon className="h-4.5 w-4.5" />
            </a>
            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("social_click", { platform: "facebook", source: "mobile_drawer" })}
              className="p-1.5 text-white/70 hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <FacebookIcon className="h-4.5 w-4.5" />
            </a>
            <a
              href={socialLinks.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("social_click", { platform: "tiktok", source: "mobile_drawer" })}
              className="p-1.5 text-white/70 hover:text-white transition-colors"
              aria-label="TikTok"
            >
              <TikTokIcon className="h-4.5 w-4.5" />
            </a>
          </div>

          {/* Secondary Utility: Language Switcher */}
          <div className="flex items-center justify-center pt-1">
            <button
              onClick={() => {
                setIsOpen(false);
                switchLocale(locale === "ar" ? "fr" : "ar");
              }}
              className="text-[11px] font-label-caps uppercase tracking-widest text-white/50 hover:text-white transition-colors py-1 px-3 rounded-full hover:bg-white/5"
            >
              {locale === "ar" ? "Français" : "العربية"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[#05080D]/95 border-b border-white/10 shadow-2xl py-0 backdrop-blur-md"
          : "bg-transparent border-b-0 shadow-none py-1"
      }`}
    >
      <div className="mx-auto flex max-w-container h-16 items-center justify-between px-gutter">
        {/* Brand / Official CineCar Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2 group py-1">
          <img
            src={siteSettings?.logo?.asset ? urlFor(siteSettings.logo).url() : "/brand/cinecar-logo.png"}
            alt={siteSettings?.businessName || "CineCar Car Sales"}
            className="h-8 sm:h-9 md:h-10 w-auto max-w-[170px] sm:max-w-[190px] object-contain transition-transform group-hover:scale-[1.02]"
          />
        </Link>

        {/* Desktop Navigation Links — Strictly Minimal */}
        <nav className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-label-caps text-[11px] uppercase tracking-[0.2em] transition-colors hover:text-white ${
                  isActive ? "text-brand-blue font-bold" : "text-white/80"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Toggle Control */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-white/20 bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-white/10"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Render Mobile Drawer into body via Portal */}
      {isOpen && mounted && createPortal(mobileDrawerJSX, document.body)}
    </header>
  );
}

