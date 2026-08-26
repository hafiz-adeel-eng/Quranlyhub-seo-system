import { getDictionary, getLocale } from "@/lib/i18n/getDictionary";
import { prisma } from "@/lib/prisma";
import { getCityBySlug } from "@/lib/cities";
import SearchForm from "@/components/SearchForm";
import ProfileCard from "@/components/ProfileCard";
import type { Gender } from "@/lib/enums";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  const dict = getDictionary(getLocale());
  return { title: `${dict.search.title} | ${dict.siteName}` };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { city?: string; lookingFor?: string; minAge?: string; maxAge?: string };
}) {
  const locale = getLocale();
  const dict = getDictionary(locale);

  const citySlug = searchParams.city && searchParams.city !== "all" ? searchParams.city : undefined;
  const city = citySlug ? getCityBySlug(citySlug) : undefined;
  const lookingFor: Gender | undefined =
    searchParams.lookingFor === "MALE" || searchParams.lookingFor === "FEMALE"
      ? (searchParams.lookingFor as Gender)
      : undefined;

  const where: Record<string, unknown> = { isPublished: true };
  if (city) where.city = { slug: city.slug };
  if (lookingFor) where.gender = lookingFor;
  if (searchParams.minAge || searchParams.maxAge) {
    where.age = {
      ...(searchParams.minAge ? { gte: parseInt(searchParams.minAge, 10) } : {}),
      ...(searchParams.maxAge ? { lte: parseInt(searchParams.maxAge, 10) } : {}),
    };
  }

  const profiles = await prisma.profile.findMany({
    where,
    include: { city: true },
    orderBy: { createdAt: "desc" },
    take: 60,
  });

  const cityLabel = city ? (locale === "ur" ? city.nameUr : city.nameEn) : dict.search.allPakistan;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold text-brand-800">{dict.search.title}</h1>

      <div className="mt-6">
        <SearchForm dict={dict} locale={locale} defaultCity={citySlug ?? "all"} />
      </div>

      <p className="mt-6 text-sm text-gray-500">
        {dict.search.resultsFor} {cityLabel} — {profiles.length}
      </p>

      {profiles.length === 0 ? (
        <p className="mt-8 text-gray-500">{dict.search.noResults}</p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((p) => (
            <ProfileCard key={p.id} profile={p} dict={dict} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
