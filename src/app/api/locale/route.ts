import { NextResponse } from "next/server";
import { LOCALE_COOKIE } from "@/lib/i18n/getDictionary";

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const to = searchParams.get("to") === "en" ? "en" : "ur";
  const redirectTo = searchParams.get("redirect") || "/";
  const safeRedirect = redirectTo.startsWith("/") ? redirectTo : "/";

  const res = NextResponse.redirect(new URL(safeRedirect, origin));
  res.cookies.set(LOCALE_COOKIE, to, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}
