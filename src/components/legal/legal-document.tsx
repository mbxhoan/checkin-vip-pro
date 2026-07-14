import { getMessages } from "@/lib/i18n/messages";
import { getLocale } from "@/lib/i18n/server";
import type { ReactNode } from "react";

export interface LegalSection {
  title: string;
  bullets: readonly string[];
}

interface LegalDocumentProps {
  title: string;
  summary: string;
  effectiveDate: string;
  owner: string;
  sections: readonly LegalSection[];
  footerNote?: ReactNode;
}

export async function LegalDocument({
  title,
  summary,
  effectiveDate,
  owner,
  sections,
  footerNote,
}: LegalDocumentProps) {
  const locale = await getLocale();
  const messages = getMessages(locale);

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <section className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-slate-900 md:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-600 dark:text-teal-400">
          {messages.common.legal}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">
          {title}
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-400">
          {summary}
        </p>

        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3.5 dark:border-stone-800 dark:bg-slate-950/60">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              {messages.legal.effectiveDate}
            </div>
            <div className="mt-1 text-base font-medium text-slate-950 dark:text-white">
              {effectiveDate}
            </div>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3.5 dark:border-stone-800 dark:bg-slate-950/60">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              {messages.legal.owner}
            </div>
            <div className="mt-1 text-base font-medium text-slate-950 dark:text-white">
              {owner}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3">
        {sections.map((section) => (
          <article
            key={section.title}
            className="rounded-[24px] border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-slate-900"
          >
            <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
              {section.title}
            </h2>
            <ul className="mt-3 space-y-2.5 text-sm leading-6 text-slate-600 dark:text-slate-400">
              {section.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-teal-500" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      {footerNote ? (
        <div className="rounded-2xl border border-teal-200 bg-teal-50 p-3.5 text-sm leading-6 text-teal-900 dark:border-teal-900/40 dark:bg-teal-950/30 dark:text-teal-100">
          {footerNote}
        </div>
      ) : null}
    </div>
  );
}
