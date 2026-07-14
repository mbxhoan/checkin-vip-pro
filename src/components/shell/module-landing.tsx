import { ToneBadge, MetricCard, SectionCard } from "@/components/rbac/panels";
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

export function ModuleLanding({
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
  return (
    <div className="space-y-6">
      <section
        className={cn(
          "overflow-hidden rounded-[28px] border border-slate-200 text-white shadow-[0_18px_70px_rgba(15,23,42,0.24)]",
          "bg-gradient-to-br",
          HERO_TONES[tone],
        )}
      >
        <div className="grid gap-8 p-6 md:p-8 xl:grid-cols-[1.5fr_0.9fr] xl:p-10">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-teal-100">
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

            <div className="max-w-3xl space-y-4">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-teal-200/80">
                {workspaceName}
              </p>
              <h1 className="text-3xl font-semibold leading-tight text-white md:text-4xl xl:text-[3.35rem]">
                {title}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
                {summary}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-100/80">
              Current context
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <div className="text-sm text-slate-300">Principal</div>
                <div className="text-xl font-semibold text-white">
                  {principalName}
                </div>
                <div className="text-sm text-slate-300">{principalMeta}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {metrics.slice(0, 2).map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-2xl border border-white/10 bg-slate-950/40 p-4"
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
                  className="block rounded-[18px] border border-amber-400/20 bg-amber-400/10 p-4 transition hover:bg-amber-400/15"
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
                  RBAC, session, and seed data are already live. This shell is
                  ready for module-level rewrite.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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

      <section className="grid gap-4 xl:grid-cols-2">
        <SectionCard
          title="What is live"
          description="These cards describe the current shell state and the data already wired in."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {liveCards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-stone-200 bg-stone-50 p-4 dark:border-stone-800 dark:bg-slate-950/60"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-slate-950 dark:text-white">
                    {card.title}
                  </h3>
                  <ToneBadge tone={card.tone ?? "slate"}>{card.tone ?? "state"}</ToneBadge>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="What is next"
          description="These are the rewrite targets that sit behind the shell and should be implemented progressively."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {nextCards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-stone-200 p-4 dark:border-stone-800"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-slate-950 dark:text-white">
                    {card.title}
                  </h3>
                  <ToneBadge tone={card.tone ?? "amber"}>
                    {card.tone ?? "next"}
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
