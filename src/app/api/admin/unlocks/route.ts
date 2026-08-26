import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/isAdmin";
import { prisma } from "@/lib/prisma";

// PATCH /api/admin/unlocks — manually approve a pending contact-unlock
// payment after verifying the JazzCash/Easypaisa transaction reference.
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { unlockId, status } = (await req.json()) as { unlockId?: string; status?: "PAID" | "FAILED" };
  if (!unlockId || (status !== "PAID" && status !== "FAILED")) {
    return NextResponse.json({ error: "Missing/invalid fields" }, { status: 400 });
  }

  const unlock = await prisma.contactUnlock.update({
    where: { id: unlockId },
    data: { status, paidAt: status === "PAID" ? new Date() : null },
  });

  return NextResponse.json(unlock);
}
