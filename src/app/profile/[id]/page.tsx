import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import type { Metadata } from "next";
import { authOptions } from "@/lib/auth";
import { getDictionary, getLocale } from "@/lib/i18n/getDictionary";
import { prisma } from "@/lib/prisma";
import { CONTACT_UNLOCK_PRICE_PKR } from "@/lib/pricing";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const profile = await prisma.profile.findUnique({ where: { id: params.id }, include: { city: true } });
  if (!profile) return {};
  const locale = getLocale();
  const cityName = locale === "ur" ? profile.city.nameUr : profile.city.nameEn;
  const title =
    locale === "ur"
      ? `${profile.fullName} — ${profile.age} سال، ${cityName} میں رشتہ`
      : `${profile.fullName} — ${profile.age}, Rishta in ${cityName}`;
  return { title };
}

export default async function ProfileDetailPage({ params }: { params: { id: string } }) {
  const profile = await prisma.profile.findUnique({
    where: { id: params.id },
    include: { city: true },
  });
  if (!profile || !profile.isPublished) notFound();

  const locale = getLocale();
  const dict = getDictionary(locale);
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  const isOwner = userId === profile.userId;
  let unlockStatus: "PAID" | "PENDING" | null = null;
  if (userId && !isOwner) {
    const unlock = await prisma.contactUnlock.findUnique({
      where: { buyerId_profileId: { buyerId: userId, profileId: profile.id } },
    });
    unlockStatus = unlock?.status === "PAID" ? "PAID" : unlock ? "PENDING" : null;
  }

  const contactVisible = isOwner || unlockStatus === "PAID";
  const cityName = locale === "ur" ? profile.city.nameUr : profile.city.nameEn;
  const bio = locale === "ur" ? profile.bioUr : profile.bioEn;
  const genderLabel = profile.gender === "MALE" ? dict.profileForm.male : dict.profileForm.female;
  const maritalLabel = dict.profileForm[profile.maritalStatus.toLowerCase() as "single"];

  const detailRows: [string, string | null | undefined][] = [
    [dict.profileForm.gender, genderLabel],
    [dict.profileForm.age, `${profile.age} ${dict.profile.years}`],
    [dict.profileForm.height, profile.height],
    [dict.profileForm.maritalStatus, maritalLabel],
    [dict.profileForm.sect, profile.sect.replace("_", " ")],
    [dict.profileForm.caste, profile.caste],
    [dict.profileForm.education, profile.education],
    [dict.profileForm.profession, profile.profession],
    [dict.profileForm.income, profile.income],
    [dict.profileForm.city, cityName],
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <nav className="mb-4 text-sm text-gray-500">
        <Link href="/" className="hover:text-brand-700">{dict.nav.home}</Link>
        <span className="mx-1">/</span>
        <Link href={`/rishta/${profile.city.slug}`} className="hover:text-brand-700">
          {locale === "ur" ? `رشتہ ${cityName}` : `Rishta ${cityName}`}
        </Link>
      </nav>

      <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-100 text-2xl font-bold text-brand-700">
            {profile.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {profile.fullName}
              {profile.isVerified && (
                <span className="ms-2 rounded bg-gold-500/20 px-2 py-0.5 text-xs font-medium text-gold-600">
                  {dict.profile.verified}
                </span>
              )}
            </h1>
            <p className="text-gray-500">
              {profile.age} {dict.profile.years} · {cityName}
            </p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {detailRows
            .filter(([, v]) => !!v)
            .map(([label, value]) => (
              <div key={label} className="flex justify-between border-b border-gray-100 py-1.5 text-sm">
                <dt className="text-gray-500">{label}</dt>
                <dd className="font-medium text-gray-900">{value}</dd>
              </div>
            ))}
        </dl>

        {bio && (
          <div className="mt-6">
            <h2 className="mb-1 font-semibold text-gray-900">{dict.profileForm.bio}</h2>
            <p className="whitespace-pre-line text-gray-700">{bio}</p>
          </div>
        )}

        <div className="mt-8 rounded-xl border border-dashed border-brand-300 bg-brand-50 p-5 text-center">
          {contactVisible ? (
            <div>
              <p className="text-sm text-gray-500">{dict.profile.alreadyUnlocked}</p>
              <p className="mt-1 text-xl font-bold text-brand-800">{profile.contactPhone}</p>
              {profile.contactWhatsapp && (
                <p className="mt-1 text-gray-700">WhatsApp: {profile.contactWhatsapp}</p>
              )}
            </div>
          ) : isOwner ? null : (
            <div>
              <p className="font-semibold text-gray-800">{dict.profile.contactLocked}</p>
              <p className="mt-1 select-none text-2xl font-bold tracking-widest text-gray-400 blur-contact">
                XXXX-XXXXXXX
              </p>
              {!session ? (
                <Link
                  href="/auth/signin"
                  className="mt-4 inline-block rounded-full bg-brand-600 px-6 py-2 font-semibold text-white hover:bg-brand-700"
                >
                  {dict.profile.contactSignInFirst}
                </Link>
              ) : unlockStatus === "PENDING" ? (
                <p className="mt-4 text-sm text-brand-700">{dict.dashboard.statusPending}</p>
              ) : (
                <Link
                  href={`/checkout/${profile.id}`}
                  className="mt-4 inline-block rounded-full bg-gold-500 px-6 py-2 font-semibold text-white hover:bg-gold-600"
                >
                  {dict.profile.unlockCta} — {dict.profile.unlockPrice} Rs {CONTACT_UNLOCK_PRICE_PKR}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
