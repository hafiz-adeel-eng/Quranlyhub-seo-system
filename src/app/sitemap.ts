import type { MetadataRoute } from "next";
import { CITY_SLUGS } from "@/lib/cities";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/search`, changeFrequency: "daily", priority: 0.8 },
  ];

  const cityRoutes: MetadataRoute.Sitemap = CITY_SLUGS.map((slug) => ({
    url: `${baseUrl}/rishta/${slug}`,
    changeFrequency: "daily",
    priority: 0.9,
  }));

  const profiles = await prisma.profile.findMany({
    where: { isPublished: true },
    select: { id: true, updatedAt: true },
    take: 5000,
    orderBy: { updatedAt: "desc" },
  });
  const profileRoutes: MetadataRoute.Sitemap = profiles.map((p) => ({
    url: `${baseUrl}/profile/${p.id}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...cityRoutes, ...profileRoutes];
}
