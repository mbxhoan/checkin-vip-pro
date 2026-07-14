import "server-only";

import { cache } from "react";

import {
  PERMISSION_GROUPS,
  PERMISSION_KEYS,
  groupPermissionsByResource,
  type PermissionKey,
  type PermissionResource,
} from "./permissions";
import { createRbacPayload } from "./authorize";
import {
  ROLE_KEYS,
  ROLE_TEMPLATES,
  getRoleTemplate,
  type RoleKey,
  type RoleTemplate,
} from "./roles";
import { buildScopeDescriptor } from "./scope";
import type { AccessScope, AppScopeType, RbacPayload, RbacPrincipal } from "./types";

export interface BootstrapCompany {
  id: number;
  name: string;
  slug: string;
  legalName: string;
  status: "active" | "draft" | "inactive" | "suspended" | "archived";
  subscriptionStatus: "active" | "trialing" | "past_due" | "cancelled" | "expired";
  planCode: string;
  planName: string;
  primaryDomain: string;
  billingEmail: string;
  contactEmail: string;
  scopeType: AppScopeType;
  userCount: number;
  activeUserCount: number;
  eventCount: number;
  roleKeys: readonly RoleKey[];
}

export interface BootstrapEvent {
  id: number;
  companyId: number;
  companyName: string;
  name: string;
  code: string;
  status: "draft" | "published" | "active" | "completed" | "archived";
  visibility: "private" | "unlisted" | "public";
  startsAt: string;
  endsAt: string;
  landingPageSlug: string | null;
  accessRoleKeys: readonly RoleKey[];
}

export interface BootstrapUser {
  id: number;
  name: string;
  email: string;
  companyId: number;
  companyName: string;
  eventId: number | null;
  eventName: string | null;
  status: "active";
  loginApp: "web" | "scanner" | "both";
  isSuperAdmin: boolean;
  roleKeys: readonly RoleKey[];
  scopeType: AppScopeType;
  scopeLabel: string;
  grantedBy: string;
  permissionCount: number;
  lastSeenAt: string;
  accessScopes: readonly AccessScope[];
}

export interface BootstrapRoleSummary extends RoleTemplate {
  permissionCount: number;
  userCount: number;
  resourceCounts: Partial<Record<PermissionResource, number>>;
  topPermissions: readonly PermissionKey[];
}

export interface BootstrapPermissionGroup {
  resource: PermissionResource;
  permissions: readonly PermissionKey[];
  roleKeys: readonly RoleKey[];
  roleCount: number;
}

export interface RbacBootstrapContext {
  principal: RbacPrincipal;
  payload: RbacPayload;
  companies: readonly BootstrapCompany[];
  events: readonly BootstrapEvent[];
  users: readonly BootstrapUser[];
  roles: readonly BootstrapRoleSummary[];
  permissionGroups: readonly BootstrapPermissionGroup[];
  metrics: {
    companyCount: number;
    activeCompanyCount: number;
    eventCount: number;
    activeEventCount: number;
    userCount: number;
    activeUserCount: number;
    roleCount: number;
    permissionCount: number;
    accessScopeCount: number;
  };
}

interface SeedGrant {
  userId: number;
  roleKey: RoleKey;
  scopeType: AppScopeType;
  companyId?: number | null;
  eventId?: number | null;
  grantedBy: string;
}

interface SeedUser {
  id: number;
  name: string;
  email: string;
  companyId: number;
  companyName: string;
  eventId: number | null;
  eventName: string | null;
  loginApp: "web" | "scanner" | "both";
  isSuperAdmin: boolean;
  lastSeenAt: string;
  grant: SeedGrant;
}

const COMPANY_SEEDS = [
  {
    id: 101,
    name: "Giltech Solutions",
    slug: "giltech-solutions",
    legalName: "Giltech Solutions",
    status: "active",
    subscriptionStatus: "active",
    planCode: "starter",
    planName: "Starter",
    primaryDomain: "giltech-solutions.local",
    billingEmail: "billing@giltechsolutions.local",
    contactEmail: "ops@giltechsolutions.local",
    scopeType: "system",
  },
  {
    id: 201,
    name: "Northwind Expo",
    slug: "northwind-expo",
    legalName: "Northwind Expo Limited",
    status: "active",
    subscriptionStatus: "trialing",
    planCode: "growth",
    planName: "Growth",
    primaryDomain: "northwind-expo.local",
    billingEmail: "billing@northwind-expo.local",
    contactEmail: "admin@northwind-expo.local",
    scopeType: "company",
  },
] as const satisfies readonly Omit<BootstrapCompany, "userCount" | "activeUserCount" | "eventCount" | "roleKeys">[];

