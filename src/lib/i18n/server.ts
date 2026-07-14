import "server-only";

import { cookies } from "next/headers";
import {
  defaultLocale,
  isLocale,
  localeCookieName,
  type Locale,
} from "./messages";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const storedLocale = cookieStore.get(localeCookieName)?.value;

  if (isLocale(storedLocale)) {
    return storedLocale;
  }

  return defaultLocale;
}

export async function getLocaleCookieValue(): Promise<Locale> {
  return getLocale();
}
