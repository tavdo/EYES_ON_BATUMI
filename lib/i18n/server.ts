import { cookies } from "next/headers";
import { getDictionary, isLocale, type Locale } from "./dict";
import { LOCALE_COOKIE } from "./dict";

export async function getLocaleFromCookies(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value ?? "ka";
  return isLocale(value) ? value : "ka";
}

export { getDictionary, isLocale, LOCALE_COOKIE };
export type { Dictionary, Locale } from "./dict";
