import type { ModuleLandingProps } from "@/components/shell/module-landing";
import type { AuthSessionBootstrap } from "@/lib/auth/types";
import type { RbacBootstrapContext } from "@/lib/rbac/bootstrap";
import {
  ARCHIVED_COMPONENT_FAMILY_COUNT,
  ARCHIVED_DEMO_ROUTE_COUNT,
} from "./template-vault";

export interface ShellPageContext {
  session: AuthSessionBootstrap | null;
  bootstrap: RbacBootstrapContext;
}

const ARCHIVE_LINK = {
  href: "/system/template-vault",
  label: "Open template vault",
  note:
    "Archived demo routes and reusable shell components stay preserved here.",
} as const;

function buildPrincipalContext(context: ShellPageContext) {
  const workspaceName =
    context.session?.profile.defaultCompanyName ?? "Giltech Solutions";
  const principalName = context.session?.profile.displayName ?? "Guest";
  const roleSummary = context.session?.profile.roleKeys.length
    ? context.session.profile.roleKeys.join(" / ")
    : "No active role";
  const principalMeta = context.session
    ? `${workspaceName} / ${roleSummary}`
    : `${workspaceName} / sign in to load access`;

  return {
    workspaceName,
    principalName,
    principalMeta,
  };
}

function buildShellPage(overrides: Omit<ModuleLandingProps, "workspaceName" | "principalName" | "principalMeta">, context: ShellPageContext): ModuleLandingProps {
  const principalContext = buildPrincipalContext(context);

  return {
    ...overrides,
    workspaceName: principalContext.workspaceName,
    principalName: principalContext.principalName,
    principalMeta: principalContext.principalMeta,
    archiveLink: overrides.archiveLink ?? ARCHIVE_LINK,
  };
}

export function getWorkspaceShellLanding(
  context: ShellPageContext,
): ModuleLandingProps {
  return buildShellPage(
    {
      eyebrow: "Workspace",
      title: "Companies, events, and settings stay in one shell",
      summary:
        "This lane groups tenant management, event setup, and access scaffolding so the UX rewrite can focus on real workflow surfaces instead of generic admin cards.",
      tone: "teal",
      statusChips: [
        { label: "Phase 1 shell", tone: "teal" },
        { label: "Company scope", tone: "blue" },
        { label: "Event setup", tone: "emerald" },
      ],
      metrics: [
        {
          label: "Companies",
          value: context.bootstrap.metrics.activeCompanyCount,
          note: "Seeded companies ready for the next UI pass",
          tone: "teal",
        },
        {
          label: "Events",
          value: context.bootstrap.metrics.activeEventCount,
          note: "Event rows and access scopes are live",
          tone: "blue",
        },
        {
          label: "Users",
          value: context.bootstrap.metrics.activeUserCount,
          note: "Auth mapping and profiles are already wired",
          tone: "emerald",
        },
        {
          label: "Roles",
          value: context.bootstrap.metrics.roleCount,
          note: "RBAC templates are loaded for the workspace lane",
          tone: "amber",
        },
      ],
      liveCards: [
        {
          title: "Company tenancy",
          description:
            "Company records, domains, and subscription state are seeded and ready for edit screens.",
          tone: "blue",
        },
        {
          title: "Event setup",
          description:
            "Event rows, settings, and access scopes already sit behind the workspace shell.",
          tone: "teal",
        },
        {
          title: "RBAC bridge",
          description:
            "Workspace access is enforced by role, permission, and scope on the server.",
          tone: "emerald",
        },
        {
          title: "Seed alignment",
          description:
            "The local dataset already contains companies, events, users, roles, and scopes.",
          tone: "violet",
        },
      ],
      nextCards: [
        {
          title: "Company detail UX",
          description:
            "Turn the company console into a dedicated edit experience with clear tenancy copy.",
          tone: "amber",
        },
        {
          title: "Event settings",
          description:
            "Replace placeholder admin affordances with event setup and publication workflows.",
          tone: "blue",
        },
        {
          title: "Event files",
          description:
            "Surface file and media management in the workspace lane instead of the template admin shell.",
          tone: "teal",
        },
        {
          title: "Dynamic fields",
          description:
            "Move custom fields and language definitions into the workspace rewrite path.",
          tone: "violet",
        },
      ],
      quickLinks: [
        { href: "/rbac/companies", label: "Company console" },
        { href: "/workspace/clients", label: "Client workspace" },
        { href: "/rbac/users", label: "User access" },
        { href: "/rbac", label: "RBAC overview" },
        { href: "/system/template-vault", label: "Template vault" },
      ],
      footerNote:
        "Maps to the Workspace bounded context in docs/init/target-architecture.md. The shell is live; feature screens will land next.",
    },
    context,
  );
}

