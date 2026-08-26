import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const profile = await prisma.profile.findUnique({
    where: { id: params.id },
    include: { city: true },
  });
  if (!profile || !profile.isPublished) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  // Never leak contact details through the public API — only the
  // profile page (server-rendered) decides whether to reveal them.
  const { contactPhone: _phone, contactWhatsapp: _whatsapp, ...safe } = profile;
  return NextResponse.json(safe);
}
