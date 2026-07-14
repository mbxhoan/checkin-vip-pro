"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  type PropsWithChildren,
} from "react";
import { useRouter } from "next/navigation";
import {
  defaultLocale,
  getMessages,
  isLocale,
  localeCookieName,
  type Locale,
} from "./messages";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  messages: ReturnType<typeof getMessages>;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function persistLocale(locale: Locale) {
  document.cookie = `${localeCookieName}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

export function I18nProvider({
  children,
  initialLocale,
}: PropsWithChildren<{ initialLocale: Locale }>) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(
    isLocale(initialLocale) ? initialLocale : defaultLocale,
  );

  useEffect(() => {
    setLocaleState(initialLocale);
  }, [initialLocale]);

  const setLocale = useCallback((nextLocale: Locale) => {
    persistLocale(nextLocale);
    setLocaleState(nextLocale);
    router.refresh();
  }, [router]);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      messages: getMessages(locale),
    }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }

  return context;
}