export function getWorkspaceClientsLanding(
  context: ShellPageContext,
): ModuleLandingProps {
  return buildShellPage(
    {
      eyebrow: "Workspace",
      title: "Client workspace, backups, and import/export hooks live in one route",
      summary:
        "This lane gives operators a focused home for client CRUD, backup inventory, and job queue hooks while tenancy and event setup stay in the workspace shell.",
      tone: "teal",
      statusChips: [
        { label: "Phase 3 screen", tone: "teal" },
        { label: "Client CRUD", tone: "blue" },
        { label: "Queue bridge", tone: "emerald" },
      ],
      metrics: [
        {
          label: "Companies",
          value: context.bootstrap.metrics.companyCount,
          note: "Tenant data already feeds the client workspace",
          tone: "teal",
        },
        {
          label: "Events",
          value: context.bootstrap.metrics.activeEventCount,
          note: "Scoped event rows back the editable client records",
          tone: "blue",
        },
        {
          label: "Users",
          value: context.bootstrap.metrics.activeUserCount,
          note: "Auth mappings and operator identities are live",
          tone: "emerald",
        },
        {
          label: "Permissions",
          value: context.bootstrap.metrics.permissionCount,
          note: "Client actions remain permission aware on the server",
          tone: "amber",
        },
      ],
      liveCards: [
        {
          title: "Client CRUD",
          description:
            "The workspace route now provides create and update flows for attendee records.",
          tone: "blue",
        },
        {
          title: "Backup inventory",
          description:
            "Import and export backups remain visible for parity and future bulk operations.",
          tone: "teal",
        },
        {
          title: "Queue bridge",
          description:
            "Client import and export actions now enqueue background jobs instead of relying on template screens.",
          tone: "emerald",
        },
        {
          title: "Scope guard",
          description:
            "Permission and scope checks happen on the server before the route mutates data.",
          tone: "amber",
        },
      ],
      nextCards: [
        {
          title: "Bulk import validation",
          description:
            "Add richer file validation and mapping for production client imports.",
          tone: "blue",
        },
        {
          title: "Export execution",
          description:
            "Connect the queued export job to the eventual worker runtime.",
          tone: "emerald",
        },
        {
          title: "Duplicate handling",
          description:
            "Add stronger duplicate and merge guards before cutover.",
          tone: "amber",
        },
        {
          title: "Device-friendly editing",
          description:
            "Keep quick edit paths usable on operator tablets and scan devices.",
          tone: "violet",
        },
      ],
      quickLinks: [
        { href: "/workspace", label: "Workspace shell" },
        { href: "/checkin", label: "Check-in runtime" },
        { href: "/reports", label: "Reports" },
        { href: "/system/template-vault", label: "Template vault" },
      ],
      footerNote:
        "Maps to the Clients bounded context. Dedicated client workspace is live; deeper bulk parity still needs worker support.",
    },
    context,
  );
}

