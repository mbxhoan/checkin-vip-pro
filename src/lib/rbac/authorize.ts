import {
  groupPermissionsByResource,
  type PermissionKey,
} from "./permissions";
import type {
  AuthorizationDecision,
  RbacPayload,
  RbacPrincipal,
  ScopeDescriptor,
} from "./types";
import {
  canAccessScope,
  collectAccessibleCompanyIds,
  collectAccessibleEventIds,
} from "./scope";

export function hasPermission(
  principal: RbacPrincipal,
  permissionKey: PermissionKey,
): boolean {
  return principal.isSuperAdmin || principal.permissionKeys.includes(permissionKey);
}

export function authorize(
  principal: RbacPrincipal | null | undefined,
  permissionKey: PermissionKey,
  scope?: ScopeDescriptor,
): AuthorizationDecision {
  if (!principal) {
    return {
      allowed: false,
      reason: "unknown_principal",
      permissionKey,
      scope,
    };
  }

  if (principal.isSuperAdmin) {
    return {
      allowed: true,
      reason: "super_admin",
      permissionKey,
      scope,
    };
  }

  if (!principal.permissionKeys.includes(permissionKey)) {
    return {
      allowed: false,
      reason: "missing_permission",
      permissionKey,
      scope,
    };
  }

  if (!scope) {
    return {
      allowed: true,
      reason: "granted",
      permissionKey,
    };
  }

  const scopeAllowed = canAccessScope(principal, scope);

  return {
    allowed: scopeAllowed,
    reason: scopeAllowed ? "granted" : "scope_mismatch",
    permissionKey,
    scope,
  };
}

export function hasAnyPermission(
  principal: RbacPrincipal,
  permissionKeys: readonly PermissionKey[],
): boolean {
  return permissionKeys.some((permissionKey) => hasPermission(principal, permissionKey));
}

export function hasAllPermissions(
  principal: RbacPrincipal,
  permissionKeys: readonly PermissionKey[],
): boolean {
  return permissionKeys.every((permissionKey) => hasPermission(principal, permissionKey));
}

export function createRbacPayload(principal: RbacPrincipal): RbacPayload {
  return {
    userId: principal.userId,
    authUserId: principal.authUserId ?? null,
    displayName: principal.displayName ?? null,
    defaultCompanyId: principal.defaultCompanyId ?? null,
    isSuperAdmin: principal.isSuperAdmin,
    roleKeys: principal.roleKeys,
    permissionKeys: principal.permissionKeys,
    accessScopes: principal.accessScopes,
    permissionsByResource: groupPermissionsByResource(
      principal.permissionKeys as readonly PermissionKey[],
    ),
    accessibleCompanyIds: collectAccessibleCompanyIds(principal),
    accessibleEventIds: collectAccessibleEventIds(principal),
  };
}

export function canAccessPrincipalScope(
  principal: RbacPrincipal,
  scope: ScopeDescriptor,
): boolean {
  return canAccessScope(principal, scope);
}

export function canAccessCompany(
  principal: RbacPrincipal,
  companyId: number,
): boolean {
  return canAccessScope(principal, {
    scopeType: "company",
    companyId,
  });
}

export function canAccessEvent(
  principal: RbacPrincipal,
  companyId: number,
  eventId: number,
): boolean {
  return canAccessScope(principal, {
    scopeType: "event",
    companyId,
    eventId,
  });
}

export function isSelfScope(
  principal: RbacPrincipal,
  userId: number,
): boolean {
  return canAccessScope(principal, {
    scopeType: "self",
    userId,
  });
}
