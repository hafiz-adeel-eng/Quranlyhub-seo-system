import Link from "next/link";
import { getDictionary, getLocale } from "@/lib/i18n/getDictionary";
import SignUpForm from "@/components/SignUpForm";

export default function SignUpPage() {
  const dict = getDictionary(getLocale());
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold text-brand-800">{dict.auth.signupTitle}</h1>
      <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
        <SignUpForm dict={dict} />
        <p className="mt-4 text-center text-sm text-gray-600">
          {dict.auth.haveAccount}{" "}
          <Link href="/auth/signin" className="font-semibold text-brand-700">
            {dict.nav.signin}
          </Link>
        </p>
      </div>
    </div>
  );
}
