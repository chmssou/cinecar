import type { Metadata } from "next";
import { getDictionary, Locale } from "@/lib/i18n";
import { getBrands, getCars, getModels } from "@/sanity/lib/fetch";
import { CarCard } from "@/components/CarCard";
import { CarFilters } from "@/components/CarFilters";
import { Pagination } from "@/components/Pagination";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = locale as Locale;

  return {
    title: currentLocale === "ar" ? "جميع الإعلانات | CINECAR" : "Toutes les Annonces | CINECAR",
    description:
      currentLocale === "ar"
        ? "تصفح جميع الإعلانات المتاحة للبيع والاستيراد مع فلترة متقدمة للأسعار والمواصفات"
        : "Recherchez et filtrez l'ensemble de nos annonces disponibles à la vente et en arrivage",
  };
}

export default async function CarsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const currentLocale = locale as Locale;
  const dict = getDictionary(currentLocale);

  const filters = {
    q: typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q : undefined,
    brand: typeof resolvedSearchParams.brand === "string" ? resolvedSearchParams.brand : undefined,
    model: typeof resolvedSearchParams.model === "string" ? resolvedSearchParams.model : undefined,
    yearFrom: typeof resolvedSearchParams.yearFrom === "string" ? Number(resolvedSearchParams.yearFrom) : undefined,
    yearTo: typeof resolvedSearchParams.yearTo === "string" ? Number(resolvedSearchParams.yearTo) : undefined,
    fuel: typeof resolvedSearchParams.fuel === "string" ? resolvedSearchParams.fuel : undefined,
    transmission: typeof resolvedSearchParams.transmission === "string" ? resolvedSearchParams.transmission : undefined,
    minPrice: typeof resolvedSearchParams.minPrice === "string" ? Number(resolvedSearchParams.minPrice) : undefined,
    maxPrice: typeof resolvedSearchParams.maxPrice === "string" ? Number(resolvedSearchParams.maxPrice) : undefined,
    minMileage: typeof resolvedSearchParams.minMileage === "string" ? Number(resolvedSearchParams.minMileage) : undefined,
    maxMileage: typeof resolvedSearchParams.maxMileage === "string" ? Number(resolvedSearchParams.maxMileage) : undefined,
    status: typeof resolvedSearchParams.status === "string" ? resolvedSearchParams.status : undefined,
    sort: typeof resolvedSearchParams.sort === "string" ? resolvedSearchParams.sort : "newest",
    page: typeof resolvedSearchParams.page === "string" ? Number(resolvedSearchParams.page) : 1,
  };

  let inventory: {
    vehicles: any[];
    total: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } = { vehicles: [], total: 0, totalPages: 1, currentPage: 1, hasNextPage: false, hasPrevPage: false };
  let brands: any[] = [];
  let models: any[] = [];
  let hasError = false;

  try {
    const [invRes, brandRes, modelRes] = await Promise.all([
      getCars(filters),
      getBrands(),
      getModels(),
    ]);
    if (invRes) inventory = invRes;
    if (brandRes) brands = brandRes;
    if (modelRes) models = modelRes;
  } catch (err) {
    console.error("[CarsPage] Error fetching inventory:", err);
    hasError = true;
  }

  const { vehicles, total, totalPages, currentPage, hasNextPage, hasPrevPage } = inventory;

  const countText =
    currentLocale === "ar"
      ? `${total} إعلانات متاحة`
      : `${total} annonce${total > 1 ? "s" : ""} disponible${total > 1 ? "s" : ""}`;

  return (
    <div className="mx-auto max-w-container px-gutter pt-24 pb-20 sm:pb-24">
      {/* Header Title */}
      <div className="mb-8 flex flex-col gap-1 border-b border-white/10 pb-6">
        <span className="font-label-caps text-label-caps text-brand-blue uppercase">
          {dict.nav.cars}
        </span>
        <h1 className="text-3xl font-extrabold text-brand-text font-cairo sm:text-4xl uppercase">
          {currentLocale === "ar" ? "جميع الإعلانات" : "TOUTES LES ANNONCES"}
        </h1>
        <p className="font-label-caps text-xs text-brand-muted mt-1 font-semibold">
          {countText}
        </p>
      </div>

      {/* Filter Component */}
      <CarFilters locale={currentLocale} brands={brands || []} models={models || []} />

      {/* Inventory Grid */}
      {hasError ? (
        <div className="mt-16 py-16 text-center space-y-4 max-w-md mx-auto border border-dashed border-rose-500/20 rounded bg-rose-500/5 p-6">
          <h3 className="text-lg font-bold text-white uppercase">
            {currentLocale === "ar" ? "تعذر تحميل الإعلانات حالياً" : "IMPOSSIBLE DE CHARGER LES ANNONCES"}
          </h3>
          <p className="font-label-caps text-xs text-brand-muted leading-relaxed">
            {currentLocale === "ar"
              ? "يرجى إعادة المحاولة لاحقاً أو التواصل معنا مباشرة عبر واتساب."
              : "VEUILLEZ RÉESSAYER ULTÉRIEUREMENT OU NOUS CONTACTER DIRECTEMENT VIA WHATSAPP."}
          </p>
        </div>
      ) : vehicles.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((car) => (
            <CarCard key={car._id} car={car} locale={currentLocale} />
          ))}
        </div>
      ) : (
        <div className="mt-16 py-16 text-center space-y-4 max-w-md mx-auto">
          <span className="font-label-caps text-[10px] text-brand-blue uppercase tracking-widest block">
            {currentLocale === "ar" ? "لا توجد نتائج" : "AUCUNE ANNONCE CORRESPONDANTE"}
          </span>
          <h3 className="text-2xl font-extrabold text-white font-cairo uppercase">
            {currentLocale === "ar" ? "لم نجد إعلانات تفي بهذه المعايير" : "AUCUNE ANNONCE TROUVÉE"}
          </h3>
          <p className="font-label-caps text-xs text-brand-muted leading-relaxed">
            {currentLocale === "ar"
              ? "جرّب تغيير خيارات الفلترة أو إعادة ضبطها لعرض كافة الإعلانات."
              : "ESSAYEZ DE MODIFIER VOS CRITÈRES DE RECHERCHE OU DE LES RÉINITIALISER."}
          </p>
        </div>
      )}

      {/* Server Pagination */}
      <Pagination
        locale={currentLocale}
        currentPage={currentPage}
        totalPages={totalPages}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
      />
    </div>
  );
}


