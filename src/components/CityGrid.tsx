import Link from "next/link";
import { FEATURED_CITIES } from "@/lib/cities";
import type { Locale } from "@/lib/i18n/dictionaries";

export default function CityGrid({ locale }: { locale: Locale }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {FEATURED_CITIES.map((city) => (
        <Link
          key={city.slug}
          href={`/rishta/${city.slug}`}
          className="rounded-xl border border-brand-100 bg-white px-4 py-3 text-center font-medium text-brand-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          {locale === "ur" ? `رشتہ ${city.nameUr}` : `Rishta ${city.nameEn}`}
        </Link>
      ))}
    </div>
  );
}
