import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type BadgeTone =
  | "slate"
  | "emerald"
  | "amber"
  | "rose"
  | "blue"
  | "violet"
  | "teal";

const BADGE_TONE_CLASSES: Record<BadgeTone, string> = {
  slate: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  emerald:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200",
  rose: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200",
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200",
  violet:
    "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-200",
  teal: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-200",
};

interface ToneBadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

export function ToneBadge({
  children,
  tone = "slate",
  className,
}: ToneBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        BADGE_TONE_CLASSES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

interface MetricCardProps {
  label: string;
  value: string | number;
  note?: string;
  tone?: BadgeTone;
}

export function MetricCard({
  label,
  value,
  note,
  tone = "slate",
}: MetricCardProps) {
  return (
    <div className="rounded-[18px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-dark-4 dark:text-dark-6">
          {label}
        </p>
        <ToneBadge tone={tone}>{label}</ToneBadge>
      </div>

      <div className="mt-4 flex items-end justify-between gap-4">
        <span className="text-[1.75rem] font-bold text-dark dark:text-white">
          {value}
        </span>
      </div>

      {note ? (
        <p className="mt-2 text-sm text-dark-5 dark:text-dark-6">{note}</p>
      ) : null}
    </div>
  );
}

interface SectionCardProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
}

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
  id,
}: SectionCardProps) {
  return (
    <section
      id={id}
      className={cn(
        "rounded-[18px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-dark dark:text-white">
            {title}
          </h3>

          {description ? (
            <p className="mt-1 max-w-3xl text-[13px] text-dark-5 dark:text-dark-6">
              {description}
            </p>
          ) : null}
        </div>

        {action ? <div className="shrink-0">{action}</div> : null}
      </div>

      {children}
    </section>
  );
}
