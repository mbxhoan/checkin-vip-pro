import "server-only";

import { cache } from "react";

import { getSupabaseServiceRoleClient } from "@/lib/supabase/service";
import type { PermissionKey, PermissionResource } from "./permissions";
import type { RoleKey } from "./roles";

interface CompanyRecord {
  id: number;
  slug: string;
  name: string;
  legal_name: string | null;
  status: string;
  billing_email: string | null;
  contact_email: string | null;
  contact_phone: string | null;
}

interface SubscriptionRecord {
  company_id: number;
  status: string;
  plan_id: number | null;
  plan: {
    id: number;
    code: string;
    name: string;
    is_active: boolean;
  } | null;
}

interface DomainRecord {
  company_id: number;
  domain: string;
  is_primary: boolean;
  is_active: boolean;
}

interface SubscriptionPlanRecord {
  id: number;
  code: string;
  name: string;
  is_active: boolean;
}

interface UserRecord {
  id: number;
  email: string | null;
  full_name: string | null;
  display_name: string | null;
  status: string;
  login_app: string;
  is_super_admin: boolean;
  default_company_id: number | null;
  last_seen_at: string | null;
  company: { id: number; name: string } | null;
}

interface RoleRecord {
  id: number;
  key: string;
  name: string;
  description: string | null;
  default_scope: string;
  is_system_role: boolean;
  is_active: boolean;
}

interface PermissionRecord {
  id: number;
  key: string;
  resource: string;
  action: string;
}

interface RolePermissionRecord {
  role_id: number;
  permission_id: number;
  permission: PermissionRecord | null;
}

interface AccessScopeRecord {
  user_id: number;
  role_id: number;
  scope_type: string;
  company_id: number | null;
  event_id: number | null;
  membership_status: string;
  role: {
    id: number;
    key: string;
    name: string;
    default_scope: string;
  } | null;
}

interface EventRecord {
  id: number;
  company_id: number;
  name: string;
  status: string;
}

export interface AdminCompanyRow {
  id: number;
  slug: string;
  name: string;
  legalName: string | null;
  status: string;
  billingEmail: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  primaryDomain: string | null;
  domains: readonly {
    domain: string;
    isPrimary: boolean;
    isActive: boolean;
  }[];
  subscriptionStatus: string | null;
  planCode: string | null;
  planName: string | null;
  activeUserCount: number;
  eventCount: number;
  roleKeys: readonly RoleKey[];
}

export interface AdminUserRow {
  id: number;
  email: string;
  fullName: string;
  displayName: string;
  status: string;
  loginApp: string;
  isSuperAdmin: boolean;
  defaultCompanyId: number | null;
  companyName: string | null;
  lastSeenAt: string | null;
  roleKeys: readonly RoleKey[];
  scopeLabels: readonly string[];
  scopeSummaries: readonly {
    roleKey: RoleKey;
    label: string;
    membershipStatus: string;
    scopeType: string;
    companyId: number | null;
    eventId: number | null;
  }[];
  scopeType: string | null;
  eventId: number | null;
  companyId: number | null;
  membershipStatus: string | null;
}

export interface AdminRoleRow {
  id: number;
  key: RoleKey;
  name: string;
  description: string | null;
  defaultScope: string;
  isSystemRole: boolean;
  isActive: boolean;
  userCount: number;
  permissionCount: number;
  resourceCounts: Partial<Record<PermissionResource, number>>;
  permissionKeys: readonly PermissionKey[];
}

export interface AdminPermissionGroup {
  resource: PermissionResource;
  permissionKeys: readonly PermissionKey[];
}

export interface RbacAdminSnapshot {
  companies: readonly AdminCompanyRow[];
  users: readonly AdminUserRow[];
  roles: readonly AdminRoleRow[];
  permissions: readonly PermissionRecord[];
  permissionGroups: readonly AdminPermissionGroup[];
  roleOptions: readonly { key: RoleKey; name: string }[];
  companyOptions: readonly { id: number; name: string }[];
  eventOptions: readonly { id: number; name: string; companyId: number }[];
  subscriptionPlans: readonly { id: number; code: string; name: string }[];
}

function labelFromScope(scope: AccessScopeRecord) {
  if (scope.scope_type === "system") {
    return "System";
  }

  if (scope.scope_type === "company") {
    return `Company ${scope.company_id ?? ""}`.trim();
  }

  if (scope.scope_type === "event") {
    return `Event ${scope.event_id ?? ""}`.trim();
  }

  return `Self ${scope.user_id}`.trim();
}

