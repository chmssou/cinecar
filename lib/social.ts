export interface SocialLinks {
  whatsapp: string;
  phone: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
}

export function getSocialLinks(siteSettings?: any): SocialLinks {
  const whatsappRaw = siteSettings?.whatsappNumber || "+213550000000";
  const cleanWhatsApp = whatsappRaw.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanWhatsApp}`;

  const phoneRaw = siteSettings?.phoneNumbers?.[0] || "+213550123456";
  const cleanPhone = phoneRaw.replace(/[^0-9+]/g, "");

  const instagram = siteSettings?.socialLinks?.instagram || undefined;
  const facebook = siteSettings?.socialLinks?.facebook || undefined;
  const tiktok = siteSettings?.socialLinks?.tiktok || undefined;
  const youtube = siteSettings?.socialLinks?.youtube || undefined;

  return {
    whatsapp: whatsappUrl,
    phone: `tel:${cleanPhone}`,
    instagram,
    facebook,
    tiktok,
    youtube,
  };
}
