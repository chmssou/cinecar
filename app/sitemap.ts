import { MetadataRoute } from "next";
import { getAllCarSlugs } from "@/sanity/lib/fetch";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/ar`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/fr`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/ar/cars`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/fr/cars`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  try {
    const cars = await getAllCarSlugs();
    const carRoutes: MetadataRoute.Sitemap = cars.flatMap((car) => [
      {
        url: `${siteUrl}/ar/cars/${car.slug}`,
        lastModified: car._updatedAt ? new Date(car._updatedAt) : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      },
      {
        url: `${siteUrl}/fr/cars/${car.slug}`,
        lastModified: car._updatedAt ? new Date(car._updatedAt) : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      },
    ]);

    return [...staticRoutes, ...carRoutes];
  } catch (err) {
    return staticRoutes;
  }
}
