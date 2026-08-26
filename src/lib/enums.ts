// SQLite (used in dev) has no native enum support, so these values live as
// plain strings in the database (see prisma/schema.prisma) and are validated
// here in application code instead.

export type Gender = "MALE" | "FEMALE";
export const GENDERS: Gender[] = ["MALE", "FEMALE"];

export type MaritalStatus = "SINGLE" | "DIVORCED" | "WIDOWED" | "KHULA";
export const MARITAL_STATUSES: MaritalStatus[] = ["SINGLE", "DIVORCED", "WIDOWED", "KHULA"];

export type Sect = "SUNNI" | "SHIA" | "AHLE_HADITH" | "DEOBANDI" | "BARELVI" | "OTHER";
export const SECTS: Sect[] = ["SUNNI", "SHIA", "AHLE_HADITH", "DEOBANDI", "BARELVI", "OTHER"];

export type UnlockStatus = "PENDING" | "PAID" | "FAILED";
export const UNLOCK_STATUSES: UnlockStatus[] = ["PENDING", "PAID", "FAILED"];

export function isGender(value: unknown): value is Gender {
  return value === "MALE" || value === "FEMALE";
}
