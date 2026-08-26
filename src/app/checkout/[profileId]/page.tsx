import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDictionary, getLocale } from "@/lib/i18n/getDictionary";
import { prisma } from "@/lib/prisma";
import { CONTACT_UNLOCK_PRICE_PKR, MANUAL_PAYMENT_NAME, MANUAL_PAYMENT_NUMBER } from "@/lib/pricing";
import CheckoutForm from "@/components/CheckoutForm";

export default async function CheckoutPage({ params }: { params: { profileId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/auth/signin`);

  const profile = await prisma.profile.findUnique({ where: { id: params.profileId } });
  if (!profile) notFound();

  const locale = getLocale();
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="text-2xl font-bold text-brand-800">{dict.checkout.title}</h1>
      <p className="mt-1 text-gray-600">{dict.checkout.subtitle}</p>

      <div className="mt-6 rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between rounded-lg bg-brand-50 px-4 py-3">
          <span className="text-sm text-gray-600">{dict.checkout.amount}</span>
          <span className="text-lg font-bold text-brand-800">Rs {CONTACT_UNLOCK_PRICE_PKR}</span>
        </div>

        <div className="mb-6 rounded-lg border border-gold-500/40 bg-gold-500/10 p-4 text-sm text-gray-700">
          <p className="mb-2 font-semibold text-gold-600">{dict.checkout.method}: JazzCash / Easypaisa</p>
          <p>{dict.checkout.manualInstructions}</p>
          <p className="mt-2 font-mono text-base font-bold text-gray-900">{MANUAL_PAYMENT_NUMBER}</p>
          <p className="text-gray-600">{MANUAL_PAYMENT_NAME}</p>
        </div>

        <CheckoutForm dict={dict} profileId={profile.id} />
      </div>
    </div>
  );
}