const EVENT_SEEDS = [
  {
    id: 401,
    companyId: 101,
    companyName: "Giltech Solutions",
    name: "Giltech Launch 2026",
    code: "GL-2026",
    status: "active",
    visibility: "private",
    startsAt: "April 18, 2026 09:00",
    endsAt: "April 18, 2026 17:00",
    landingPageSlug: null,
  },
  {
    id: 402,
    companyId: 201,
    companyName: "Northwind Expo",
    name: "Northwind Summit 2026",
    code: "NW-2026",
    status: "published",
    visibility: "public",
    startsAt: "April 20, 2026 09:00",
    endsAt: "April 20, 2026 18:00",
    landingPageSlug: "northwind-summit-2026-register",
  },
] as const satisfies readonly Omit<BootstrapEvent, "accessRoleKeys">[];

const USER_SEEDS = [
  {
    id: 1001,
    name: "Platform Admin",
    email: "platform@giltechsolutions.local",
    companyId: 101,
    companyName: "Giltech Solutions",
    eventId: null,
    eventName: null,
    loginApp: "both",
    isSuperAdmin: true,
    lastSeenAt: "April 7, 2026 09:00",
    grant: {
      userId: 1001,
      roleKey: "system_admin",
      scopeType: "system",
      companyId: null,
      eventId: null,
      grantedBy: "system bootstrap",
    },
  },
  {
    id: 1002,
    name: "Northwind Admin",
    email: "admin@northwind-expo.local",
    companyId: 201,
    companyName: "Northwind Expo",
    eventId: null,
    eventName: null,
    loginApp: "web",
    isSuperAdmin: false,
    lastSeenAt: "April 7, 2026 09:10",
    grant: {
      userId: 1002,
      roleKey: "company_admin",
      scopeType: "company",
      companyId: 201,
      eventId: null,
      grantedBy: "Platform Admin",
    },
  },
  {
    id: 1003,
    name: "Event Manager",
    email: "manager@northwind-expo.local",
    companyId: 201,
    companyName: "Northwind Expo",
    eventId: 402,
    eventName: "Northwind Summit 2026",
    loginApp: "web",
    isSuperAdmin: false,
    lastSeenAt: "April 7, 2026 09:12",
    grant: {
      userId: 1003,
      roleKey: "event_manager",
      scopeType: "event",
      companyId: 201,
      eventId: 402,
      grantedBy: "Northwind Admin",
    },
  },
  {
    id: 1004,
    name: "Scanner Device",
    email: "scanner@northwind-expo.local",
    companyId: 201,
    companyName: "Northwind Expo",
    eventId: 402,
    eventName: "Northwind Summit 2026",
    loginApp: "scanner",
    isSuperAdmin: false,
    lastSeenAt: "April 20, 2026 09:32",
    grant: {
      userId: 1004,
      roleKey: "scanner_device",
      scopeType: "event",
      companyId: 201,
      eventId: 402,
      grantedBy: "Northwind Admin",
    },
  },
  {
    id: 1005,
    name: "Report Analyst",
    email: "analyst@northwind-expo.local",
    companyId: 201,
    companyName: "Northwind Expo",
    eventId: null,
    eventName: null,
    loginApp: "web",
    isSuperAdmin: false,
    lastSeenAt: "April 7, 2026 09:18",
    grant: {
      userId: 1005,
      roleKey: "report_analyst",
      scopeType: "company",
      companyId: 201,
      eventId: null,
      grantedBy: "Northwind Admin",
    },
  },
] as const satisfies readonly SeedUser[];

function sortRoleKeys(roleKeys: readonly RoleKey[]): RoleKey[] {
  const set = new Set(roleKeys);

  return ROLE_KEYS.filter((roleKey) => set.has(roleKey));
}

function collectPermissionsForRoles(roleKeys: readonly RoleKey[]): PermissionKey[] {
  const permissions = new Set<PermissionKey>();

  for (const roleKey of roleKeys) {
    for (const permissionKey of getRoleTemplate(roleKey).permissions) {
      permissions.add(permissionKey);
    }
  }

  return Array.from(permissions).sort();
}

function scopeLabel(
  scopeType: AppScopeType,
  companyName: string,
  eventName: string | null,
) {
  if (scopeType === "system") {
    return "System";
  }

  if (scopeType === "company") {
    return `Company · ${companyName}`;
  }

  if (scopeType === "event") {
    return `Event · ${eventName ?? "Unknown event"}`;
  }

  return "Self";
}

function createAccessGrant(grant: SeedGrant): AccessScope {
  return {
    ...buildScopeDescriptor(grant.scopeType, {
      companyId: grant.companyId ?? null,
      eventId: grant.eventId ?? null,
      userId: grant.userId,
    }),
    membershipStatus: "active",
    roleKey: grant.roleKey,
  };
}

