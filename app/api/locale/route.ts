import { NextResponse } from "next/server";
import { isLocale, LOCALE_COOKIE } from "@/lib/i18n";

export async function POST(request: Request) {
  let locale = "ka";
  try {
    const body = (await request.json()) as { locale?: string };
    locale = typeof body.locale === "string" ? body.locale : "ka";
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  if (!isLocale(locale)) {
    return NextResponse.json({ error: "unknown locale" }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true, locale });
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}
