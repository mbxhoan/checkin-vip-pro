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

export function getAudienceShellLanding(
  context: ShellPageContext,
): ModuleLandingProps {
  return buildShellPage(
    {
      eyebrow: "Audience",
      title: "Client intake, check-in, and reports define the audience lane",
      summary:
        "This lane is where client data, check-in runtime, and report parity will live. The shell keeps the rewrite organized around the real operational flow instead of generic admin widgets.",
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
            "The data model for scanner access and event-scoped check-in is already in place.",
          tone: "emerald",
        },
        {
          title: "Client records",
          description:
            "Clients, scopes, and supporting operator data are retained in the backend foundation.",
          tone: "blue",
        },
        {
          title: "Report foundation",
          description:
            "The report lane already has seeded roles, users, and events for parity work.",
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
            "Bring the legacy client flows into a focused audience workspace.",
          tone: "blue",
        },
        {
          title: "Offline sync",
          description:
            "Close the scan app and sync paths that support field operations.",
          tone: "teal",
        },
        {
          title: "Report parity",
          description:
            "Validate report totals and operator views against the legacy system.",
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
        { href: "/rbac/users", label: "Operator assignments" },
        { href: "/rbac/permissions", label: "Permission registry" },
        { href: "/rbac", label: "RBAC overview" },
        { href: "/system/template-vault", label: "Template vault" },
      ],
      footerNote:
        "Maps to the Audience Operations bounded context. Check-in and report parity still need dedicated module screens.",
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