export function getAudienceShellLanding(
  context: ShellPageContext,
): ModuleLandingProps {
  return buildShellPage(
    {
      eyebrow: "Audience",
      title: "Audience overview and read-model keep the operations lane connected",
      summary:
        "This lane keeps the cross-module operational snapshot together. Client workspace, check-in runtime, offline sync, and report parity now live on dedicated routes while this overview stays read-only.",
      tone: "blue",
      statusChips: [
        { label: "Phase 1 shell", tone: "blue" },
        { label: "Operator lane", tone: "emerald" },
        { label: "Report parity", tone: "amber" },
      ],
      metrics: [
        {
          label: "Events",
          value: context.bootstrap.metrics.activeEventCount,
          note: "Check-in contexts already exist in the seed set",
          tone: "blue",
        },
        {
          label: "Users",
          value: context.bootstrap.metrics.userCount,
          note: "Operators and scanner access are mapped",
          tone: "emerald",
        },
        {
          label: "Scopes",
          value: context.bootstrap.metrics.accessScopeCount,
          note: "Scope-aware authorization is already wired",
          tone: "violet",
        },
        {
          label: "Permissions",
          value: context.bootstrap.metrics.permissionCount,
          note: "Audience actions can lean on the registry",
          tone: "amber",
        },
      ],
      liveCards: [
        {
          title: "Check-in runtime",
          description:
            "Scanner access, event-scoped check-in, and offline batches are available on dedicated routes.",
          tone: "emerald",
        },
        {
          title: "Client records",
          description:
            "Clients, scopes, and supporting operator data remain available for the audience read-model.",
          tone: "blue",
        },
        {
          title: "Report foundation",
          description:
            "Report coverage and execution history now live on a dedicated reports route.",
          tone: "violet",
        },
        {
          title: "Operator access",
          description:
            "RBAC gates decide what a user can see and do across the audience surfaces.",
          tone: "amber",
        },
      ],
      nextCards: [
        {
          title: "Client import/export",
          description:
            "Keep parity around client import/export while the dedicated workspace route matures.",
          tone: "blue",
        },
        {
          title: "Offline sync",
          description:
            "Finish the remaining reset and worker execution flows for the offline route.",
          tone: "teal",
        },
        {
          title: "Report parity",
          description:
            "Validate report totals and legacy comparisons against the dedicated reports screen.",
          tone: "amber",
        },
        {
          title: "Device management",
          description:
            "Give scanners and operator devices a dedicated management view.",
          tone: "violet",
        },
      ],
      quickLinks: [
        { href: "/workspace/clients", label: "Client workspace" },
        { href: "/checkin", label: "Check-in runtime" },
        { href: "/reports", label: "Reports" },
        { href: "/rbac/permissions", label: "Permission registry" },
        { href: "/system/template-vault", label: "Template vault" },
      ],
      footerNote:
        "Maps to the Audience Operations bounded context. The read-model is live; the mutating workflows now sit behind dedicated routes.",
    },
    context,
  );
}

export function getCheckinRuntimeLanding(
  context: ShellPageContext,
): ModuleLandingProps {
  return buildShellPage(
    {
      eyebrow: "Audience",
      title: "Check-in runtime and offline sync run the operator lane",
      summary:
        "This route groups scan actions, device heartbeat, and offline batch reconciliation so the runtime can be rewritten without losing field flow.",
      tone: "emerald",
      statusChips: [
        { label: "Phase 3 screen", tone: "emerald" },
        { label: "Scan runtime", tone: "blue" },
        { label: "Offline queue", tone: "amber" },
      ],
      metrics: [
        {
          label: "Events",
          value: context.bootstrap.metrics.activeEventCount,
          note: "Scoped event rows drive the operator runtime",
          tone: "emerald",
        },
        {
          label: "Users",
          value: context.bootstrap.metrics.userCount,
          note: "Operators and scanner identities are already mapped",
          tone: "blue",
        },
        {
          label: "Scopes",
          value: context.bootstrap.metrics.accessScopeCount,
          note: "Company and event grants keep scan actions scoped",
          tone: "violet",
        },
        {
          label: "Permissions",
          value: context.bootstrap.metrics.permissionCount,
          note: "Check-in actions remain permission aware",
          tone: "amber",
        },
      ],
      liveCards: [
        {
          title: "Check-in action",
          description:
            "The runtime screen now creates live check-in rows from registration codes and client records.",
          tone: "emerald",
        },
        {
          title: "Device heartbeat",
          description:
            "Scanner devices and their sync timestamps are surfaced alongside the runtime queue.",
          tone: "blue",
        },
        {
          title: "Offline batches",
          description:
            "Offline batch rows are visible so operators can reconcile queued scans.",
          tone: "amber",
        },
        {
          title: "Scope guard",
          description:
            "Server-side permission checks prevent the scan route from bypassing RBAC.",
          tone: "violet",
        },
      ],
      nextCards: [
        {
          title: "Offline reset",
          description:
            "Finish the remaining reset and replay flows for field operators.",
          tone: "blue",
        },
        {
          title: "Worker execution",
          description:
            "Hook scan reconciliation to a real background worker instead of a placeholder job row.",
          tone: "emerald",
        },
        {
          title: "Device assignment",
          description:
            "Add clearer assignment and revoke flows for scanner devices.",
          tone: "amber",
        },
        {
          title: "Parity backfill",
          description:
            "Compare the runtime output against the legacy scan flow before pilot cutover.",
          tone: "violet",
        },
      ],
      quickLinks: [
        { href: "/checkin", label: "Check-in runtime" },
        { href: "/sync-offline", label: "Offline sync" },
        { href: "/workspace/clients", label: "Client workspace" },
        { href: "/reports", label: "Reports" },
      ],
      footerNote:
        "Maps to the Check-in bounded context. Scan and sync routes are live; worker execution and reset parity still need productization.",
    },
    context,
  );
}

