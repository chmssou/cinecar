import { client } from "./client";
import {
  BRANDS_QUERY,
  CAR_PROJECTION,
  FilterParams,
  MODELS_QUERY,
  SITE_SETTINGS_QUERY,
} from "./queries";

export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
  revalidate = 60,
}: {
  query: string;
  params?: Record<string, any>;
  tags?: string[];
  revalidate?: number | false;
}): Promise<T> {
  try {
    return await client.fetch<T>(query, params, {
      next: {
        tags,
        revalidate,
      },
    });
  } catch (err: any) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Sanity] Query failed:", err?.message || err);
    }
    return (null as unknown) as T;
  }
}

export async function getSiteSettings() {
  return sanityFetch<any>({
    query: SITE_SETTINGS_QUERY,
    tags: ["site-settings"],
    revalidate: 0,
  });
}

export async function getBrands() {
  const res = await sanityFetch<any[]>({
    query: BRANDS_QUERY,
    tags: ["brands"],
    revalidate: 0,
  });
  return res || [];
}

export async function getModels() {
  const res = await sanityFetch<any[]>({
    query: MODELS_QUERY,
    tags: ["models"],
    revalidate: 0,
  });
  return res || [];
}

export async function getCars(filters: FilterParams = {}) {
  const {
    q,
    brand,
    model,
    yearFrom,
    yearTo,
    fuel,
    transmission,
    minPrice,
    maxPrice,
    minMileage,
    maxMileage,
    status,
    sort = "newest",
    page = 1,
  } = filters;

  const pageSize = 12;
  const conditions: string[] = ['_type == "car"', "archived != true"];
  const params: Record<string, any> = {};

  if (q && q.trim()) {
    conditions.push(
      `[vehicleName, titleOverride, brand->name, string(brand), model->name, string(model)][defined(@)] match $qPattern`
    );
    params.qPattern = `${q.trim()}*`;
  }

  if (brand && brand !== "all") {
    conditions.push("(brand->slug.current == $brand || lower(string(brand)) == lower($brand) || lower(brand->name) == lower($brand))");
    params.brand = brand;
  }

  if (model && model !== "all") {
    conditions.push("(model->slug.current == $model || lower(string(model)) == lower($model) || lower(model->name) == lower($model))");
    params.model = model;
  }

  if (yearFrom) {
    conditions.push("year >= $yearFrom");
    params.yearFrom = Number(yearFrom);
  }

  if (yearTo) {
    conditions.push("year <= $yearTo");
    params.yearTo = Number(yearTo);
  }

  if (fuel && fuel !== "all") {
    conditions.push("fuel == $fuel");
    params.fuel = fuel;
  }

  if (transmission && transmission !== "all") {
    conditions.push("transmission == $transmission");
    params.transmission = transmission;
  }

  if (minPrice !== undefined && minPrice !== null && !isNaN(minPrice)) {
    conditions.push("price >= $minPrice");
    params.minPrice = Number(minPrice);
  }

  if (maxPrice !== undefined && maxPrice !== null && !isNaN(maxPrice)) {
    conditions.push("price <= $maxPrice");
    params.maxPrice = Number(maxPrice);
  }

  if (minMileage !== undefined && minMileage !== null && !isNaN(minMileage)) {
    conditions.push("mileage >= $minMileage");
    params.minMileage = Number(minMileage);
  }

  if (maxMileage !== undefined && maxMileage !== null && !isNaN(maxMileage)) {
    conditions.push("mileage <= $maxMileage");
    params.maxMileage = Number(maxMileage);
  }

  if (status === "all") {
    // Show all vehicles if user explicitly chooses 'all'
  } else if (status === "not_available") {
    conditions.push('(salesStatus == "not_available" || salesStatus == "NOT AVAILABLE" || salesStatus == "sold" || salesStatus == "reserved")');
  } else if (status && status !== "available") {
    conditions.push('(salesStatus == $status || lower(salesStatus) == lower($status))');
    params.status = status;
  } else {
    // Default: Exclude unavailable vehicles from public catalog listing
    conditions.push('(salesStatus == "available" || salesStatus == "AVAILABLE" || !defined(salesStatus))');
  }

  const filterString = conditions.join(" && ");

  let sortClause = "| order(priority desc, _createdAt desc)";
  if (sort === "price_asc") sortClause = "| order(price asc)";
  if (sort === "price_desc") sortClause = "| order(price desc)";
  if (sort === "year_desc") sortClause = "| order(year desc)";
  if (sort === "mileage_asc") sortClause = "| order(mileage asc)";
  if (sort === "newest") sortClause = "| order(_createdAt desc)";

  const currentPage = Math.max(1, Number(page) || 1);
  const start = (currentPage - 1) * pageSize;
  const end = currentPage * pageSize;

  const query = `{
    "vehicles": *[${filterString}] ${sortClause} [${start}...${end}] {
      ${CAR_PROJECTION}
    },
    "total": count(*[${filterString}])
  }`;

  const data = await sanityFetch<{ vehicles: any[]; total: number }>({
    query,
    params,
    tags: ["cars"],
    revalidate: 0,
  });

  const total = data?.total || 0;
  const vehicles = data?.vehicles || [];
  const totalPages = Math.ceil(total / pageSize) || 1;

  return {
    vehicles,
    total,
    totalPages,
    currentPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
}

export async function getCarBySlug(slug: string) {
  const query = `*[_type == "car" && (slug.current == $slug || _id == $slug) && archived != true][0] {
    ${CAR_PROJECTION}
  }`;
  return sanityFetch<any>({
    query,
    params: { slug },
    tags: ["cars"],
    revalidate: 0,
  });
}

export async function getHomepageShowcaseData(limit = 6) {
  const filterCondition = `_type == "car" && archived != true && !(_id in $testDuplicateIds) && (salesStatus == "available" || salesStatus == "AVAILABLE" || !defined(salesStatus))`;
  const query = `{
    "vehicles": *[${filterCondition}] | order(_createdAt desc)[0...${limit}] {
      ${CAR_PROJECTION}
    },
    "totalAvailable": count(*[${filterCondition}])
  }`;
  const res = await sanityFetch<{ vehicles: any[]; totalAvailable: number }>({
    query,
    params: {
      testDuplicateIds: [
        "19a40590-1046-4463-af19-14b9da7a7e66",
        "544ad89a-2019-43c6-8e75-00f3f02b96e9",
        "8c9f04c6-5983-4a24-82bd-5855f8ef5eff",
        "97b2b8cd-88e5-4a77-a79d-39466c96374a",
        "e4cbd9a6-6f1f-4b36-adff-25ee189ea60e",
        "e9f2c71c-c4a8-431c-9654-65d292c9d245",
      ],
    },
    tags: ["cars"],
    revalidate: 0,
  });
  return {
    vehicles: res?.vehicles || [],
    totalAvailable: res?.totalAvailable || 0,
  };
}

export async function getLatestCars(limit = 6) {
  const query = `*[_type == "car" && archived != true && !(_id in $testDuplicateIds) && (salesStatus == "available" || salesStatus == "AVAILABLE" || !defined(salesStatus))] | order(_createdAt desc)[0...${limit}] {
    ${CAR_PROJECTION}
  }`;
  const res = await sanityFetch<any[]>({
    query,
    params: {
      testDuplicateIds: [
        "19a40590-1046-4463-af19-14b9da7a7e66",
        "544ad89a-2019-43c6-8e75-00f3f02b96e9",
        "8c9f04c6-5983-4a24-82bd-5855f8ef5eff",
        "97b2b8cd-88e5-4a77-a79d-39466c96374a",
        "e4cbd9a6-6f1f-4b36-adff-25ee189ea60e",
        "e9f2c71c-c4a8-431c-9654-65d292c9d245",
      ],
    },
    tags: ["cars"],
    revalidate: 0,
  });
  return res || [];
}

export async function getFeaturedCars(limit = 3) {
  const query = `*[_type == "car" && archived != true && !(_id in $testDuplicateIds) && (featured == true || priority > 50) && (salesStatus == "available" || salesStatus == "AVAILABLE" || !defined(salesStatus))] | order(priority desc, _createdAt desc)[0...${limit}] {
    ${CAR_PROJECTION}
  }`;
  const res = await sanityFetch<any[]>({
    query,
    params: {
      testDuplicateIds: [
        "19a40590-1046-4463-af19-14b9da7a7e66",
        "544ad89a-2019-43c6-8e75-00f3f02b96e9",
        "8c9f04c6-5983-4a24-82bd-5855f8ef5eff",
        "97b2b8cd-88e5-4a77-a79d-39466c96374a",
        "e4cbd9a6-6f1f-4b36-adff-25ee189ea60e",
        "e9f2c71c-c4a8-431c-9654-65d292c9d245",
      ],
    },
    tags: ["cars"],
    revalidate: 0,
  });
  return res || [];
}

export async function getSimilarCars(
  carId: string,
  brandSlug?: string,
  modelSlug?: string,
  price?: number,
  limit = 4
) {
  const query = `*[_type == "car" && _id != $carId && archived != true && !(_id in $testDuplicateIds) && (salesStatus == "available" || salesStatus == "AVAILABLE" || !defined(salesStatus))] | order(priority desc, _createdAt desc)[0...${limit}] {
    ${CAR_PROJECTION}
  }`;
  const res = await sanityFetch<any[]>({
    query,
    params: {
      carId,
      testDuplicateIds: [
        "19a40590-1046-4463-af19-14b9da7a7e66",
        "544ad89a-2019-43c6-8e75-00f3f02b96e9",
        "8c9f04c6-5983-4a24-82bd-5855f8ef5eff",
        "97b2b8cd-88e5-4a77-a79d-39466c96374a",
        "e4cbd9a6-6f1f-4b36-adff-25ee189ea60e",
        "e9f2c71c-c4a8-431c-9654-65d292c9d245",
      ],
    },
    tags: ["cars"],
    revalidate: 0,
  });
  return res || [];
}

export async function getAllCarSlugs() {
  const query = `*[_type == "car" && archived != true && defined(slug.current)]{
    "slug": slug.current,
    _updatedAt
  }`;
  const res = await sanityFetch<any[]>({
    query,
    tags: ["cars"],
    revalidate: 0,
  });
  return res || [];
}
