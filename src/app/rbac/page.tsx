import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import {
  MetricCard,
  SectionCard,
  ToneBadge,
} from "@/components/rbac/panels";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getPermissionResourceLabel,
  getRbacBootstrapContext,
  getRoleLabel,
  getScopeLabel,
} from "@/lib/rbac/bootstrap";
import type { RoleKey } from "@/lib/rbac/roles";
import Link from "next/link";

export const metadata = {
  title: "RBAC Overview",
  description: "Server-side RBAC bootstrap snapshot for Giltech Solutions Check-in.",
};

export default function Page() {
  const { principal, payload, companies, roles, permissionGroups, metrics } =
    getRbacBootstrapContext();

  return (
    <div className="space-y-4">
      <Breadcrumb pageName="RBAC Overview" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Companies"
          value={metrics.companyCount}
          note={`${metrics.activeCompanyCount} active companies in the bootstrap dataset`}
          tone="blue"
        />
        <MetricCard
          label="Users"
          value={metrics.userCount}
          note={`${metrics.activeUserCount} seeded users with live assignments`}
          tone="emerald"
        />
        <MetricCard
          label="Roles"
          value={metrics.roleCount}
          note={`${roles.filter((role) => role.userCount > 0).length} roles are assigned in seed data`}
          tone="violet"
        />
        <MetricCard
          label="Permissions"
          value={metrics.permissionCount}
          note={`${permissionGroups.length} permission resources grouped in the registry`}
          tone="amber"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionCard
          title="Bootstrap session"
          description="This snapshot is produced server-side from createRbacPayload() so every page can consume the same permission contract."
          action={
            <ToneBadge tone="emerald">System scope</ToneBadge>
          }
        >
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-[16px] border border-stroke p-3.5 dark:border-dark-3">
              <p className="text-sm text-dark-4 dark:text-dark-6">Principal</p>
              <p className="mt-2 text-lg font-semibold text-dark dark:text-white">
                {principal.displayName}
              </p>
              <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
                User ID {principal.userId} · Default company ID {principal.defaultCompanyId}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {principal.roleKeys.map((roleKey) => (
                  <ToneBadge key={roleKey} tone="blue">
                    {getRoleLabel(roleKey as RoleKey)}
                  </ToneBadge>
                ))}
              </div>
            </div>

            <div className="rounded-[16px] border border-stroke p-3.5 dark:border-dark-3">
              <p className="text-sm text-dark-4 dark:text-dark-6">Effective access</p>
              <p className="mt-2 text-lg font-semibold text-dark dark:text-white">
                {payload.accessibleCompanyIds === null
                  ? "All companies"
                  : `${payload.accessibleCompanyIds.length} companies`}
              </p>
              <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
                {payload.accessibleEventIds === null
                  ? "All events"
                  : `${payload.accessibleEventIds.length} events`}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <ToneBadge tone="emerald">
                  {payload.permissionKeys.length} permissions
                </ToneBadge>
                <ToneBadge tone="teal">
                  {Object.keys(payload.permissionsByResource).length} resources
                </ToneBadge>
              </div>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-[16px] border border-stroke dark:border-dark-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Scope</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {principal.accessScopes.map((scope, index) => (
                  <TableRow key={`${scope.scopeType}-${index}`}>
                    <TableCell>{getScopeLabel(scope.scopeType)}</TableCell>
                    <TableCell>
                      {scope.companyId ?? "Global"}
                    </TableCell>
                    <TableCell>{scope.eventId ?? "Global"}</TableCell>
                    <TableCell>{scope.roleKey ?? "n/a"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </SectionCard>

        <SectionCard
          title="Quick links"
          description="The RBAC admin console is organized around the data model, not only menu visibility."
        >
          <div className="grid gap-2.5 sm:grid-cols-2">
            {[
              { label: "Companies", href: "/rbac/companies", note: "Multi-company scope and access" },
              { label: "Users", href: "/rbac/users", note: "Role assignment and memberships" },
              { label: "Roles", href: "/rbac/roles", note: "Role templates and default scope" },
              { label: "Permissions", href: "/rbac/permissions", note: "Registry coverage by resource" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-[16px] border border-stroke p-3.5 transition hover:border-primary hover:shadow-1 dark:border-dark-3 dark:hover:border-primary"
              >
                <p className="font-semibold text-dark dark:text-white">
                  {item.label}
                </p>
                <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
                  {item.note}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-5 rounded-[16px] border border-stroke p-4 dark:border-dark-3">
            <p className="text-sm text-dark-4 dark:text-dark-6">Current company breakdown</p>
            <div className="mt-3 space-y-3">
              {companies.map((company) => (
                <div
                  key={company.id}
                  className="flex items-center justify-between gap-4 border-b border-dashed border-stroke pb-3 last:border-b-0 last:pb-0 dark:border-dark-3"
                >
                  <div>
                    <p className="font-semibold text-dark dark:text-white">
                      {company.name}
                    </p>
                    <p className="text-sm text-dark-5 dark:text-dark-6">
                      {company.primaryDomain} · {company.planName}
                    </p>
                  </div>
                  <ToneBadge tone={company.scopeType === "system" ? "emerald" : "blue"}>
                    {company.scopeType}
                  </ToneBadge>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Company access matrix"
        description="This table shows the seeded companies, their subscription state, and the effective role coverage that will drive menu, API, and policy decisions."
      >
        <div className="overflow-hidden rounded-[16px] border border-stroke dark:border-dark-3">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Events</TableHead>
                <TableHead>Roles</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>
                    <div>
                      <p className="font-semibold text-dark dark:text-white">
                        {company.name}
                      </p>
                      <p className="text-sm text-dark-5 dark:text-dark-6">
                        {company.primaryDomain} · {company.contactEmail}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <ToneBadge tone={company.subscriptionStatus === "active" ? "emerald" : "amber"}>
                        {company.subscriptionStatus}
                      </ToneBadge>
                      <span className="text-sm text-dark-5 dark:text-dark-6">
                        {company.planName} ({company.planCode})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{company.activeUserCount} / {company.userCount}</TableCell>
                  <TableCell>{company.eventCount}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {company.roleKeys.map((roleKey) => (
                        <ToneBadge key={roleKey} tone="slate">
                          {getRoleLabel(roleKey)}
                        </ToneBadge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <SectionCard
        title="Role coverage by resource"
        description="Each role template is aligned to the permission registry so server actions, RLS, and UI gates can consume the same source of truth."
      >
        <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {roles.map((role) => (
            <div
              key={role.key}
              className="rounded-[16px] border border-stroke p-4 dark:border-dark-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-dark dark:text-white">
                    {role.name}
                  </p>
                  <p className="text-sm text-dark-5 dark:text-dark-6">
                    {role.description}
                  </p>
                </div>
                <ToneBadge tone={role.key === "system_admin" ? "emerald" : "blue"}>
                  {role.permissionCount} perms
                </ToneBadge>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <ToneBadge tone="violet">{role.defaultScope}</ToneBadge>
                <ToneBadge tone="slate">{role.userCount} users</ToneBadge>
              </div>
              <div className="mt-4 space-y-2">
                {Object.entries(role.resourceCounts).map(([resource, count]) => (
                  <div
                    key={resource}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="text-dark-5 dark:text-dark-6">
                      {getPermissionResourceLabel(resource as keyof typeof role.resourceCounts)}
                    </span>
                    <ToneBadge tone="teal">{count}</ToneBadge>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