export function getOfflineSyncLanding(
  context: ShellPageContext,
): ModuleLandingProps {
  return buildShellPage(
    {
      eyebrow: "Audience",
      title: "Offline sync and batch reconciliation stay separate from the scan surface",
      summary:
        "This route keeps the sync queue visible without mixing it into the live scan path. Operators can reconcile batches and device heartbeats from one dedicated place.",
      tone: "amber",
      statusChips: [
        { label: "Phase 3 screen", tone: "amber" },
        { label: "Sync queue", tone: "emerald" },
        { label: "Device heartbeat", tone: "blue" },
      ],
      metrics: [
        {
          label: "Events",
          value: context.bootstrap.metrics.activeEventCount,
          note: "Offline batches remain event scoped",
          tone: "amber",
        },
        {
          label: "Operators",
          value: context.bootstrap.metrics.activeUserCount,
          note: "Operator identities stay attached to sync state",
          tone: "blue",
        },
        {
          label: "Scopes",
          value: context.bootstrap.metrics.accessScopeCount,
          note: "Offline reconciliation respects company and event scope",
          tone: "emerald",
        },
        {
          label: "Permissions",
          value: context.bootstrap.metrics.permissionCount,
          note: "Sync actions reuse the check-in permission model",
          tone: "violet",
        },
      ],
      liveCards: [
        {
          title: "Queued batches",
          description:
            "The route surfaces offline batch rows and their sync status for operator review.",
          tone: "amber",
        },
        {
          title: "Device sync",
          description:
            "Scanner device heartbeat and last sync timestamps are grouped with the queue.",
          tone: "blue",
        },
        {
          title: "Background jobs",
          description:
            "The sync surface exposes the job bridge that will later be handed to worker execution.",
          tone: "emerald",
        },
        {
          title: "Scope guard",
          description:
            "Only principals with the right check-in permissions can reconcile batches.",
          tone: "violet",
        },
      ],
      nextCards: [
        {
          title: "Reset and replay",
          description:
            "Add explicit reset and replay controls for failed offline batches.",
          tone: "amber",
        },
        {
          title: "Worker execution",
          description:
            "Move the sync queue from a seeded row to a durable worker workflow.",
          tone: "emerald",
        },
        {
          title: "Failure recovery",
          description:
            "Surface failed batch recovery with clearer retry and error detail.",
          tone: "blue",
        },
        {
          title: "Audit trail",
          description:
            "Keep sync history visible for operators and support staff.",
          tone: "violet",
        },
      ],
      quickLinks: [
        { href: "/checkin", label: "Check-in runtime" },
        { href: "/workspace/clients", label: "Client workspace" },
        { href: "/reports", label: "Reports" },
        { href: "/system/template-vault", label: "Template vault" },
      ],
      footerNote:
        "Maps to the offline reconciliation slice of the Check-in bounded context. The sync route is live; reset and worker execution still need finish work.",
    },
    context,
  );
}

