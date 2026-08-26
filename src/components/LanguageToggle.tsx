"use client";

import { usePathname, useSearchParams } from "next/navigation";
import type { Locale } from "@/lib/i18n/dictionaries";

export default function LanguageToggle({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const current = query ? `${pathname}?${query}` : pathname;
  const target = locale === "ur" ? "en" : "ur";

  return (
    <a
      href={`/api/locale?to=${target}&redirect=${encodeURIComponent(current)}`}
      className="rounded-full border border-brand-600 px-3 py-1 text-sm font-semibold text-brand-700 hover:bg-brand-600 hover:text-white transition-colors"
    >
      {label}
    </a>
  );
}
