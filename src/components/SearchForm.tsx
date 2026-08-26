"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CITIES } from "@/lib/cities";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";

type Props = {
  dict: Dictionary;
  locale: Locale;
  defaultCity?: string; // "all" or a city slug — lets a city landing page pre-select itself
};

export default function SearchForm({ dict, locale, defaultCity = "all" }: Props) {
  const router = useRouter();
  const [city, setCity] = useState(defaultCity);
  const [lookingFor, setLookingFor] = useState("FEMALE");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("city", city);
    params.set("lookingFor", lookingFor);
    if (minAge) params.set("minAge", minAge);
    if (maxAge) params.set("maxAge", maxAge);
    router.push(`/search?${params.toString()}`);
  }

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none bg-white";

  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 gap-3 rounded-2xl border border-brand-100 bg-white p-4 shadow-sm sm:grid-cols-5 sm:items-end"
    >
      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-medium">{dict.search.city}</label>
        <select value={city} onChange={(e) => setCity(e.target.value)} className={inputClass}>
          <option value="all">{dict.search.allPakistan}</option>
          {CITIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {locale === "ur" ? c.nameUr : c.nameEn}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">{dict.search.lookingFor}</label>
        <select value={lookingFor} onChange={(e) => setLookingFor(e.target.value)} className={inputClass}>
          <option value="FEMALE">{dict.search.forSon}</option>
          <option value="MALE">{dict.search.forDaughter}</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">{dict.search.ageMin}</label>
        <input
          type="number"
          min={18}
          max={80}
          value={minAge}
          onChange={(e) => setMinAge(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">{dict.search.ageMax}</label>
        <input
          type="number"
          min={18}
          max={80}
          value={maxAge}
          onChange={(e) => setMaxAge(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="sm:col-span-5">
        <button
          type="submit"
          className="w-full rounded-lg bg-gold-500 py-2.5 font-semibold text-white hover:bg-gold-600 sm:w-auto sm:px-8"
        >
          {dict.search.searchBtn}
        </button>
      </div>
    </form>
  );
}
