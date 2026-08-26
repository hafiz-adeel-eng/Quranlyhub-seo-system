import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDictionary, getLocale } from "@/lib/i18n/getDictionary";
import LanguageToggle from "./LanguageToggle";
import SignOutButton from "./SignOutButton";

export default async function Header() {
  const locale = getLocale();
  const dict = getDictionary(locale);
  const session = await getServerSession(authOptions);

  return (
    <header className="sticky top-0 z-40 border-b border-brand-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-brand-700">
          <span className="text-gold-500">♥</span>
          {dict.siteName}
        </Link>

        <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-700">
          <Link href="/" className="hover:text-brand-700">{dict.nav.home}</Link>
          <Link href="/search" className="hover:text-brand-700">{dict.nav.search}</Link>
          <Link href="/profile/new" className="hover:text-brand-700">{dict.nav.createProfile}</Link>
          {session ? (
            <>
              <Link href="/dashboard" className="hover:text-brand-700">{dict.nav.dashboard}</Link>
              <SignOutButton label={dict.nav.signout} />
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="hover:text-brand-700">{dict.nav.signin}</Link>
              <Link
                href="/auth/signup"
                className="rounded-full bg-brand-600 px-4 py-1.5 text-white hover:bg-brand-700"
              >
                {dict.nav.signup}
              </Link>
            </>
          )}
          <LanguageToggle locale={locale} label={dict.footer.langToggle} />
        </nav>
      </div>
    </header>
  );
}