function buildBootstrapContext(): RbacBootstrapContext {
  const userRows: BootstrapUser[] = USER_SEEDS.map((user) => {
    const accessScopes = [createAccessGrant(user.grant)];
    const roleKeys = sortRoleKeys([user.grant.roleKey]);
    const permissionKeys = collectPermissionsForRoles(roleKeys);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      companyId: user.companyId,
      companyName: user.companyName,
      eventId: user.eventId,
      eventName: user.eventName,
      status: "active",
      loginApp: user.loginApp,
      isSuperAdmin: user.isSuperAdmin,
      roleKeys,
      scopeType: user.grant.scopeType,
      scopeLabel: scopeLabel(user.grant.scopeType, user.companyName, user.eventName),
      grantedBy: user.grant.grantedBy,
      permissionCount: permissionKeys.length,
      lastSeenAt: user.lastSeenAt,
      accessScopes,
    };
  });

  const roleUsage = new Map<RoleKey, number>(
    ROLE_KEYS.map((roleKey) => [roleKey, 0]),
  );

  for (const user of userRows) {
    for (const roleKey of user.roleKeys) {
      roleUsage.set(roleKey, (roleUsage.get(roleKey) ?? 0) + 1);
    }
  }

  const roleRows: BootstrapRoleSummary[] = ROLE_TEMPLATES.map((template) => {
    const resourceMap = groupPermissionsByResource(template.permissions);
    const resourceCounts = Object.entries(resourceMap).reduce<
      Partial<Record<PermissionResource, number>>
    >((accumulator, [resource, permissions]) => {
      if (permissions.length > 0) {
        accumulator[resource as PermissionResource] = permissions.length;
      }

      return accumulator;
    }, {});

    return {
      ...template,
      permissionCount: template.permissions.length,
      userCount: roleUsage.get(template.key) ?? 0,
      resourceCounts,
      topPermissions: template.permissions.slice(0, 6),
    };
  });

  const companyRows: BootstrapCompany[] = COMPANY_SEEDS.map((company) => {
    const users = userRows.filter((user) => user.companyId === company.id);
    const events = EVENT_SEEDS.filter((event) => event.companyId === company.id);
    const roleKeys = sortRoleKeys(
      users.flatMap((user) => user.roleKeys),
    );

    return {
      ...company,
      userCount: users.length,
      activeUserCount: users.filter((user) => user.status === "active").length,
      eventCount: events.length,
      roleKeys,
    };
  });

  const eventRows: BootstrapEvent[] = EVENT_SEEDS.map((event) => {
    const company = companyRows.find((item) => item.id === event.companyId);
    const accessRoleKeys = company?.roleKeys ?? [];

    return {
      ...event,
      accessRoleKeys,
    };
  });

  const permissionGroupRows: BootstrapPermissionGroup[] = Object.entries(
    PERMISSION_GROUPS,
  ).map(([resource, permissions]) => {
    const roleKeys = ROLE_TEMPLATES.filter((template) =>
      template.permissions.some((permissionKey) =>
        permissionKey.startsWith(`${resource}.`),
      ),
    ).map((template) => template.key);

    return {
      resource: resource as PermissionResource,
      permissions,
      roleKeys,
      roleCount: roleKeys.length,
    };
  });

  const principal: RbacPrincipal = {
    userId: 1001,
    authUserId: null,
    displayName: "Platform Admin",
    defaultCompanyId: 101,
    isSuperAdmin: true,
    roleKeys: ["system_admin"],
    permissionKeys: PERMISSION_KEYS,
    accessScopes: [
      {
        ...buildScopeDescriptor("system", { userId: 1001 }),
        membershipStatus: "active",
        roleKey: "system_admin",
      },
    ],
  };

  const payload = createRbacPayload(principal);

  return {
    principal,
    payload,
    companies: companyRows,
    events: eventRows,
    users: userRows,
    roles: roleRows,
    permissionGroups: permissionGroupRows,
    metrics: {
      companyCount: companyRows.length,
      activeCompanyCount: companyRows.filter((company) => company.status === "active").length,
      eventCount: eventRows.length,
      activeEventCount: eventRows.filter((event) =>
        event.status === "active" || event.status === "published",
      ).length,
      userCount: userRows.length,
      activeUserCount: userRows.length,
      roleCount: ROLE_TEMPLATES.length,
      permissionCount: PERMISSION_KEYS.length,
      accessScopeCount: payload.accessibleCompanyIds === null
        ? companyRows.length
        : payload.accessibleCompanyIds.length,
    },
  };
}

export const getRbacBootstrapContext = cache(buildBootstrapContext);

export function getRoleLabel(roleKey: RoleKey): string {
  return getRoleTemplate(roleKey).name;
}

export function getScopeLabel(scopeType: AppScopeType): string {
  if (scopeType === "system") {
    return "System";
  }

  if (scopeType === "company") {
    return "Company";
  }

  if (scopeType === "event") {
    return "Event";
  }

  return "Self";
}

export function getPermissionResourceLabel(resource: string): string {
  return resource
    .split("_")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}
