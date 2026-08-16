"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MapPin, Phone, Mail, MessageSquare } from "lucide-react";
import { getDictionary, Locale } from "@/lib/i18n";
import { getSocialLinks } from "@/lib/social";
import { trackEvent } from "@/lib/analytics";
import { urlFor } from "@/sanity/lib/image";

interface FooterProps {
  locale: Locale;
  siteSettings?: any;
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

export function Footer({ locale, siteSettings }: FooterProps) {
  const dict = getDictionary(locale);
  const pathname = usePathname();
  const router = useRouter();
  const social = getSocialLinks(siteSettings);

  const phoneNumbers = siteSettings?.phoneNumbers || ["+213 550 12 34 56"];
  const email = siteSettings?.email || "contact@dealership.dz";
  const address = siteSettings?.address?.[locale] || (locale === "ar" ? "الجزائر العاصمة" : "Alger, Algérie");

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

  return (
    <footer className="border-t border-white/5 bg-[#030508] text-brand-muted pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">
      <div className="mx-auto max-w-container px-gutter py-14 sm:py-18">
        {/* Balanced 3-Column Desktop Grid / Natural Stack on Mobile */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 lg:gap-16">
          {/* COLUMN 1 — BRAND */}
          <div className="space-y-4">
            <Link href={`/${locale}`} className="inline-block group">
              <img
                src={siteSettings?.logo?.asset ? urlFor(siteSettings.logo).url() : "/brand/cinecar-logo.png"}
                alt={siteSettings?.businessName || "CineCar Car Sales"}
                className="h-10 sm:h-12 w-auto max-w-[200px] object-contain transition-opacity group-hover:opacity-95"
              />
            </Link>
            <p className="text-xs leading-relaxed text-brand-subtle max-w-xs">
              {siteSettings?.footerDescription?.[locale] ||
                (locale === "ar"
                  ? "شريككم الموثوق لبيع وشراء السيارات في الجزائر. خدمة وساطة سريعة وشفافة."
                  : "Votre partenaire de confiance pour la vente et l'achat de véhicules en Algérie. Un service de courtage rapide et transparent.")}
            </p>

            {/* Social Channels */}
            <div className="flex items-center gap-3 pt-2">
              {social.whatsapp && (
                <a
                  href={social.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("whatsapp_click", { source: "footer" })}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:border-brand-blue/50 hover:bg-brand-blue/10 hover:text-brand-blue"
                  aria-label="WhatsApp"
                >
                  <MessageSquare className="h-4 w-4" />
                </a>
              )}
              {social.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("social_click", { platform: "instagram", source: "footer" })}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
              )}
              {social.facebook && (
                <a
                  href={social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("social_click", { platform: "facebook", source: "footer" })}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="h-4 w-4" />
                </a>
              )}
              {social.tiktok && (
                <a
                  href={social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("social_click", { platform: "tiktok", source: "footer" })}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white"
                  aria-label="TikTok"
                >
                  <TikTokIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* COLUMN 2 — LIENS RAPIDES */}
          <div>
            <h3 className="font-label-caps text-[11px] text-white mb-4 uppercase tracking-wider">
              {dict.footer.quickLinks}
            </h3>
            <ul className="space-y-3 font-label-caps text-[11px]">
              <li>
                <Link href={`/${locale}`} className="hover:text-white transition-colors">
                  {dict.nav.home}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/cars`} className="hover:text-white transition-colors">
                  {dict.nav.cars}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}#contact`} className="hover:text-white transition-colors">
                  {dict.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3 — CONTACT & ADRESSE */}
          <div>
            <h3 className="font-label-caps text-[11px] text-white mb-4 uppercase tracking-wider">
              {dict.footer.contactInfo}
            </h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-brand-blue shrink-0 mt-0.5" strokeWidth={1.5} />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-brand-blue shrink-0" strokeWidth={1.5} />
                <a href={`tel:${phoneNumbers[0]?.replace(/[^0-9+]/g, "")}`} className="hover:text-white transition-colors">
                  {phoneNumbers[0]}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-brand-blue shrink-0" strokeWidth={1.5} />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Utility Bar with Language Switcher */}
        <div className="mt-12 border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-label-caps text-[11px] text-brand-subtle">
          <p>© {new Date().getFullYear()} CINECAR CAR SALES. {dict.footer.rights}.</p>

          <div className="flex items-center gap-4 text-white/50 text-[10px]">
            <button
              onClick={() => switchLocale("fr")}
              className={`hover:text-white transition-colors ${locale === "fr" ? "text-white font-bold" : ""}`}
            >
              Français (FR)
            </button>
            <span>•</span>
            <button
              onClick={() => switchLocale("ar")}
              className={`hover:text-white transition-colors ${locale === "ar" ? "text-white font-bold" : ""}`}
            >
              العربية (AR)
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
