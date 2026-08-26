import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDictionary, getLocale } from "@/lib/i18n/getDictionary";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/auth/signin");

  const locale = getLocale();
  const dict = getDictionary(locale);

  const [profile, unlocks] = await Promise.all([
    prisma.profile.findUnique({ where: { userId }, include: { city: true } }),
    prisma.contactUnlock.findMany({
      where: { buyerId: userId },
      include: { profile: { include: { city: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-brand-800">{dict.dashboard.title}</h1>

      <section className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
        <h2 className="mb-3 font-semibold text-gray-900">{dict.dashboard.myProfile}</h2>
        {profile ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{profile.fullName}</p>
              <p className="text-sm text-gray-500">
                {profile.age} {dict.profile.years} ·{" "}
                {locale === "ur" ? profile.city.nameUr : profile.city.nameEn}
              </p>
            </div>
            <Link href="/profile/new" className="text-sm font-semibold text-brand-700">
              {dict.dashboard.editProfile}
            </Link>
          </div>
        ) : (
          <div>
            <p className="mb-3 text-gray-500">{dict.dashboard.noProfile}</p>
            <Link
              href="/profile/new"
              className="inline-block rounded-full bg-brand-600 px-5 py-2 font-semibold text-white hover:bg-brand-700"
            >
              {dict.dashboard.createNow}
            </Link>
          </div>
        )}
      </section>

      <section className="mt-6 rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
        <h2 className="mb-3 font-semibold text-gray-900">{dict.dashboard.unlockedContacts}</h2>
        {unlocks.length === 0 ? (
          <p className="text-gray-500">{dict.dashboard.noUnlocks}</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {unlocks.map((u) => (
              <li key={u.id} className="flex items-center justify-between py-3">
                <div>
                  <Link href={`/profile/${u.profile.id}`} className="font-medium text-brand-700">
                    {u.profile.fullName}
                  </Link>
                  <p className="text-sm text-gray-500">
                    {locale === "ur" ? u.profile.city.nameUr : u.profile.city.nameEn}
                  </p>
                </div>
                <div className="text-end">
                  {u.status === "PAID" ? (
                    <p className="font-mono font-semibold text-brand-800">{u.profile.contactPhone}</p>
                  ) : (
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                      {dict.dashboard.statusPending}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