function labelsFromScopes(scopes: AccessScopeRecord[]) {
  return scopes.map((scope) => labelFromScope(scope));
}

export const getRbacAdminSnapshot = cache(async (): Promise<RbacAdminSnapshot> => {
  const admin = getSupabaseServiceRoleClient();

  const [
    companiesResult,
    subscriptionsResult,
    domainsResult,
    subscriptionPlansResult,
    usersResult,
    rolesResult,
    permissionsResult,
    rolePermissionsResult,
    scopesResult,
    eventsResult,
  ] = await Promise.all([
    admin
      .from("companies")
      .select("id, slug, name, legal_name, status, billing_email, contact_email, contact_phone")
      .order("id"),
    admin
      .from("company_subscriptions")
      .select("company_id, status, plan_id, plan:subscription_plans(id, code, name, is_active)")
      .order("company_id"),
    admin
      .from("company_domains")
      .select("company_id, domain, is_primary, is_active")
      .order("company_id"),
    admin
      .from("subscription_plans")
      .select("id, code, name, is_active")
      .order("code"),
    admin
      .from("users")
      .select("id, email, full_name, display_name, status, login_app, is_super_admin, default_company_id, last_seen_at, company:companies(id, name)")
      .order("id"),
    admin
      .from("roles")
      .select("id, key, name, description, default_scope, is_system_role, is_active")
      .order("id"),
    admin
      .from("permissions")
      .select("id, key, resource, action")
      .order("resource"),
    admin
      .from("role_permissions")
      .select("role_id, permission_id, permission:permissions(id, key, resource, action)"),
    admin
      .from("user_access_scopes")
      .select("user_id, role_id, scope_type, company_id, event_id, membership_status, role:roles(id, key, name, default_scope)")
      .order("created_at"),
    admin
      .from("events")
      .select("id, company_id, name, status")
      .order("id"),
  ]);

  const companies = (companiesResult.data ?? []) as unknown as CompanyRecord[];
  const subscriptions = (subscriptionsResult.data ?? []) as unknown as SubscriptionRecord[];
  const domains = (domainsResult.data ?? []) as unknown as DomainRecord[];
  const subscriptionPlans = (subscriptionPlansResult.data ?? []) as unknown as SubscriptionPlanRecord[];
  const users = (usersResult.data ?? []) as unknown as UserRecord[];
  const roles = (rolesResult.data ?? []) as unknown as RoleRecord[];
  const permissions = (permissionsResult.data ?? []) as unknown as PermissionRecord[];
  const rolePermissions = (rolePermissionsResult.data ?? []) as unknown as RolePermissionRecord[];
  const scopes = (scopesResult.data ?? []) as unknown as AccessScopeRecord[];
  const events = (eventsResult.data ?? []) as unknown as EventRecord[];

  const subscriptionByCompanyId = new Map(
    subscriptions.map((record) => [record.company_id, record]),
  );
  const domainsByCompanyId = new Map<number, DomainRecord[]>();

  for (const domain of domains) {
    const current = domainsByCompanyId.get(domain.company_id) ?? [];
    current.push(domain);
    domainsByCompanyId.set(domain.company_id, current);
  }

  const scopesByUserId = new Map<number, AccessScopeRecord[]>();
  const scopesByRoleId = new Map<number, AccessScopeRecord[]>();

  for (const scope of scopes) {
    const byUser = scopesByUserId.get(scope.user_id) ?? [];
    byUser.push(scope);
    scopesByUserId.set(scope.user_id, byUser);

    const byRole = scopesByRoleId.get(scope.role_id) ?? [];
    byRole.push(scope);
    scopesByRoleId.set(scope.role_id, byRole);
  }

  const companyRows: AdminCompanyRow[] = companies.map((company) => {
    const subscription = subscriptionByCompanyId.get(company.id);
    const companyDomains = domainsByCompanyId.get(company.id) ?? [];
    const companyUsers = users.filter((user) => user.default_company_id === company.id);
    const companyEvents = events.filter((event) => event.company_id === company.id);
    const companyScopes = scopes.filter((scope) => scope.company_id === company.id);
    const roleKeys = Array.from(
      new Set(
        companyScopes
          .map((scope) => scope.role?.key)
          .filter(Boolean) as RoleKey[],
      ),
    ).sort();

    return {
      id: company.id,
      slug: company.slug,
      name: company.name,
      legalName: company.legal_name,
      status: company.status,
      billingEmail: company.billing_email,
      contactEmail: company.contact_email,
      contactPhone: company.contact_phone,
      primaryDomain: companyDomains.find((domain) => domain.is_primary)?.domain ?? companyDomains[0]?.domain ?? null,
      domains: companyDomains.map((domain) => ({
        domain: domain.domain,
        isPrimary: domain.is_primary,
        isActive: domain.is_active,
      })),
      subscriptionStatus: subscription?.status ?? null,
      planCode: subscription?.plan?.code ?? null,
      planName: subscription?.plan?.name ?? null,
      activeUserCount: companyUsers.filter((user) => user.status === "active").length,
      eventCount: companyEvents.length,
      roleKeys,
    };
  });

  const rolePermissionByRoleId = new Map<number, RolePermissionRecord[]>();
  for (const rolePermission of rolePermissions) {
    const current = rolePermissionByRoleId.get(rolePermission.role_id) ?? [];
    current.push(rolePermission);
    rolePermissionByRoleId.set(rolePermission.role_id, current);
  }

  const roleRows: AdminRoleRow[] = roles.map((role) => {
    const scopeRows = scopesByRoleId.get(role.id) ?? [];
    const permissionRows = rolePermissionByRoleId.get(role.id) ?? [];
    const permissionKeys = permissionRows
      .map((rolePermission) => rolePermission.permission?.key as PermissionKey | undefined)
      .filter(Boolean) as PermissionKey[];
    const resourceCounts = permissionRows.reduce<Partial<Record<PermissionResource, number>>>(
      (accumulator, rolePermission) => {
        const resource = rolePermission.permission?.resource as PermissionResource | undefined;
        if (!resource) {
          return accumulator;
        }

        accumulator[resource] = (accumulator[resource] ?? 0) + 1;
        return accumulator;
      },
      {},
    );

    return {
      id: role.id,
      key: role.key as RoleKey,
      name: role.name,
      description: role.description,
      defaultScope: role.default_scope,
      isSystemRole: role.is_system_role,
      isActive: role.is_active,
      userCount: new Set(scopeRows.map((scope) => scope.user_id)).size,
      permissionCount: permissionKeys.length,
      resourceCounts,
      permissionKeys,
    };
  });

  const userRows: AdminUserRow[] = users.map((user) => {
    const userScopes = scopesByUserId.get(user.id) ?? [];
    const roleKeys = Array.from(
      new Set(
        userScopes.map((scope) => scope.role?.key).filter(Boolean) as RoleKey[],
      ),
    ).sort();
    const scopeSummaries = userScopes.map((scope) => ({
      roleKey: scope.role?.key as RoleKey,
      label: labelFromScope(scope),
      membershipStatus: scope.membership_status,
      scopeType: scope.scope_type,
      companyId: scope.company_id,
      eventId: scope.event_id,
    }));

    return {
      id: user.id,
      email: user.email ?? "",
      fullName: user.full_name ?? "",
      displayName: user.display_name ?? user.full_name ?? user.email ?? "",
      status: user.status,
      loginApp: user.login_app,
      isSuperAdmin: user.is_super_admin,
      defaultCompanyId: user.default_company_id,
      companyName: user.company?.name ?? null,
      lastSeenAt: user.last_seen_at,
      roleKeys,
      scopeLabels: labelsFromScopes(userScopes),
      scopeSummaries,
      scopeType: userScopes[0]?.scope_type ?? null,
      eventId: userScopes[0]?.event_id ?? null,
      companyId: userScopes[0]?.company_id ?? null,
      membershipStatus: userScopes[0]?.membership_status ?? null,
    };
  });

  const permissionGroups = Object.entries(
    permissions.reduce<Record<PermissionResource, PermissionKey[]>>((accumulator, permission) => {
      const resource = permission.resource as PermissionResource;
      accumulator[resource] = accumulator[resource] ?? [];
      accumulator[resource].push(permission.key as PermissionKey);
      return accumulator;
    }, {} as Record<PermissionResource, PermissionKey[]>),
  )
    .map(([resource, permissionKeys]) => ({
      resource: resource as PermissionResource,
      permissionKeys,
    }))
    .sort((left, right) => left.resource.localeCompare(right.resource));

  return {
    companies: companyRows,
    users: userRows,
    roles: roleRows,
    permissions,
    permissionGroups,
    roleOptions: roles.map((role) => ({ key: role.key as RoleKey, name: role.name })),
    companyOptions: companies.map((company) => ({ id: company.id, name: company.name })),
    eventOptions: events.map((event) => ({
      id: event.id,
      name: event.name,
      companyId: event.company_id,
    })),
    subscriptionPlans: subscriptionPlans.filter((plan) => plan.is_active).map((plan) => ({
      id: plan.id,
      code: plan.code,
      name: plan.name,
    })),
  };
});
