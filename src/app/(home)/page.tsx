import { getAuthSessionBootstrap } from "@/lib/auth/bootstrap";
import { getRbacBootstrapContext } from "@/lib/rbac/bootstrap";
import { ToneBadge } from "@/components/rbac/panels";
import type { Metadata } from "next";
import Link from "next/link";
import { getLocale } from "@/lib/i18n/server";
import { getMessages } from "@/lib/i18n/messages";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  return locale === "vi"
    ? {
        title: "Bảng điều khiển nền tảng",
        description:
          "Bảng điều khiển nền tảng Giltech Solutions Check-in cho auth, RBAC, route shell, dữ liệu seed và trạng thái replatform.",
      }
    : {
        title: "Foundation dashboard",
        description:
          "Giltech Solutions Check-in foundation dashboard for auth, RBAC, shell routes, seed data, and replatform readiness.",
      };
}

export default async function FoundationDashboardPage() {
  const [session, bootstrap, locale] = await Promise.all([
    getAuthSessionBootstrap(),
    getRbacBootstrapContext(),
    getLocale(),
  ]);
  const messages = getMessages(locale);
  const isVi = locale === "vi";
  const companyName = session?.profile.defaultCompanyName ?? "Giltech Solutions";
  const roleSummary = session?.profile.roleKeys.length
    ? session.profile.roleKeys.join(" · ")
    : isVi
      ? "Chưa có vai trò đang hoạt động"
      : "No active role";

  const copy = isVi
    ? {
        badge: "Shell nền tảng",
        authLive: "Auth live",
        rbacLive: "RBAC live",
        seedLive: "Seed data live",
        eyebrow: messages.footer.productName,
        title: `${session?.profile.displayName ?? "Khách"} đang làm việc trong shell nền tảng Giltech.`,
        summary:
          "Lớp giao diện template cũ đã được thay bằng shell thương hiệu có sẵn Supabase Auth, RBAC scope, dữ liệu đa công ty đã seed và các shell lane mới. Phần còn lại chủ yếu là UI module và độ khớp nghiệp vụ.",
        currentWorkspace: "Không gian làm việc hiện tại",
        company: "Công ty",
        roles: "Vai trò",
        accessibleScopes: "Phạm vi truy cập",
        roleTemplates: "Mẫu vai trò",
        rbacNote:
          "Mô hình RBAC dùng `role + permission + scope` và được ép ở phía server, không dựa vào việc menu hiển thị.",
        shellLanes: "Shell lanes live",
        shellLaneTitle: "Bản đồ route cho UX rewrite đã rõ ràng",
        archivedDemos: "Demo đã lưu trữ",
        liveSectionTitle: "Các phần đã live",
        liveSectionDescription:
          "Các thẻ này mô tả trạng thái shell hiện tại và dữ liệu đã được nối vào.",
        nextSectionTitle: "Phần tiếp theo",
        nextSectionDescription:
          "Đây là các mục tiêu tái viết nằm phía sau shell và nên được triển khai dần.",
        metrics: [
          { label: "Công ty", note: "Seed đa công ty đã sẵn sàng" },
          { label: "Người dùng", note: "Map Auth đang hoạt động" },
          { label: "Sự kiện", note: "Dữ liệu theo scope đã được seed" },
          { label: "Quyền", note: "RBAC registry đã được nạp" },
        ],
      }
    : {
        badge: "Foundation shell",
        authLive: "Auth live",
        rbacLive: "RBAC live",
        seedLive: "Seed data live",
        eyebrow: messages.footer.productName,
        title: `${
          session?.profile.displayName ?? "Guest"
        } is working inside the Giltech foundation shell.`,
        summary:
          "The legacy template surface has been replaced with a branded shell that already knows about Supabase Auth, RBAC scopes, seeded multi-company data, and the new shell lanes. The remaining work is now mostly module UI and operational parity.",
        currentWorkspace: "Current workspace",
        company: "Company",
        roles: "Roles",
        accessibleScopes: "Accessible scopes",
        roleTemplates: "Role templates",
        rbacNote:
          "RBAC model uses `role + permission + scope` and is enforced on the server, not by menu visibility.",
        shellLanes: "Shell lanes live",
        shellLaneTitle: "The UX rewrite now has a clean route map",
        archivedDemos: "Archived demos preserved",
        liveSectionTitle: "What is live",
        liveSectionDescription:
          "These cards describe the current shell state and the data already wired in.",
        nextSectionTitle: "What is next",
        nextSectionDescription:
          "These are the rewrite targets that sit behind the shell and should be implemented progressively.",
        metrics: [
          { label: "Companies", note: "Multi-company seed ready" },
          { label: "Users", note: "Auth mappings live" },
          { label: "Events", note: "Scoped event data seeded" },
          { label: "Permissions", note: "RBAC registry loaded" },
        ],
      };

  const foundationCards = isVi
    ? [
        {
          label: "Cầu nối Auth",
          description:
            "Supabase Auth đã được map sang public.users và session bootstrap.",
        },
        {
          label: "RBAC runtime",
          description:
            "Kiểm tra role, permission và scope được tập trung ở server.",
        },
        {
          label: "Bộ seed",
          description:
            "Công ty demo, sự kiện, auth users và RBAC assignment đã được seed.",
        },
        {
          label: "Phủ RLS",
          description:
            "Các bảng tenant chính và bảng runtime đã có policy baseline.",
        },
      ]
    : [
        {
          label: "Auth bridge",
          description:
            "Supabase Auth now resolves into public.users and session bootstrap.",
        },
        {
          label: "RBAC runtime",
          description:
            "Role, permission, and scope checks are centralized on the server.",
        },
        {
          label: "Seed dataset",
          description:
            "Demo companies, events, auth users, and RBAC assignments are seeded.",
        },
        {
          label: "RLS coverage",
          description:
            "Core tenant tables and runtime tables are protected with baseline policies.",
        },
      ];

  const remainingBackendGates = isVi
    ? [
        {
          label: "Dịch vụ module",
          description:
            "Workspace khách hàng, runtime check-in, offline sync và reports đã có route riêng; landing page, print, campaign, lucky draw và chatbot vẫn cần UI tính năng của riêng chúng.",
        },
        {
          label: "Truy vấn đối chiếu",
          description:
            "Các truy vấn nghiệp vụ và báo cáo quan trọng vẫn cần so sánh song song với output cũ.",
        },
        {
          label: "Điều phối job",
          description:
            "Background jobs cho import, export, print và messaging cần runtime thực thi và retry.",
        },
        {
          label: "Module tính năng",
          description:
            "Các shell page cho Workspace, Audience, Experience, Engagement và System đã live; bước tiếp theo là thay dần template surface bằng màn hình chuyên biệt.",
        },
      ]
    : [
        {
          label: "Module services",
          description:
            "Client workspace, check-in runtime, offline sync, and reports now have dedicated routes; landing page, print, campaign, lucky draw, and chatbot still need their own feature UI.",
        },
        {
          label: "Parity queries",
          description:
            "Critical report and operational queries still need side-by-side comparison with legacy output.",
        },
        {
          label: "Job orchestration",
          description:
            "Background jobs for import, export, print, and messaging need execution and retry hooks.",
        },
        {
          label: "Feature modules",
          description:
            "Workspace, audience, experience, engagement, and system shell pages are live; the next step is to keep replacing template surfaces with module-specific screens.",
        },
      ];

  const quickLinks = [
    { href: "/workspace/clients", label: isVi ? "Workspace khách hàng" : "Client workspace" },
    { href: "/checkin", label: isVi ? "Runtime check-in" : "Check-in runtime" },
    { href: "/reports", label: isVi ? "Báo cáo" : "Reports" },
    { href: "/system/template-vault", label: isVi ? "Kho template" : "Template vault" },
    { href: "/rbac/users", label: isVi ? "Quản lý người dùng" : "Manage users" },
  ] as const;

  const shellLanes = [
    {
      href: "/workspace",
      title: isVi ? "Không gian làm việc" : "Workspace",
      description: isVi
        ? "Công ty, sự kiện và cài đặt truy cập được gom chung một lane."
        : "Companies, events, and access settings live in one lane.",
      tone: "teal" as const,
    },
    {
      href: "/audience",
      title: isVi ? "Khách tham dự" : "Audience",
      description: isVi
        ? "Luồng intake khách hàng và read-model vận hành được giữ chung."
        : "Client intake and the operational read-model stay grouped together.",
      tone: "blue" as const,
    },
    {
      href: "/reports",
      title: isVi ? "Báo cáo" : "Reports",
      description: isVi
        ? "Parity báo cáo, coverage và lịch sử chạy hiện nằm ở route riêng."
        : "Report parity, coverage, and run history are now on a dedicated route.",
      tone: "violet" as const,
    },
    {
      href: "/experience",
      title: isVi ? "Trải nghiệm" : "Experience",
      description: isVi
        ? "Landing page, campaign, email, card và label được đặt ở đây."
        : "Landing pages, campaigns, email, cards, and labels sit here.",
      tone: "violet" as const,
    },
    {
      href: "/engagement",
      title: isVi ? "Tương tác" : "Engagement",
      description: isVi
        ? "Lucky draw, chatbot và print runtime được giữ chung một lane."
        : "Lucky draw, chatbot, and print runtime stay in one lane.",
      tone: "emerald" as const,
    },
    {
      href: "/system",
      title: isVi ? "Hệ thống" : "System",
      description: isVi
        ? "Quản trị, log và cài đặt tích hợp được tách khỏi luồng sản phẩm."
        : "Governance, logs, and integration settings are kept separate from product flows.",
      tone: "amber" as const,
    },
    {
      href: "/system/template-vault",
      title: isVi ? "Kho template" : "Template vault",
      description: isVi
        ? "Các route demo đã lưu trữ và component tái sử dụng vẫn còn để khai thác."
        : "Archived demo routes and reusable components remain available for reuse.",
      tone: "slate" as const,
    },
  ] as const;

  const metrics = [
    ...copy.metrics.map((metric, index) => ({
      label: metric.label,
      value: bootstrap.metrics[
        ["companyCount", "userCount", "eventCount", "permissionCount"][index] as
          | "companyCount"
          | "userCount"
          | "eventCount"
          | "permissionCount"
      ].toString(),
      note: metric.note,
    })),
  ] as const;

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white shadow-[0_18px_70px_rgba(15,23,42,0.24)]">
        <div className="grid gap-6 p-5 md:p-6 xl:grid-cols-[1.6fr_0.9fr] xl:p-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-teal-100">
                {copy.badge}
              </span>
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/12 px-2.5 py-1 text-[11px] font-semibold text-emerald-100">
                {copy.authLive}
              </span>
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/12 px-2.5 py-1 text-[11px] font-semibold text-emerald-100">
                {copy.rbacLive}
              </span>
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/12 px-2.5 py-1 text-[11px] font-semibold text-emerald-100">
                {copy.seedLive}
              </span>
            </div>

            <div className="max-w-3xl space-y-3">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-teal-200/80">
                {copy.eyebrow}
              </p>
              <h1 className="text-3xl font-semibold leading-tight text-white md:text-[2.8rem] xl:text-[3.15rem]">
                {copy.title}
              </h1>
              <p className="max-w-2xl text-base leading-6 text-slate-300 md:text-[1.05rem]">
                {copy.summary}
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
              {copy.currentWorkspace}
            </p>
            <div className="mt-3 space-y-3.5">
              <div>
                <div className="text-sm text-slate-300">{copy.company}</div>
                <div className="text-xl font-semibold text-white">{companyName}</div>
              </div>
              <div>
                <div className="text-sm text-slate-300">{copy.roles}</div>
                <div className="text-sm font-medium text-white">{roleSummary}</div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-3.5">
                  <div className="text-2xl font-semibold text-white">
                    {bootstrap.metrics.accessScopeCount}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                    {copy.accessibleScopes}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-3.5">
                  <div className="text-2xl font-semibold text-white">
                    {bootstrap.metrics.roleCount}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                    {copy.roleTemplates}
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3.5 text-sm text-emerald-50">
                {copy.rbacNote}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-[24px] border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-slate-900"
          >
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {metric.label}
            </p>
            <div className="mt-1.5 text-[2rem] font-semibold text-slate-950 dark:text-white">
              {metric.value}
            </div>
            <p className="mt-1.5 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {metric.note}
            </p>
          </article>
        ))}
      </section>

      <section className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-600 dark:text-violet-400">
              {copy.shellLanes}
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">
              {copy.shellLaneTitle}
            </h2>
          </div>
          <ToneBadge tone="amber" className="self-start">
            {copy.archivedDemos}
          </ToneBadge>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {shellLanes.map((lane) => (
            <Link
              key={lane.href}
              href={lane.href}
              className="group rounded-[22px] border border-stone-200 p-4 transition hover:border-teal-300 hover:shadow-sm dark:border-stone-800 dark:hover:border-teal-500"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <ToneBadge tone={lane.tone}>{lane.tone}</ToneBadge>
                  <h3 className="mt-2.5 text-xl font-semibold text-slate-950 transition group-hover:text-teal-700 dark:text-white dark:group-hover:text-teal-300">
                    {lane.title}
                  </h3>
                </div>
                <span className="rounded-full border border-stone-200 px-3 py-1 text-xs font-medium text-slate-500 dark:border-stone-700 dark:text-slate-400">
                  {isVi ? "Lane" : "Lane"}
                </span>
              </div>
              <p className="mt-2.5 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {lane.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-3 xl:grid-cols-2">
        <div className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-600 dark:text-teal-400">
            {copy.liveSectionTitle}
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
            {copy.liveSectionDescription}
          </p>
          <div className="mt-3.5 grid gap-3 sm:grid-cols-2">
            {foundationCards.map((card) => (
              <div
                key={card.label}
                className="rounded-2xl border border-stone-200 bg-stone-50 p-3.5 dark:border-stone-800 dark:bg-slate-950/60"
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
        </div>

        <div className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-600 dark:text-violet-400">
            {copy.nextSectionTitle}
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
            {copy.nextSectionDescription}
          </p>
          <div className="mt-3.5 grid gap-3 sm:grid-cols-2">
            {remainingBackendGates.map((gate) => (
              <div
                key={gate.label}
                className="rounded-2xl border border-stone-200 p-3.5 dark:border-stone-800"
              >
                <h3 className="font-semibold text-slate-950 dark:text-white">
                  {gate.label}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {gate.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
