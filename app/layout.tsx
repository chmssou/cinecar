import type { Metadata } from "next";
import { Barlow_Condensed, Manrope, Noto_Kufi_Arabic, IBM_Plex_Sans_Arabic, Noto_Sans_Arabic } from "next/font/google";
import "@/app/globals.css";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-manrope",
  display: "swap",
});

const notoKufiArabic = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  weight: ["600", "700"],
  variable: "--font-noto-kufi",
  display: "swap",
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex",
  display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CineCar CAR SALES | Véhicules d'Exception & Importation",
  description: "Showroom automobile d'exception et service d'importation de véhicules de luxe en Algérie.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${barlowCondensed.variable} ${manrope.variable} ${notoKufiArabic.variable} ${ibmPlexSansArabic.variable} ${notoSansArabic.variable}`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen bg-brand-bg font-sans antialiased text-brand-text selection:bg-brand-blue selection:text-white"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