export function getReportsShellLanding(
  context: ShellPageContext,
): ModuleLandingProps {
  return buildShellPage(
    {
      eyebrow: "Reports",
      title: "Report parity, coverage, and execution history sit in a dedicated lane",
      summary:
        "This route exposes the report catalog and run history needed to compare the replatform with the legacy system before UX/UI rewrite.",
      tone: "violet",
      statusChips: [
        { label: "Phase 3 screen", tone: "violet" },
        { label: "Parity lane", tone: "amber" },
        { label: "Coverage ready", tone: "emerald" },
      ],
      metrics: [
        {
          label: "Companies",
          value: context.bootstrap.metrics.companyCount,
          note: "Report scopes stay tenant aware",
          tone: "violet",
        },
        {
          label: "Events",
          value: context.bootstrap.metrics.activeEventCount,
          note: "Event scope is already wired into report data",
          tone: "blue",
        },
        {
          label: "Users",
          value: context.bootstrap.metrics.userCount,
          note: "Requested-by metadata stays attached to run history",
          tone: "emerald",
        },
        {
          label: "Permissions",
          value: context.bootstrap.metrics.permissionCount,
          note: "Report actions stay behind the registry",
          tone: "amber",
        },
      ],
      liveCards: [
        {
          title: "Report catalog",
          description:
            "The dedicated reports route now shows the live report catalog and current scope.",
          tone: "violet",
        },
        {
          title: "Run history",
          description:
            "Latest report runs are visible so parity can be checked before release.",
          tone: "emerald",
        },
        {
          title: "Coverage snapshot",
          description:
            "Coverage state highlights which active reports have a successful run.",
          tone: "amber",
        },
        {
          title: "Parity notes",
          description:
            "The screen keeps legacy-vs-new comparison work front and center.",
          tone: "blue",
        },
      ],
      nextCards: [
        {
          title: "Drill-down export",
          description:
            "Add report drill-down and export flows on top of the snapshot.",
          tone: "emerald",
        },
        {
          title: "Legacy compare",
          description:
            "Compare the current totals against the legacy system before pilot cutover.",
          tone: "amber",
        },
        {
          title: "Parameterized runs",
          description:
            "Expose filters and parameters as the reports UI grows.",
          tone: "blue",
        },
        {
          title: "Refresh cadence",
          description:
            "Document the runtime refresh pattern for operators and analysts.",
          tone: "violet",
        },
      ],
      quickLinks: [
        { href: "/audience", label: "Audience overview" },
        { href: "/checkin", label: "Check-in runtime" },
        { href: "/workspace/clients", label: "Client workspace" },
        { href: "/system/template-vault", label: "Template vault" },
      ],
      footerNote:
        "Maps to the Reports bounded context. Dedicated parity screen is live; drill-down and export workflows still need legacy comparison.",
    },
    context,
  );
}

