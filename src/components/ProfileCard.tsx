import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";

type CardProfile = {
  id: string;
  fullName: string;
  age: number;
  gender: string;
  education?: string | null;
  profession?: string | null;
  city: { nameUr: string; nameEn: string };
  isVerified: boolean;
};

export default function ProfileCard({
  profile,
  dict,
  locale,
}: {
  profile: CardProfile;
  dict: Dictionary;
  locale: Locale;
}) {
  const initial = profile.fullName?.charAt(0)?.toUpperCase() || "?";
  const cityName = locale === "ur" ? profile.city.nameUr : profile.city.nameEn;

  return (
    <Link
      href={`/profile/${profile.id}`}
      className="block rounded-2xl border border-brand-100 bg-white p-4 shadow-sm transition hover:shadow-md hover:border-brand-300"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-100 text-lg font-bold text-brand-700">
          {initial}
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-gray-900">
            {profile.fullName}
            {profile.isVerified && (
              <span className="ms-2 rounded bg-gold-500/20 px-1.5 py-0.5 text-xs font-medium text-gold-600">
                {dict.profile.verified}
              </span>
            )}
          </p>
          <p className="text-sm text-gray-500">
            {profile.age} {dict.profile.years} · {cityName}
          </p>
        </div>
      </div>
      {(profile.profession || profile.education) && (
        <p className="mt-3 truncate text-sm text-gray-600">
          {[profile.education, profile.profession].filter(Boolean).join(" · ")}
        </p>
      )}
    </Link>
  );
}
