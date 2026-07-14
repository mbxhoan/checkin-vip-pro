"use client";

import { useI18n } from "@/lib/i18n/client";
import { type Locale } from "@/lib/i18n/messages";
import { cn } from "@/lib/utils";

const OPTIONS: { label: string; locale: Locale }[] = [
  { label: "VI", locale: "vi" },
  { label: "EN", locale: "en" },
];

export function LocaleSwitcher() {
  const { locale, setLocale, messages } = useI18n();

  return (
    <div
      className="inline-flex items-center rounded-full border border-stone-200 bg-white p-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-600 dark:border-stone-800 dark:bg-slate-900 dark:text-slate-300"
      aria-label={messages.common.locale}
    >
      {OPTIONS.map((option) => (
        <button
          key={option.locale}
          type="button"
          onClick={() => setLocale(option.locale)}
          className={cn(
            "rounded-full px-3 py-1.5 transition",
            locale === option.locale
              ? "bg-teal-600 text-white shadow-sm"
              : "hover:text-teal-600 dark:hover:text-teal-400",
          )}
          aria-pressed={locale === option.locale}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