export function getExperienceShellLanding(
  context: ShellPageContext,
): ModuleLandingProps {
  return buildShellPage(
    {
      eyebrow: "Experience",
      title: "Landing pages, campaigns, and templates shape the experience lane",
      summary:
        "This lane owns the public-facing and communication surfaces. The shell keeps landing pages, campaigns, email, cards, and labels grouped together before the rewrite starts.",
      tone: "violet",
      statusChips: [
        { label: "Phase 1 shell", tone: "violet" },
        { label: "Public journey", tone: "blue" },
        { label: "Template reuse", tone: "amber" },
      ],
      metrics: [
        {
          label: "Archived routes",
          value: ARCHIVED_DEMO_ROUTE_COUNT,
          note: "Legacy demo routes stay available in the vault",
          tone: "amber",
        },
        {
          label: "Component families",
          value: ARCHIVED_COMPONENT_FAMILY_COUNT,
          note: "Reusable UI families are preserved for later reuse",
          tone: "violet",
        },
        {
          label: "Companies",
          value: context.bootstrap.metrics.companyCount,
          note: "Experience work still sits under tenant-aware data",
          tone: "blue",
        },
        {
          label: "Permissions",
          value: context.bootstrap.metrics.permissionCount,
          note: "Campaign and template actions can lean on the registry",
          tone: "emerald",
        },
      ],
      liveCards: [
        {
          title: "Landing page archive",
          description:
            "Existing registration and marketing entry points remain preserved for later reuse.",
          tone: "blue",
        },
        {
          title: "Campaign scaffolding",
          description:
            "Campaign and email domain models already exist in the backend foundation.",
          tone: "violet",
        },
        {
          title: "Template vault",
          description:
            "Demo routes, shell pieces, and reusable component families are kept in one place.",
          tone: "amber",
        },
        {
          title: "Legal surfaces",
          description:
            "Brand and legal copy already live in the shell so the public journey is coherent.",
          tone: "emerald",
        },
      ],
      nextCards: [
        {
          title: "Landing page editor",
          description:
            "Turn the registration flow into a dedicated experience editor.",
          tone: "blue",
        },
        {
          title: "Campaign builder",
          description:
            "Give campaign creation a focused workspace instead of a demo admin layout.",
          tone: "violet",
        },
        {
          title: "Email templates",
          description:
            "Move sender and template management into a communication-centric shell.",
          tone: "amber",
        },
        {
          title: "Cards and labels",
          description:
            "Keep the print-ready assets tied to the experience lane before engagement runtime begins.",
          tone: "teal",
        },
      ],
      quickLinks: [
        { href: "/system/template-vault", label: "Template vault" },
        { href: "/terms-of-use", label: "Terms" },
        { href: "/privacy-policy", label: "Privacy" },
        { href: "/rbac/permissions", label: "Permissions" },
      ],
      footerNote:
        "Maps to the Experience and Communication bounded context. Public journey modules still need their own UX rewrite.",
    },
    context,
  );
}

export function getEngagementShellLanding(
  context: ShellPageContext,
): ModuleLandingProps {
  return buildShellPage(
    {
      eyebrow: "Engagement",
      title: "Lucky draw, chatbot, and print runtime belong to the engagement lane",
      summary:
        "This lane groups the long-running, stateful, and operator-heavy surfaces. The shell keeps the runtime tools together so workflow and orchestration can be rewritten without losing scope.",
      tone: "emerald",
      statusChips: [
        { label: "Phase 1 shell", tone: "emerald" },
        { label: "Runtime lane", tone: "amber" },
        { label: "Workflow ready", tone: "teal" },
      ],
      metrics: [
        {
          label: "Events",
          value: context.bootstrap.metrics.eventCount,
          note: "Runtime scopes already exist for seeded events",
          tone: "emerald",
        },
        {
          label: "Roles",
          value: context.bootstrap.metrics.roleCount,
          note: "Runtime access can be locked down by RBAC",
          tone: "blue",
        },
        {
          label: "Users",
          value: context.bootstrap.metrics.userCount,
          note: "Operator identities are already mapped",
          tone: "violet",
        },
        {
          label: "Permissions",
          value: context.bootstrap.metrics.permissionCount,
          note: "The runtime lanes can reuse the existing registry",
          tone: "amber",
        },
      ],
      liveCards: [
        {
          title: "Print bridge foundation",
          description:
            "Print job tables and render paths are already seeded for future orchestration.",
          tone: "blue",
        },
        {
          title: "Chatbot hooks",
          description:
            "Chat and integration logs already exist to support runtime workflows.",
          tone: "violet",
        },
        {
          title: "Lucky draw domain",
          description:
            "Lucky draw records and reward structures are preserved in the backend model.",
          tone: "amber",
        },
        {
          title: "Job readiness",
          description:
            "Background job plumbing is tracked as a backend gate before UI rewrite.",
          tone: "teal",
        },
      ],
      nextCards: [
        {
          title: "Lucky draw builder",
          description:
            "Move builder and draw controls into a dedicated runtime workspace.",
          tone: "blue",
        },
        {
          title: "Chatbot flows",
          description:
            "Expose operator and system prompts in a managed engagement surface.",
          tone: "violet",
        },
        {
          title: "Print orchestration",
          description:
            "Wire the print queue and render pipeline into a focused operator UI.",
          tone: "amber",
        },
        {
          title: "Audio support",
          description:
            "Keep audio assets and runtime cues alongside the engagement lane.",
          tone: "teal",
        },
      ],
      quickLinks: [
        { href: "/system/template-vault", label: "Template vault" },
        { href: "/rbac/permissions", label: "Permissions" },
        { href: "/rbac/users", label: "Users" },
        { href: "/rbac", label: "RBAC overview" },
      ],
      footerNote:
        "Maps to the Engagement Runtime bounded context. Long-running workflows still need their own UI and job orchestration layer.",
    },
    context,
  );
}

