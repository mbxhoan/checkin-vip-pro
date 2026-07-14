import { getAuthSessionBootstrap } from "@/lib/auth/bootstrap";
import { getRbacBootstrapContext } from "@/lib/rbac/bootstrap";
import { ToneBadge } from "@/components/rbac/panels";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Foundation dashboard",
  description:
    "Giltech Solutions Check-in foundation dashboard for auth, RBAC, shell routes, seed data, and replatform readiness.",
};

const foundationCards = [
  {
    label: "Auth bridge",
    description: "Supabase Auth now resolves into public.users and session bootstrap.",
  },
  {
    label: "RBAC runtime",
    description: "Role, permission, and scope checks are centralized on the server.",
  },
  {
    label: "Seed dataset",
    description: "Demo companies, events, auth users, and RBAC assignments are seeded.",
  },
  {
    label: "RLS coverage",
    description: "Core tenant tables and runtime tables are protected with baseline policies.",
  },
] as const;

const remainingBackendGates = [
  {
    label: "Module services",
    description: "Clients, check-in, reports, landing page, print, campaign, and chatbot services still need their production UI surfaces.",
  },
  {
    label: "Parity queries",
    description: "Critical report and operational queries still need side-by-side comparison with legacy output.",
  },
  {
    label: "Job orchestration",
    description: "Background jobs for import, export, print, and messaging need execution and retry hooks.",
  },
  {
    label: "Feature modules",
    description: "Workspace, audience, experience, engagement, and system shell pages are live; the next step is to replace the placeholder surfaces behind them with real feature screens.",
  },
] as const;

const quickLinks = [
  { href: "/workspace", label: "Workspace shell" },
  { href: "/audience", label: "Audience shell" },
  { href: "/system/template-vault", label: "Template vault" },
  { href: "/rbac/users", label: "Manage users" },
] as const;

const shellLanes = [
  {
    href: "/workspace",
    title: "Workspace",
    description: "Companies, events, and access settings live in one lane.",
    tone: "teal" as const,
  },
  {
    href: "/audience",
    title: "Audience",
    description: "Client intake, check-in, and report surfaces are grouped together.",
    tone: "blue" as const,
  },
  {
    href: "/experience",
    title: "Experience",
    description: "Landing pages, campaigns, email, cards, and labels sit here.",
    tone: "violet" as const,
  },
  {
    href: "/engagement",
    title: "Engagement",
    description: "Lucky draw, chatbot, and print runtime stay in one lane.",
    tone: "emerald" as const,
  },
  {
    href: "/system",
    title: "System",
    description: "Governance, logs, and integration settings are kept separate from product flows.",
    tone: "amber" as const,
  },
  {
    href: "/system/template-vault",
    title: "Template vault",
    description: "Archived demo routes and reusable components remain available for reuse.",
    tone: "slate" as const,
  },
] as const;

export default async function FoundationDashboardPage() {
  const [session, bootstrap] = await Promise.all([
    getAuthSessionBootstrap(),
    getRbacBootstrapContext(),
  ]);

  const displayName = session?.profile.displayName ?? "Guest";
  const companyName = session?.profile.defaultCompanyName ?? "Giltech Solutions";
  const roleSummary =
    session?.profile.roleKeys.length
      ? session.profile.roleKeys.join(" · ")
      : "No active role";

  const metrics = [
    { label: "Companies", value: bootstrap.metrics.companyCount.toString(), note: "Multi-company seed ready" },
    { label: "Users", value: bootstrap.metrics.userCount.toString(), note: "Auth mappings live" },
    { label: "Events", value: bootstrap.metrics.eventCount.toString(), note: "Scoped event data seeded" },
    { label: "Permissions", value: bootstrap.metrics.permissionCount.toString(), note: "RBAC registry loaded" },
  ] as const;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white shadow-[0_18px_70px_rgba(15,23,42,0.24)]">
        <div className="grid gap-8 p-6 md:p-8 xl:grid-cols-[1.6fr_0.9fr] xl:p-10">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-teal-100">
                Foundation shell
              </span>
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/12 px-3 py-1 text-xs font-semibold text-emerald-100">
                Auth live
              </span>
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/12 px-3 py-1 text-xs font-semibold text-emerald-100">
                RBAC live
              </span>
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/12 px-3 py-1 text-xs font-semibold text-emerald-100">
                Seed data live
              </span>
            </div>

            <div className="max-w-3xl space-y-4">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-teal-200/80">
                Giltech Solutions Check-in
              </p>
              <h1 className="text-3xl font-semibold leading-tight text-white md:text-4xl xl:text-[3.5rem]">
                {displayName} is working inside the Giltech foundation shell.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
                The legacy template surface has been replaced with a branded
                shell that already knows about Supabase Auth, RBAC scopes,
                seeded multi-company data, and the new shell lanes. The
                remaining work is now mostly module UI and operational parity.
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
              Current workspace
            </p>
            <div className="mt-4 space-y-4">
              <div>
                <div className="text-sm text-slate-300">Company</div>
                <div className="text-xl font-semibold text-white">{companyName}</div>
              </div>
              <div>
                <div className="text-sm text-slate-300">Roles</div>
                <div className="text-sm font-medium text-white">{roleSummary}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                  <div className="text-2xl font-semibold text-white">
                    {bootstrap.metrics.accessScopeCount}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                    Accessible scopes
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                  <div className="text-2xl font-semibold text-white">
                    {bootstrap.metrics.roleCount}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                    Role templates
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-50">
                RBAC model uses `role + permission + scope` and is enforced on
                the server, not by menu visibility.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-[24px] border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-slate-900"
          >
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {metric.label}
            </p>
            <div className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">
              {metric.value}
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {metric.note}
            </p>
          </article>
        ))}
      </section>

      <section className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-600 dark:text-violet-400">
              Shell lanes live
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">
              The UX rewrite now has a clean route map
            </h2>
          </div>
          <ToneBadge tone="amber" className="self-start">
            Archived demos preserved
          </ToneBadge>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {shellLanes.map((lane) => (
            <Link
              key={lane.href}
              href={lane.href}
              className="group rounded-[22px] border border-stone-200 p-5 transition hover:border-teal-300 hover:shadow-sm dark:border-stone-800 dark:hover:border-teal-500"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <ToneBadge tone={lane.tone}>{lane.tone}</ToneBadge>
                  <h3 className="mt-3 text-xl font-semibold text-slate-950 transition group-hover:text-teal-700 dark:text-white dark:group-hover:text-teal-300">
                    {lane.title}
                  </h3>
                </div>
                <span className="rounded-full border border-stone-200 px-3 py-1 text-xs font-medium text-slate-500 dark:border-stone-700 dark:text-slate-400">
                  Open
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {lane.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-600 dark:text-teal-400">
                Foundation now
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">
                What is already stable
              </h2>
            </div>
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              Ready
            </span>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {foundationCards.map((card) => (
              <div
                key={card.label}
                className="rounded-2xl border border-stone-200 bg-stone-50 p-4 dark:border-stone-800 dark:bg-slate-950/60"
              >
                <h3 className="font-semibold text-slate-950 dark:text-white">
                  {card.label}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-600 dark:text-amber-400">
                Before UX/UI rewrite
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">
                Backend work still to close
              </h2>
            </div>
            <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
              Next
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {remainingBackendGates.map((gate) => (
              <div
                key={gate.label}
                className="rounded-2xl border border-stone-200 p-4 dark:border-stone-800"
              >
                <h3 className="font-semibold text-slate-950 dark:text-white">
                  {gate.label}
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {gate.description}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
