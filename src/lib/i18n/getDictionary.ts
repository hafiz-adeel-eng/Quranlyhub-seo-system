import { cookies } from "next/headers";
import { dictionaries, type Locale } from "./dictionaries";

export const LOCALE_COOKIE = "rishta_locale";
export const DEFAULT_LOCALE: Locale = "ur";

export function getLocale(): Locale {
  const cookieLocale = cookies().get(LOCALE_COOKIE)?.value;
  return cookieLocale === "en" ? "en" : DEFAULT_LOCALE;
}

export function getDictionary(locale?: Locale) {
  const l = locale ?? getLocale();
  return dictionaries[l];
}
