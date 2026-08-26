import Link from "next/link";
import { getDictionary, getLocale } from "@/lib/i18n/getDictionary";
import SignInForm from "@/components/SignInForm";

export default function SignInPage() {
  const dict = getDictionary(getLocale());
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold text-brand-800">{dict.auth.signinTitle}</h1>
      <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
        <SignInForm dict={dict} />
        <p className="mt-4 text-center text-sm text-gray-600">
          {dict.auth.noAccount}{" "}
          <Link href="/auth/signup" className="font-semibold text-brand-700">
            {dict.nav.signup}
          </Link>
        </p>
      </div>
    </div>
  );
}
