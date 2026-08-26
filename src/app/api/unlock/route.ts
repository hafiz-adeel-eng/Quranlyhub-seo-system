import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CONTACT_UNLOCK_PRICE_PKR } from "@/lib/pricing";

// POST /api/unlock — record a contact-unlock request against a profile.
//
// PAYMENT PROVIDER NOTE: no live payment gateway credentials are configured
// in this environment, so this endpoint stores the request as PENDING with
// the user-submitted transaction reference ("manual" provider — JazzCash /
// Easypaisa transfer confirmed by an admin). To go live with automatic
// confirmation, swap this handler to call the JazzCash/Easypaisa merchant
// API or Stripe, and flip status to PAID inside that provider's webhook
// instead of trusting the client-submitted reference. See README.md.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const buyerId = (session?.user as { id?: string } | undefined)?.id;
  if (!buyerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { profileId, providerRef } = (await req.json()) as {
    profileId?: string;
    providerRef?: string;
  };
  if (!profileId || !providerRef) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const profile = await prisma.profile.findUnique({ where: { id: profileId } });
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }
  if (profile.userId === buyerId) {
    return NextResponse.json({ error: "Cannot unlock your own profile" }, { status: 400 });
  }

  const unlock = await prisma.contactUnlock.upsert({
    where: { buyerId_profileId: { buyerId, profileId } },
    update: { providerRef: String(providerRef), status: "PENDING" },
    create: {
      buyerId,
      profileId,
      amountPkr: CONTACT_UNLOCK_PRICE_PKR,
      provider: "manual",
      providerRef: String(providerRef),
      status: "PENDING",
    },
  });

  return NextResponse.json(unlock);
}
