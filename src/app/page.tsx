import Link from "next/link";
import { getDictionary, getLocale } from "@/lib/i18n/getDictionary";
import { prisma } from "@/lib/prisma";
import SearchForm from "@/components/SearchForm";
import CityGrid from "@/components/CityGrid";
import ProfileCard from "@/components/ProfileCard";

export default async function HomePage() {
  const locale = getLocale();
  const dict = getDictionary(locale);

  const latestProfiles = await prisma.profile.findMany({
    where: { isPublished: true },
    include: { city: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <div>
      <section className="bg-gradient-to-b from-brand-100 to-brand-50 px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold text-brand-900 sm:text-4xl">{dict.home.heroTitle}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600">{dict.home.heroSubtitle}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/profile/new"
              className="rounded-full bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700"
            >
              {dict.home.ctaCreate}
            </Link>
            <Link
              href="/search"
              className="rounded-full border border-brand-600 px-6 py-3 font-semibold text-brand-700 hover:bg-white"
            >
              {dict.home.ctaSearch}
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-4xl">
          <SearchForm dict={dict} locale={locale} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-bold text-brand-800">{dict.home.citiesTitle}</h2>
        <p className="mt-1 text-gray-600">{dict.home.citiesSubtitle}</p>
        <div className="mt-6">
          <CityGrid locale={locale} />
        </div>
      </section>

      {latestProfiles.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-brand-800">{dict.home.latestTitle}</h2>
            <Link href="/search" className="text-sm font-semibold text-brand-700">
              {dict.home.viewAll}
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latestProfiles.map((p) => (
              <ProfileCard key={p.id} profile={p} dict={dict} locale={locale} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-center text-2xl font-bold text-brand-800">{dict.home.howTitle}</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            [dict.home.step1, dict.home.step1desc],
            [dict.home.step2, dict.home.step2desc],
            [dict.home.step3, dict.home.step3desc],
          ].map(([title, desc], i) => (
            <div key={title} className="rounded-2xl border border-brand-100 bg-white p-6 text-center shadow-sm">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 font-bold text-white">
                {i + 1}
              </div>
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <p className="mt-1 text-sm text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
