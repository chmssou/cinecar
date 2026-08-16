import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { formatNumber, formatPrice, getDictionary, Locale } from "@/lib/i18n";
import { urlFor } from "@/sanity/lib/image";

interface CarCardProps {
  car: any;
  locale: Locale;
}

export function CarCard({ car, locale }: CarCardProps) {
  const dict = getDictionary(locale);
  const isRtl = locale === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const {
    displayTitle,
    slug,
    stockNumber,
    year,
    mileage,
    fuel,
    transmission,
    price,
    showPrice,
    oldPrice,
    salesStatus,
    images,
  } = car;

  const primaryImage = images && images.length > 0 ? images[0] : null;
  const imageUrl = primaryImage
    ? urlFor(primaryImage).width(800).height(500).quality(88).url()
    : "/placeholder-car.jpg";

  const statusTextMap: Record<string, string> = {
    available: dict.status.available,
    not_available: dict.status.not_available,
    reserved: dict.status.reserved,
    sold: dict.status.sold,
  };

  const statusColorMap: Record<string, string> = {
    available: "text-emerald-400/90",
    not_available: "text-rose-400/90",
    reserved: "text-amber-400/90",
    sold: "text-rose-400/90",
  };

  const transmissionText = transmission
    ? (dict.transmissionTypes as any)[transmission] || transmission
    : null;

  const specParts = [
    year ? `${year}` : null,
    mileage !== undefined && mileage !== null ? `${formatNumber(mileage)} KM` : null,
    transmissionText ? `${transmissionText}` : null,
  ].filter(Boolean);

  const specLine = specParts.join(" · ");

  const targetUrl = `/${locale}/cars/${slug?.current || "#"}`;
  const viewLabel = locale === "ar" ? "عرض السيارة" : "VOIR LE VÉHICULE";

  return (
    <Link
      href={targetUrl}
      className="group relative flex flex-col justify-between h-full rounded-[3px] bg-[#070C14] border border-white/5 p-3.5 sm:p-4 transition-all duration-300 hover:border-white/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-blue/5 focus:outline-none"
    >
      <div className="space-y-3.5">
        {/* Photography First Image Container — 16:10 Aspect Ratio */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[2px] bg-[#05080D]">
          {primaryImage ? (
            <Image
              src={imageUrl}
              alt={primaryImage.alt || displayTitle || "Vehicle"}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-all duration-500 ease-out group-hover:scale-[1.03] group-hover:brightness-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-white/40 font-label-caps text-[10px] uppercase tracking-widest">
              SHOWROOM VEHICLE
            </div>
          )}

          {/* Minimal Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#04070C]/60 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-40" />

          {/* Status Badge Overlay */}
          <div className="absolute bottom-2.5 start-3 end-3 flex items-center justify-between z-10 font-label-caps text-[10px] tracking-wider uppercase">
            <span className={`font-semibold ${statusColorMap[salesStatus] || statusColorMap.available}`}>
              {statusTextMap[salesStatus] || dict.status.available}
            </span>
          </div>
        </div>

        {/* Title & Price Hierarchy */}
        <div className="space-y-1.5 px-0.5">
          <h3 className="line-clamp-1 text-base sm:text-[17px] font-bold text-white uppercase tracking-wide group-hover:text-brand-blue transition-colors font-display" dir="auto">
            {displayTitle}
          </h3>

          <div className="flex items-baseline gap-2 flex-wrap">
            {showPrice && price ? (
              oldPrice && oldPrice > price ? (
                <>
                  <span className="text-xs font-mono text-red-500/80 line-through" dir="ltr">
                    {formatPrice(oldPrice, car.currency, locale)}
                  </span>
                  <span className="text-base sm:text-lg font-extrabold text-emerald-400 tracking-tight font-display" dir="ltr">
                    {formatPrice(price, car.currency, locale)}
                  </span>
                </>
              ) : (
                <span className="text-base sm:text-lg font-extrabold text-brand-blue tracking-tight font-display" dir="ltr">
                  {formatPrice(price, car.currency, locale)}
                </span>
              )
            ) : (
              <span className="font-label-caps text-xs font-semibold text-brand-blue uppercase tracking-wider">
                {dict.status.contactForPrice}
              </span>
            )}
          </div>

          {specLine && (
            <p className="font-label-caps text-[11px] uppercase tracking-wider text-white/60 pt-0.5">
              {specLine}
            </p>
          )}
        </div>
      </div>

      {/* Editorial View Action Footer */}
      <div className="pt-3 border-t border-white/5 mt-3 flex items-center justify-between text-[11px] font-bold font-label-caps uppercase tracking-widest text-brand-blue transition-colors group-hover:text-white">
        <span>{viewLabel}</span>
        <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
      </div>
    </Link>
  );
}
