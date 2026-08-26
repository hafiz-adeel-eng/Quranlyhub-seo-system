import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Gender, MaritalStatus, Sect } from "@/lib/enums";

// GET /api/profiles?city=gujranwala&lookingFor=FEMALE&minAge=20&maxAge=30
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const citySlug = searchParams.get("city");
  const lookingFor = searchParams.get("lookingFor") as Gender | null;
  const minAge = searchParams.get("minAge");
  const maxAge = searchParams.get("maxAge");

  const where: Record<string, unknown> = { isPublished: true };

  if (citySlug && citySlug !== "all") {
    where.city = { slug: citySlug };
  }
  if (lookingFor === "MALE" || lookingFor === "FEMALE") {
    where.gender = lookingFor;
  }
  if (minAge || maxAge) {
    where.age = {
      ...(minAge ? { gte: parseInt(minAge, 10) } : {}),
      ...(maxAge ? { lte: parseInt(maxAge, 10) } : {}),
    };
  }

  const profiles = await prisma.profile.findMany({
    where,
    include: { city: true },
    orderBy: { createdAt: "desc" },
    take: 60,
  });

  return NextResponse.json(profiles);
}

// POST /api/profiles — create or update the current user's profile.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    fullName,
    gender,
    lookingForGender,
    age,
    height,
    maritalStatus,
    sect,
    caste,
    education,
    profession,
    income,
    citySlug,
    bioUr,
    bioEn,
    contactPhone,
    contactWhatsapp,
  } = body as Record<string, string | number | undefined>;

  if (!fullName || !gender || !lookingForGender || !age || !citySlug || !contactPhone) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const city = await prisma.city.findUnique({ where: { slug: String(citySlug) } });
  if (!city) {
    return NextResponse.json({ error: "Invalid city" }, { status: 400 });
  }

  const data = {
    fullName: String(fullName),
    gender: gender as Gender,
    lookingForGender: lookingForGender as Gender,
    age: Number(age),
    height: height ? String(height) : undefined,
    maritalStatus: (maritalStatus as MaritalStatus) ?? "SINGLE",
    sect: (sect as Sect) ?? "OTHER",
    caste: caste ? String(caste) : undefined,
    education: education ? String(education) : undefined,
    profession: profession ? String(profession) : undefined,
    income: income ? String(income) : undefined,
    cityId: city.id,
    bioUr: bioUr ? String(bioUr) : undefined,
    bioEn: bioEn ? String(bioEn) : undefined,
    contactPhone: String(contactPhone),
    contactWhatsapp: contactWhatsapp ? String(contactWhatsapp) : undefined,
  };

  // Upsert: a new profile is immediately attached to its city landing page.
  const profile = await prisma.profile.upsert({
    where: { userId },
    update: data,
    create: { ...data, userId },
  });

  return NextResponse.json(profile);
}
