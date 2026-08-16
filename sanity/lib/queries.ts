import { client } from "./client";

export interface FilterParams {
  q?: string;
  brand?: string;
  model?: string;
  yearFrom?: number;
  yearTo?: number;
  fuel?: string;
  transmission?: string;
  minPrice?: number;
  maxPrice?: number;
  minMileage?: number;
  maxMileage?: number;
  status?: string;
  sort?: string;
  page?: number;
}

export const CAR_PROJECTION = `
  _id,
  _createdAt,
  "displayTitle": select(
    defined(vehicleName) && vehicleName != "" => vehicleName,
    defined(titleOverride) && titleOverride != "" => titleOverride,
    select(defined(brand->name) => brand->name, defined(brand) => string(brand), "") + " " + select(defined(model->name) => model->name, defined(model) => string(model), "") + select(defined(trim) && trim != "" => " " + trim, "") + " " + select(defined(year) => string(year), "")
  ),
  vehicleName,
  "slug": select(
    defined(slug.current) => slug,
    { "current": _id }
  ),
  "stockNumber": select(
    defined(stockNumber) && stockNumber != "" => stockNumber,
    "CINE-" + _id
  ),
  "brand": select(
    defined(brand->name) => brand->{ name, slug, country, logo },
    defined(brand) => { "name": string(brand) },
    null
  ),
  "model": select(
    defined(model->name) => model->{ name, slug },
    defined(model) => { "name": string(model) },
    null
  ),
  trim,
  year,
  vehicleType,
  salesStatus,
  archived,
  featured,
  priority,
  price,
  showPrice,
  oldPrice,
  currency,
  mileage,
  fuel,
  transmission,
  engine,
  engineCapacity,
  power,
  driveType,
  exteriorColor,
  interiorColor,
  doors,
  seats,
  condition,
  origin,
  registration,
  vinInternal,
  publicVinSuffix,
  features,
  shortDescription,
  "description": select(
    defined(description.ar) || defined(description.fr) => description,
    defined(description) => { "ar": string(description), "fr": string(description) },
    null
  ),
  images,
  videoUrl,
  seoTitle,
  seoDescription
`;

export const SITE_SETTINGS_QUERY = `
  *[_type == "siteSettings" && _id == "siteSettings"][0]{
    businessName,
    logo,
    favicon,
    footerDescription,
    whatsappNumber,
    phoneNumbers,
    email,
    address,
    googleMapsUrl,
    socialLinks,
    currency,
    currencyPosition,
    defaultSEO,
    defaultOgImage,
    heroEyebrow,
    heroContent,
    heroImage,
    heroVideo,
    "heroVideoFileUrl": heroVideoFile.asset->url
  }
`;

export const BRANDS_QUERY = `
  *[_type == "brand" && active == true] | order(sortOrder asc, name asc){
    _id,
    name,
    slug,
    logo,
    country
  }
`;

export const MODELS_QUERY = `
  *[_type == "carModel" && active == true] | order(sortOrder asc, name asc){
    _id,
    name,
    slug,
    "brandSlug": brand->slug.current
  }
`;
