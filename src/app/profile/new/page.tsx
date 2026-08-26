import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDictionary, getLocale } from "@/lib/i18n/getDictionary";
import ProfileForm from "@/components/ProfileForm";

export default async function NewProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/signin");
  }

  const locale = getLocale();
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-2 text-2xl font-bold text-brand-800">{dict.profileForm.title}</h1>
      <p className="mb-6 text-gray-600">{dict.profileForm.subtitle}</p>
      <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
        <ProfileForm dict={dict} locale={locale} />
      </div>
    </div>
  );
}
