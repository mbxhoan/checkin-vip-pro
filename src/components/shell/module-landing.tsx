import { ToneBadge, MetricCard, SectionCard } from "@/components/rbac/panels";
import { getMessages } from "@/lib/i18n/messages";
import { getLocale } from "@/lib/i18n/server";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ReactNode } from "react";

type BadgeTone =
  | "slate"
  | "emerald"
  | "amber"
  | "rose"
  | "blue"
  | "violet"
  | "teal";

const HERO_TONES: Record<
  "teal" | "blue" | "violet" | "emerald" | "amber",
  string
> = {
  teal: "from-slate-950 via-slate-900 to-teal-950",
  blue: "from-slate-950 via-slate-900 to-blue-950",
  violet: "from-slate-950 via-slate-900 to-violet-950",
  emerald: "from-slate-950 via-slate-900 to-emerald-950",
  amber: "from-slate-950 via-slate-900 to-amber-950",
};

export interface ShellMetric {
  label: string;
  value: string | number;
  note: string;
  tone?: BadgeTone;
}

export interface ShellCard {
  title: string;
  description: string;
  tone?: BadgeTone;
}

export interface ShellQuickLink {
  href: string;
  label: string;
}

export interface ModuleLandingProps {
  eyebrow: string;
  title: string;
  summary: string;
  tone: "teal" | "blue" | "violet" | "emerald" | "amber";
  statusChips: readonly { label: string; tone?: BadgeTone }[];
  workspaceName: string;
  principalName: string;
  principalMeta: string;
  metrics: readonly ShellMetric[];
  liveCards: readonly ShellCard[];
  nextCards: readonly ShellCard[];
  quickLinks: readonly ShellQuickLink[];
  archiveLink?: ShellQuickLink & { note: string };
  footerNote?: ReactNode;
}

export async function ModuleLanding({
  eyebrow,
  title,
  summary,
  tone,
  statusChips,
  workspaceName,
  principalName,
  principalMeta,
  metrics,
  liveCards,
  nextCards,
  quickLinks,
  archiveLink,
  footerNote,
}: ModuleLandingProps) {
  const locale = await getLocale();
  const messages = getMessages(locale);

  return (
    <div className="space-y-4">
      <section
        className={cn(
          "overflow-hidden rounded-[28px] border border-slate-200 text-white shadow-[0_18px_70px_rgba(15,23,42,0.24)]",
          "bg-gradient-to-br",
          HERO_TONES[tone],
        )}
      >
        <div className="grid gap-6 p-5 md:p-6 xl:grid-cols-[1.5fr_0.9fr] xl:p-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-teal-100">
                {eyebrow}
              </span>
              {statusChips.map((chip) => (
                <ToneBadge
                  key={chip.label}
                  tone={chip.tone ?? "emerald"}
                  className="border border-white/10 bg-white/10 text-white"
                >
                  {chip.label}
                </ToneBadge>
              ))}
            </div>

            <div className="max-w-3xl space-y-3">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-teal-200/80">
                {workspaceName}
              </p>
              <h1 className="text-3xl font-semibold leading-tight text-white md:text-[2.75rem] xl:text-[3.1rem]">
                {title}
              </h1>
              <p className="max-w-2xl text-base leading-6 text-slate-300 md:text-[1.05rem]">
                {summary}
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-white/15"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-100/80">
              {messages.moduleLanding.currentContext}
            </p>

            <div className="mt-3 space-y-3.5">
              <div>
                <div className="text-sm text-slate-300">
                  {messages.moduleLanding.principal}
                </div>
                <div className="text-xl font-semibold text-white">
                  {principalName}
                </div>
                <div className="text-sm text-slate-300">{principalMeta}</div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {metrics.slice(0, 2).map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-2xl border border-white/10 bg-slate-950/40 p-3.5"
                  >
                    <div className="text-2xl font-semibold text-white">
                      {metric.value}
                    </div>
                    <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>

              {archiveLink ? (
                <Link
                  href={archiveLink.href}
                  className="block rounded-[18px] border border-amber-400/20 bg-amber-400/10 p-3.5 transition hover:bg-amber-400/15"
                >
                  <p className="text-sm font-semibold text-amber-50">
                    {archiveLink.label}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-amber-100/80">
                    {archiveLink.note}
                  </p>
                </Link>
              ) : (
                <div className="rounded-[18px] border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-50">
                  {messages.moduleLanding.liveReadyNote}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            note={metric.note}
            tone={metric.tone ?? "slate"}
          />
        ))}
      </section>

      <section className="grid gap-3 xl:grid-cols-2">
        <SectionCard
          title={messages.moduleLanding.whatIsLive}
          description={messages.moduleLanding.liveSectionDescription}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {liveCards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-stone-200 bg-stone-50 p-3.5 dark:border-stone-800 dark:bg-slate-950/60"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-slate-950 dark:text-white">
                    {card.title}
                  </h3>
                  <ToneBadge tone={card.tone ?? "slate"}>
                    {card.tone ?? messages.moduleLanding.liveState}
                  </ToneBadge>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title={messages.moduleLanding.whatIsNext}
          description={messages.moduleLanding.nextSectionDescription}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {nextCards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-stone-200 p-3.5 dark:border-stone-800"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-slate-950 dark:text-white">
                    {card.title}
                  </h3>
                  <ToneBadge tone={card.tone ?? "amber"}>
                    {card.tone ?? messages.moduleLanding.nextState}
                  </ToneBadge>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>

      {footerNote ? (
        <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4 text-sm leading-6 text-teal-900 dark:border-teal-900/40 dark:bg-teal-950/30 dark:text-teal-100">
          {footerNote}
        </div>
      ) : null}
    </div>
  );
}
