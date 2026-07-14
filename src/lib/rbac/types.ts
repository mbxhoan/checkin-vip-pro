export type AppScopeType = "system" | "company" | "event" | "self";

export type MembershipStatus = "invited" | "active" | "suspended" | "revoked";

export interface ScopeDescriptor {
  scopeType: AppScopeType;
  companyId?: number | null;
  eventId?: number | null;
  userId?: number | null;
}

export interface AccessScope extends ScopeDescriptor {
  membershipStatus?: MembershipStatus;
  roleKey?: string | null;
}

export interface RbacPrincipal {
  userId: number;
  authUserId?: string | null;
  displayName?: string | null;
  defaultCompanyId?: number | null;
  isSuperAdmin: boolean;
  roleKeys: readonly string[];
  permissionKeys: readonly string[];
  accessScopes: readonly AccessScope[];
}

export type AuthorizationReason =
  | "granted"
  | "super_admin"
  | "missing_permission"
  | "scope_mismatch"
  | "inactive_membership"
  | "unknown_principal";

export interface AuthorizationDecision {
  allowed: boolean;
  reason: AuthorizationReason;
  permissionKey: string;
  scope?: ScopeDescriptor;
}

export interface RbacPayload {
  userId: number;
  authUserId: string | null;
  displayName: string | null;
  defaultCompanyId: number | null;
  isSuperAdmin: boolean;
  roleKeys: readonly string[];
  permissionKeys: readonly string[];
  accessScopes: readonly AccessScope[];
  permissionsByResource: Record<string, readonly string[]>;
  accessibleCompanyIds: readonly number[] | null;
  accessibleEventIds: readonly number[] | null;
}
