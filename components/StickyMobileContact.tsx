"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Phone } from "lucide-react";
import { Locale } from "@/lib/i18n";
import { generateWhatsAppUrl } from "@/lib/whatsapp";
import { getSocialLinks } from "@/lib/social";
import { trackEvent } from "@/lib/analytics";

interface StickyMobileContactProps {
  locale: Locale;
  whatsappNumber: string;
  phoneNumber: string;
  car?: {
    displayTitle: string;
    stockNumber: string;
    price?: number | null;
    showPrice?: boolean;
    slug?: { current: string };
  };
}

export function StickyMobileContact({
  locale,
  whatsappNumber,
  phoneNumber,
  car,
}: StickyMobileContactProps) {
  const [vehicleUrl, setVehicleUrl] = useState<string>("");

  useEffect(() => {
    setVehicleUrl(window.location.href);
  }, []);

  const whatsappUrl = car
    ? generateWhatsAppUrl({
        phone: whatsappNumber,
        displayTitle: car.displayTitle,
        stockNumber: car.stockNumber,
        vehicleUrl: vehicleUrl,
        price: car.price,
        showPrice: car.showPrice,
        locale,
      })
    : getSocialLinks({ whatsappNumber }).whatsapp;

  const phoneUrl = getSocialLinks({ phoneNumbers: [phoneNumber] }).phone;

  const whatsappLabel = "WhatsApp";
  const callLabel = locale === "ar" ? "اتصال" : "Appeler";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-[#05080D]/95 px-4 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden">
      <div className="flex items-center gap-3 max-w-md mx-auto">
        {/* WhatsApp Action */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("whatsapp_click", { stockNumber: car?.stockNumber, source: "sticky_mobile_vehicle" })}
          className="flex flex-1 items-center justify-center gap-2 rounded-md bg-brand-blue hover:bg-brand-blue-hover py-2 px-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all active:scale-[0.98]"
        >
          <MessageSquare className="h-4 w-4 shrink-0" />
          <span>{whatsappLabel}</span>
        </a>

        {/* Appeler (Call) Action */}
        <a
          href={phoneUrl}
          onClick={() => trackEvent("phone_click", { stockNumber: car?.stockNumber, source: "sticky_mobile_vehicle" })}
          className="flex flex-1 items-center justify-center gap-2 rounded-md border border-white/15 bg-white/5 py-2 px-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-white/10 active:scale-[0.98]"
        >
          <Phone className="h-4 w-4 text-brand-blue shrink-0" />
          <span>{callLabel}</span>
        </a>
      </div>
    </div>
  );
}

