import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { CITIES } from "../src/lib/cities";

const prisma = new PrismaClient();

async function main() {
  for (const city of CITIES) {
    await prisma.city.upsert({
      where: { slug: city.slug },
      update: { nameUr: city.nameUr, nameEn: city.nameEn, province: city.province, isFeatured: city.featured },
      create: {
        slug: city.slug,
        nameUr: city.nameUr,
        nameEn: city.nameEn,
        province: city.province,
        isFeatured: city.featured,
      },
    });
  }
  console.log(`Seeded ${CITIES.length} cities.`);

  // A handful of demo profiles so the homepage / city pages aren't empty on first run.
  const demo = [
    { name: "Ahmed Raza", email: "demo.ahmed@example.com", gender: "MALE" as const, city: "gujranwala", age: 28 },
    { name: "Ayesha Khan", email: "demo.ayesha@example.com", gender: "FEMALE" as const, city: "gujranwala", age: 24 },
    { name: "Bilal Hussain", email: "demo.bilal@example.com", gender: "MALE" as const, city: "gujrat", age: 30 },
    { name: "Sana Malik", email: "demo.sana@example.com", gender: "FEMALE" as const, city: "jhelum", age: 26 },
    { name: "Usman Tariq", email: "demo.usman@example.com", gender: "MALE" as const, city: "lahore", age: 27 },
    { name: "Hina Fatima", email: "demo.hina@example.com", gender: "FEMALE" as const, city: "karachi", age: 25 },
  ];

  const passwordHash = await bcrypt.hash("Demo@12345", 10);

  for (const d of demo) {
    const city = await prisma.city.findUnique({ where: { slug: d.city } });
    if (!city) continue;

    const user = await prisma.user.upsert({
      where: { email: d.email },
      update: {},
      create: { name: d.name, email: d.email, passwordHash },
    });

    await prisma.profile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        fullName: d.name,
        gender: d.gender,
        lookingForGender: d.gender === "MALE" ? "FEMALE" : "MALE",
        age: d.age,
        maritalStatus: "SINGLE",
        sect: "SUNNI",
        education: "BSc",
        profession: "Business",
        cityId: city.id,
        bioUr: "دین دار اور مہذب رشتے کی تلاش ہے۔",
        bioEn: "Looking for a practicing and well-mannered life partner.",
        contactPhone: "0300-0000000",
        isVerified: true,
      },
    });
  }

  console.log(`Seeded ${demo.length} demo profiles.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
