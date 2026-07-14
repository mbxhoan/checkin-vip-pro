import {
  ARCHIVED_COMPONENT_FAMILIES,
  ARCHIVED_DEMO_ROUTE_GROUPS,
} from "@/lib/shell/template-vault";
import { SectionCard, ToneBadge } from "@/components/rbac/panels";
import Link from "next/link";

export function TemplateVaultPage() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-amber-200 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white shadow-[0_18px_70px_rgba(15,23,42,0.24)]">
        <div className="grid gap-8 p-6 md:p-8 xl:grid-cols-[1.4fr_0.9fr] xl:p-10">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-100">
                Template vault
              </span>
              <ToneBadge tone="amber" className="border border-white/10 bg-white/10 text-white">
                retained
              </ToneBadge>
              <ToneBadge tone="teal" className="border border-white/10 bg-white/10 text-white">
                hidden from primary nav
              </ToneBadge>
            </div>

            <div className="max-w-3xl space-y-4">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-amber-200/80">
                Reuse storage
              </p>
              <h1 className="text-3xl font-semibold leading-tight text-white md:text-4xl xl:text-[3.35rem]">
                Demo routes and template components stay available for reuse
                instead of being rewritten from scratch.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
                The original demo surfaces are intentionally kept in the repo as
                a vault. They are no longer part of the main navigation, but the
                page keeps them discoverable so the team can reuse cards,
                layouts, forms, tables, charts, and UI primitives later.
              </p>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-100/80">
              Vault policy
            </p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-200">
              <p>- Keep template routes out of the primary shell navigation.</p>
              <p>- Preserve reusable components and page blocks in their current folders.</p>
              <p>- Reuse existing patterns before writing a new component.</p>
              <p>- Archive, do not delete, until the replacement module is fully stable.</p>
            </div>
            <div className="mt-4 rounded-[18px] border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-50">
              This keeps the app lean for users while preserving the template
              library for future reuse.
            </div>
          </div>
        </div>
      </section>

      <SectionCard
        title="Archived demo routes"
        description="These route groups are no longer exposed in the primary shell, but they remain accessible here for reuse and comparison."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {ARCHIVED_DEMO_ROUTE_GROUPS.map((group) => (
            <article
              key={group.title}
              className="rounded-2xl border border-stone-200 bg-stone-50 p-4 dark:border-stone-800 dark:bg-slate-950/60"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-slate-950 dark:text-white">
                  {group.title}
                </h3>
                <ToneBadge tone={group.tone}>{group.tone}</ToneBadge>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {group.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-teal-300 hover:text-teal-700 dark:border-stone-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-teal-500 dark:hover:text-teal-300"
                  >
                    {route.label}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Reusable component families"
        description="These families are the source material the next module rewrites can lean on instead of rebuilding every pattern."
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {ARCHIVED_COMPONENT_FAMILIES.map((family) => (
            <div
              key={family.title}
              className="rounded-2xl border border-stone-200 p-4 dark:border-stone-800"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-slate-950 dark:text-white">
                  {family.title}
                </h3>
                <ToneBadge tone={family.tone}>{family.tone}</ToneBadge>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {family.note}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4 text-sm leading-6 text-teal-900 dark:border-teal-900/40 dark:bg-teal-950/30 dark:text-teal-100">
        Nothing is deleted here. The vault is the holding area for the demo
        library while the product shell rewrites continue.
      </div>
    </div>
  );
}