export function getSystemShellLanding(
  context: ShellPageContext,
): ModuleLandingProps {
  return buildShellPage(
    {
      eyebrow: "System",
      title: "Governance, logs, legal, and integrations sit in the system lane",
      summary:
        "This lane keeps the platform administration surfaces separated from product workflows. The shell gives us a place for logs, audits, legal content, and integration settings before the final rewrite.",
      tone: "amber",
      statusChips: [
        { label: "Phase 1 shell", tone: "amber" },
        { label: "Governance lane", tone: "teal" },
        { label: "Audit ready", tone: "blue" },
      ],
      metrics: [
        {
          label: "Users",
          value: context.bootstrap.metrics.userCount,
          note: "User identities and auth mapping are live",
          tone: "amber",
        },
        {
          label: "Roles",
          value: context.bootstrap.metrics.roleCount,
          note: "System access can be controlled by role",
          tone: "blue",
        },
        {
          label: "Permissions",
          value: context.bootstrap.metrics.permissionCount,
          note: "Governance actions can reuse the registry",
          tone: "emerald",
        },
        {
          label: "Scopes",
          value: context.bootstrap.metrics.accessScopeCount,
          note: "Company, event, and self scopes already exist",
          tone: "violet",
        },
      ],
      liveCards: [
        {
          title: "Auth bootstrap",
          description:
            "Supabase Auth already resolves into public.users and RBAC payloads on the server.",
          tone: "emerald",
        },
        {
          title: "RBAC console",
          description:
            "Company, user, role, and permission management already have dedicated admin screens.",
          tone: "blue",
        },
        {
          title: "Template archive",
          description:
            "Legacy demo routes and reusable components stay available in the vault.",
          tone: "amber",
        },
        {
          title: "Legal surfaces",
          description:
            "Terms, privacy, and refund pages are already branded for Giltech Solutions.",
          tone: "teal",
        },
      ],
      nextCards: [
        {
          title: "Integration settings",
          description:
            "Group webhook, mail, and system configuration in one admin area.",
          tone: "blue",
        },
        {
          title: "History logs",
          description:
            "Expose audit and action history as a first-class system workflow.",
          tone: "violet",
        },
        {
          title: "Brand review",
          description:
            "Sweep the remaining copy, labels, and documents before UX/UI rewrite.",
          tone: "amber",
        },
        {
          title: "Cutover guardrails",
          description:
            "Keep the final release path tied to RLS, auth, and parity checks.",
          tone: "teal",
        },
      ],
      quickLinks: [
        { href: "/rbac", label: "RBAC overview" },
        { href: "/terms-of-use", label: "Terms" },
        { href: "/privacy-policy", label: "Privacy" },
        { href: "/payment-refund-policy", label: "Refunds" },
        { href: "/system/template-vault", label: "Template vault" },
      ],
      footerNote:
        "Maps to the Identity and Access bounded context plus system operations. The system lane is live; the integration and audit UI still need a rewrite.",
    },
    context,
  );
}
