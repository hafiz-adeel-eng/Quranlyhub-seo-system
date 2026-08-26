import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CITIES, CITY_SLUGS, getCityBySlug } from "@/lib/cities";
import { getDictionary, getLocale } from "@/lib/i18n/getDictionary";
import { prisma } from "@/lib/prisma";
import ProfileCard from "@/components/ProfileCard";
import SearchForm from "@/components/SearchForm";
import type { Gender } from "@/lib/enums";

export function generateStaticParams() {
  return CITY_SLUGS.map((city) => ({ city }));
}

export function generateMetadata({ params }: { params: { city: string } }): Metadata {
  const city = getCityBySlug(params.city);
  if (!city) return {};
  const locale = getLocale();

  const title =
    locale === "ur"
      ? `رشتہ ${city.nameUr} | ${city.nameUr} میں شادی کے لیے رشتے`
      : `Rishta ${city.nameEn} | Marriage Profiles in ${city.nameEn}, Pakistan`;
  const description =
    locale === "ur"
      ? `${city.nameUr} میں شادی کے خواہشمند لڑکے اور لڑکیوں کی مستند پروفائلز۔ مفت پروفائل بنائیں اور ${city.nameUr} میں اپنا رشتہ تلاش کریں۔`
      : `Browse verified marriage profiles of men and women in ${city.nameEn}, Pakistan. Create a free profile and find your rishta in ${city.nameEn} today.`;

  return {
    title,
    description,
    alternates: { canonical: `/rishta/${city.slug}` },
    openGraph: { title, description },
  };
}

export default async function CityLandingPage({
  params,
  searchParams,
}: {
  params: { city: string };
  searchParams: { gender?: string };
}) {
  const city = getCityBySlug(params.city);
  if (!city) notFound();

  const locale = getLocale();
  const dict = getDictionary(locale);
  const gender: Gender = searchParams.gender === "MALE" ? "MALE" : "FEMALE";

  const profiles = await prisma.profile.findMany({
    where: { city: { slug: city.slug }, gender, isPublished: true },
    include: { city: true },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  const cityName = locale === "ur" ? city.nameUr : city.nameEn;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav className="mb-4 text-sm text-gray-500">
        <Link href="/" className="hover:text-brand-700">{dict.nav.home}</Link>
        <span className="mx-1">/</span>
        <span>{locale === "ur" ? `رشتہ ${cityName}` : `Rishta ${cityName}`}</span>
      </nav>

      <h1 className="text-3xl font-bold text-brand-800">
        {locale === "ur" ? `رشتہ ${cityName}` : `Rishta ${cityName}`}
      </h1>
      <p className="mt-2 max-w-2xl text-gray-600">
        {locale === "ur"
          ? `${cityName} میں شادی کے لیے تصدیق شدہ لڑکے اور لڑکیوں کی پروفائلز دیکھیں اور اپنی مفت پروفائل بنائیں۔`
          : `Browse verified rishta profiles from ${cityName} and create your own free profile.`}
      </p>

      <div className="mt-6">
        <SearchForm dict={dict} locale={locale} defaultCity={city.slug} />
      </div>

      <div className="mt-8 flex gap-2">
        <Link
          href={`/rishta/${city.slug}?gender=FEMALE`}
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            gender === "FEMALE" ? "bg-brand-600 text-white" : "bg-white border border-brand-200 text-brand-700"
          }`}
        >
          {dict.search.forSon}
        </Link>
        <Link
          href={`/rishta/${city.slug}?gender=MALE`}
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            gender === "MALE" ? "bg-brand-600 text-white" : "bg-white border border-brand-200 text-brand-700"
          }`}
        >
          {dict.search.forDaughter}
        </Link>
      </div>

      {profiles.length === 0 ? (
        <p className="mt-10 text-gray-500">{dict.search.noResults}</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((p) => (
            <ProfileCard key={p.id} profile={p} dict={dict} locale={locale} />
          ))}
        </div>
      )}

      <section className="mt-14 border-t border-brand-100 pt-8">
        <h2 className="mb-3 text-lg font-semibold text-brand-800">
          {locale === "ur" ? "پاکستان کے دیگر شہر" : "Other Cities in Pakistan"}
        </h2>
        <div className="flex flex-wrap gap-2">
          {CITIES.filter((c) => c.slug !== city.slug && c.featured).map((c) => (
            <Link
              key={c.slug}
              href={`/rishta/${c.slug}`}
              className="rounded-full border border-brand-100 bg-white px-3 py-1 text-sm text-brand-700 hover:bg-brand-50"
            >
              {locale === "ur" ? `رشتہ ${c.nameUr}` : `Rishta ${c.nameEn}`}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
