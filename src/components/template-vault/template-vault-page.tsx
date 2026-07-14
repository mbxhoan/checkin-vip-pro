import { SectionCard, ToneBadge } from "@/components/rbac/panels";
import { getMessages } from "@/lib/i18n/messages";
import { getLocale } from "@/lib/i18n/server";
import {
  getArchivedComponentFamilies,
  getArchivedDemoRouteGroups,
} from "@/lib/shell/template-vault";
import Link from "next/link";

export async function TemplateVaultPage() {
  const locale = await getLocale();
  const messages = getMessages(locale);
  const archivedDemoRouteGroups = getArchivedDemoRouteGroups(locale);
  const archivedComponentFamilies = getArchivedComponentFamilies(locale);

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-[28px] border border-amber-200 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white shadow-[0_18px_70px_rgba(15,23,42,0.24)]">
        <div className="grid gap-6 p-5 md:p-6 xl:grid-cols-[1.4fr_0.9fr] xl:p-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-100">
                {messages.common.templateVault}
              </span>
              <ToneBadge
                tone="amber"
                className="border border-white/10 bg-white/10 text-white"
              >
                {messages.templateVault.retained}
              </ToneBadge>
              <ToneBadge
                tone="teal"
                className="border border-white/10 bg-white/10 text-white"
              >
                {messages.templateVault.hiddenFromNav}
              </ToneBadge>
            </div>

            <div className="max-w-3xl space-y-3">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-amber-200/80">
                {messages.templateVault.reuseStorage}
              </p>
              <h1 className="text-3xl font-semibold leading-tight text-white md:text-[2.75rem] xl:text-[3.1rem]">
                {messages.templateVault.title}
              </h1>
              <p className="max-w-2xl text-base leading-6 text-slate-300 md:text-[1.05rem]">
                {messages.templateVault.summary}
              </p>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-100/80">
              {messages.templateVault.vaultPolicy}
            </p>
            <div className="mt-3 space-y-2.5 text-sm leading-6 text-slate-200">
              {messages.templateVault.vaultPolicyBullets.map((bullet) => (
                <p key={bullet}>- {bullet}</p>
              ))}
            </div>
            <div className="mt-3 rounded-[18px] border border-emerald-400/20 bg-emerald-400/10 p-3.5 text-sm text-emerald-50">
              {messages.templateVault.preservationNote}
            </div>
          </div>
        </div>
      </section>

      <SectionCard
        title={messages.templateVault.archivedDemoRoutesTitle}
        description={messages.templateVault.archivedDemoRoutesDescription}
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {archivedDemoRouteGroups.map((group) => (
            <article
              key={group.title}
              className="rounded-2xl border border-stone-200 bg-stone-50 p-3.5 dark:border-stone-800 dark:bg-slate-950/60"
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
              <div className="mt-3 flex flex-wrap gap-2">
                {group.routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className="rounded-full border border-stone-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:border-teal-300 hover:text-teal-700 dark:border-stone-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-teal-300"
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
        title={messages.templateVault.reusableFamiliesTitle}
        description={messages.templateVault.reusableFamiliesDescription}
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {archivedComponentFamilies.map((family) => (
            <div
              key={family.title}
              className="rounded-2xl border border-stone-200 p-3.5 dark:border-stone-800"
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

      <div className="rounded-2xl border border-teal-200 bg-teal-50 p-3.5 text-sm leading-6 text-teal-900 dark:border-teal-900/40 dark:bg-teal-950/30 dark:text-teal-100">
        {messages.templateVault.preservedNote}
      </div>
    </div>
  );
}
