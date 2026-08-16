import { formatPrice, Locale } from "./i18n";

export function generateWhatsAppUrl({
  phone,
  displayTitle,
  stockNumber,
  vehicleUrl,
  price,
  showPrice,
  currency = "DZD",
  locale = "ar",
}: {
  phone: string;
  displayTitle: string;
  stockNumber: string;
  vehicleUrl: string;
  price?: number | null;
  showPrice?: boolean;
  currency?: string;
  locale?: Locale;
}): string {
  const cleanPhone = phone.replace(/[^0-9+]/g, "").replace(/^\+/, "");
  
  let lines: string[] = [];
  if (locale === "fr") {
    lines.push(`Bonjour, je suis intéressé par ce véhicule :`);
    lines.push(`🚗 *${displayTitle}* [N° ${stockNumber}]`);
    if (showPrice && price) {
      lines.push(`💰 Prix : ${formatPrice(price, currency, locale)}`);
    }
    lines.push(`🔗 Lien : ${vehicleUrl}`);
  } else {
    lines.push(`مرحباً، أود الاستفسار عن هذه السيارة:`);
    lines.push(`🚗 *${displayTitle}* [رقم ${stockNumber}]`);
    if (showPrice && price) {
      lines.push(`💰 السعر: ${formatPrice(price, currency, locale)}`);
    }
    lines.push(`🔗 الرابط: ${vehicleUrl}`);
  }

  const message = lines.join("\n");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
