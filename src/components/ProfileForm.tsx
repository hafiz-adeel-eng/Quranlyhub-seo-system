"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";
import { CITIES } from "@/lib/cities";

const SECTS = ["SUNNI", "SHIA", "AHLE_HADITH", "DEOBANDI", "BARELVI", "OTHER"] as const;
const MARITAL = ["SINGLE", "DIVORCED", "WIDOWED", "KHULA"] as const;

type Props = {
  dict: Dictionary;
  locale: Locale;
  initial?: Partial<Record<string, string>> & { cityId?: string };
};

export default function ProfileForm({ dict, locale }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    gender: "MALE",
    lookingForGender: "FEMALE",
    age: "",
    height: "",
    maritalStatus: "SINGLE",
    sect: "OTHER",
    caste: "",
    education: "",
    profession: "",
    income: "",
    citySlug: CITIES[0].slug,
    bio: "",
    contactPhone: "",
    contactWhatsapp: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      ...form,
      age: Number(form.age),
      bioUr: locale === "ur" ? form.bio : undefined,
      bioEn: locale === "en" ? form.bio : undefined,
    };

    const res = await fetch("/api/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong");
      setLoading(false);
      return;
    }

    const profile = await res.json();
    setLoading(false);
    router.push(`/profile/${profile.id}`);
    router.refresh();
  }

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none bg-white";
  const labelClass = "block text-sm font-medium mb-1";

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className={labelClass}>{dict.profileForm.fullName}</label>
        <input
          required
          value={form.fullName}
          onChange={(e) => update("fullName", e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>{dict.profileForm.gender}</label>
        <select value={form.gender} onChange={(e) => update("gender", e.target.value)} className={inputClass}>
          <option value="MALE">{dict.profileForm.male}</option>
          <option value="FEMALE">{dict.profileForm.female}</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>{dict.profileForm.lookingForGender}</label>
        <select
          value={form.lookingForGender}
          onChange={(e) => update("lookingForGender", e.target.value)}
          className={inputClass}
        >
          <option value="MALE">{dict.profileForm.male}</option>
          <option value="FEMALE">{dict.profileForm.female}</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>{dict.profileForm.age}</label>
        <input
          type="number"
          min={18}
          max={80}
          required
          value={form.age}
          onChange={(e) => update("age", e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>{dict.profileForm.height}</label>
        <input
          placeholder="5'6&quot;"
          value={form.height}
          onChange={(e) => update("height", e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>{dict.profileForm.maritalStatus}</label>
        <select
          value={form.maritalStatus}
          onChange={(e) => update("maritalStatus", e.target.value)}
          className={inputClass}
        >
          {MARITAL.map((m) => (
            <option key={m} value={m}>
              {dict.profileForm[m.toLowerCase() as "single"]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>{dict.profileForm.sect}</label>
        <select value={form.sect} onChange={(e) => update("sect", e.target.value)} className={inputClass}>
          {SECTS.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>{dict.profileForm.caste}</label>
        <input value={form.caste} onChange={(e) => update("caste", e.target.value)} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>{dict.profileForm.education}</label>
        <input
          value={form.education}
          onChange={(e) => update("education", e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>{dict.profileForm.profession}</label>
        <input
          value={form.profession}
          onChange={(e) => update("profession", e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>{dict.profileForm.income}</label>
        <input value={form.income} onChange={(e) => update("income", e.target.value)} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>{dict.profileForm.city}</label>
        <select
          value={form.citySlug}
          onChange={(e) => update("citySlug", e.target.value)}
          className={inputClass}
        >
          {CITIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {locale === "ur" ? c.nameUr : c.nameEn}
            </option>
          ))}
        </select>
      </div>

      <div className="sm:col-span-2">
        <label className={labelClass}>{dict.profileForm.bio}</label>
        <textarea
          rows={4}
          value={form.bio}
          onChange={(e) => update("bio", e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>{dict.profileForm.contactPhone}</label>
        <input
          required
          placeholder="03xx-xxxxxxx"
          value={form.contactPhone}
          onChange={(e) => update("contactPhone", e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>{dict.profileForm.contactWhatsapp}</label>
        <input
          placeholder="03xx-xxxxxxx"
          value={form.contactWhatsapp}
          onChange={(e) => update("contactWhatsapp", e.target.value)}
          className={inputClass}
        />
      </div>

      <p className="sm:col-span-2 rounded-lg bg-brand-50 p-3 text-xs text-brand-800">
        {dict.profileForm.privacyNote}
      </p>

      {error && <p className="sm:col-span-2 text-sm text-red-600">{error}</p>}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brand-600 py-3 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {dict.profileForm.submit}
        </button>
      </div>
    </form>
  );
}
