import { defineType, defineField } from "sanity";
import { Settings } from "lucide-react";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: Settings,
  fieldsets: [
    { name: "brand", title: "1. Brand Identity", options: { collapsible: true, collapsed: false } },
    { name: "hero", title: "2. Homepage Hero Banner", options: { collapsible: true, collapsed: false } },
    { name: "contact", title: "3. Contact & Business Info", options: { collapsible: true, collapsed: false } },
    { name: "social", title: "4. Social Media Links", options: { collapsible: true, collapsed: false } },
    { name: "currency", title: "5. Currency & Region", options: { collapsible: true, collapsed: true } },
    { name: "seo", title: "6. Default SEO & Open Graph", options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    // 1. BRAND IDENTITY
    defineField({
      name: "businessName",
      title: "Dealership Business Name",
      type: "string",
      fieldset: "brand",
      initialValue: "CINECAR CAR SALES",
    }),
    defineField({
      name: "logo",
      title: "Dealership Logo",
      type: "image",
      fieldset: "brand",
      description: "Official dealership logo image (rendered in Header and Footer)",
      options: { hotspot: true },
    }),
    defineField({
      name: "favicon",
      title: "Favicon",
      type: "image",
      fieldset: "brand",
    }),
    defineField({
      name: "footerDescription",
      title: "Footer Company Description",
      type: "localizedText",
      fieldset: "brand",
      description: "Short company description displayed under the logo in the Footer",
      initialValue: {
        fr: "Votre partenaire de confiance pour la vente et l'achat de véhicules en Algérie. Un service de courtage rapide et transparent.",
        ar: "شريككم الموثوق لبيع وشراء السيارات في الجزائر. خدمة وساطة سريعة وشفافة.",
      },
    }),

    // 2. HOMEPAGE HERO BANNER
    defineField({
      name: "heroEyebrow",
      title: "Hero Eyebrow / Hero Label",
      type: "localizedString",
      fieldset: "hero",
      description: "Small accent text displayed above the main Hero headline (e.g. CINECAR ANNONCES AUTOMOBILES)",
      initialValue: {
        fr: "CINECAR ANNONCES AUTOMOBILES",
        ar: "CINECAR إعلانات السيارات",
      },
    }),
    defineField({
      name: "heroVideoFile",
      title: "Hero Video File (Upload MP4 / WebM)",
      type: "file",
      fieldset: "hero",
      description: "Upload a cinematic video file directly to Sanity Cloud for the Homepage Hero background",
      options: {
        accept: "video/mp4,video/webm,video/quicktime",
      },
    }),
    defineField({
      name: "heroVideo",
      title: "Hero Video URL (External / CDN Link)",
      type: "url",
      fieldset: "hero",
      description: "Alternatively enter a direct MP4/WebM video URL from an external CDN or video host",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Poster / Fallback Image",
      type: "image",
      fieldset: "hero",
      description: "High-resolution brand background photography displayed while video loads or if video is unavailable",
      options: { hotspot: true },
    }),
    defineField({
      name: "heroContent",
      title: "Hero Banner Copy & Actions",
      type: "object",
      fieldset: "hero",
      fields: [
        { name: "title", title: "Hero Headline", type: "localizedString" },
        { name: "subtitle", title: "Hero Subtitle", type: "localizedString" },
        { name: "ctaText", title: "Hero CTA Button Label", type: "localizedString" },
        { name: "ctaUrl", title: "Hero CTA Target Link", type: "string" },
      ],
    }),

    // 3. CONTACT & BUSINESS INFO
    defineField({
      name: "whatsappNumber",
      title: "Primary WhatsApp Number",
      type: "string",
      fieldset: "contact",
      description: "International format with country code (e.g. +213550123456)",
      initialValue: "+213550000000",
    }),
    defineField({
      name: "phoneNumbers",
      title: "Phone Numbers",
      type: "array",
      fieldset: "contact",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "email",
      title: "Contact Email",
      type: "string",
      fieldset: "contact",
    }),
    defineField({
      name: "address",
      title: "Physical Address",
      type: "localizedString",
      fieldset: "contact",
    }),
    defineField({
      name: "googleMapsUrl",
      title: "Google Maps Link",
      type: "url",
      fieldset: "contact",
    }),

    // 4. SOCIAL MEDIA LINKS
    defineField({
      name: "socialLinks",
      title: "Social Media Channels",
      type: "object",
      fieldset: "social",
      fields: [
        { name: "instagram", title: "Instagram Profile URL", type: "url" },
        { name: "facebook", title: "Facebook Page URL", type: "url" },
        { name: "tiktok", title: "TikTok Profile URL", type: "url" },
        { name: "youtube", title: "YouTube Channel URL", type: "url" },
      ],
    }),

    // 5. CURRENCY
    defineField({
      name: "currency",
      title: "Default Currency Symbol / Code",
      type: "string",
      fieldset: "currency",
      initialValue: "DZD",
    }),
    defineField({
      name: "currencyPosition",
      title: "Currency Position",
      type: "string",
      fieldset: "currency",
      options: {
        list: [
          { title: "After Amount (e.g. 8 900 000 DZD)", value: "after" },
          { title: "Before Amount (e.g. DZD 8 900 000)", value: "before" },
        ],
      },
      initialValue: "after",
    }),

    // 6. DEFAULT SEO
    defineField({
      name: "defaultSEO",
      title: "Default Website SEO",
      type: "object",
      fieldset: "seo",
      fields: [
        { name: "title", title: "Default Meta Title", type: "localizedString" },
        { name: "description", title: "Default Meta Description", type: "localizedText" },
      ],
    }),
    defineField({
      name: "defaultOgImage",
      title: "Default Open Graph Social Sharing Image",
      type: "image",
      fieldset: "seo",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      title: "businessName",
    },
    prepare({ title }) {
      return {
        title: title || "CINECAR Site Settings",
        subtitle: "Global Singleton Configuration",
      };
    },
  },
});
