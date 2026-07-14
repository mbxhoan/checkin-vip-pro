import type {
  AccessScope,
  AppScopeType,
  RbacPrincipal,
  ScopeDescriptor,
} from "./types";

function uniqueNumbers(values: Iterable<number>): number[] {
  return Array.from(new Set(values)).sort((left, right) => left - right);
}

export function normalizeScope(scope: ScopeDescriptor): ScopeDescriptor {
  if (scope.scopeType === "system") {
    return {
      scopeType: "system",
      companyId: null,
      eventId: null,
      userId: scope.userId ?? null,
    };
  }

  if (scope.scopeType === "company") {
    return {
      scopeType: "company",
      companyId: scope.companyId ?? null,
      eventId: null,
      userId: scope.userId ?? null,
    };
  }

  if (scope.scopeType === "event") {
    return {
      scopeType: "event",
      companyId: scope.companyId ?? null,
      eventId: scope.eventId ?? null,
      userId: scope.userId ?? null,
    };
  }

  return {
    scopeType: "self",
    companyId: null,
    eventId: null,
    userId: scope.userId ?? null,
  };
}

export function scopeKey(scope: ScopeDescriptor): string {
  const normalized = normalizeScope(scope);

  switch (normalized.scopeType) {
    case "system":
      return "system";
    case "company":
      return `company:${normalized.companyId ?? "none"}`;
    case "event":
      return `event:${normalized.companyId ?? "none"}:${normalized.eventId ?? "none"}`;
    case "self":
      return `self:${normalized.userId ?? "none"}`;
  }
}

export function scopeMatches(
  grant: AccessScope,
  target: ScopeDescriptor,
  principalUserId: number,
): boolean {
  if (grant.membershipStatus && grant.membershipStatus !== "active") {
    return false;
  }

  const normalizedGrant = normalizeScope(grant);
  const normalizedTarget = normalizeScope(target);

  if (normalizedGrant.scopeType === "system") {
    return true;
  }

  if (normalizedGrant.scopeType === "self") {
    return normalizedTarget.scopeType === "self" || normalizedTarget.userId === principalUserId;
  }

  if (normalizedGrant.scopeType === "company") {
    return (
      (normalizedTarget.scopeType === "company" ||
        normalizedTarget.scopeType === "event") &&
      normalizedGrant.companyId != null &&
      normalizedGrant.companyId === normalizedTarget.companyId
    );
  }

  return (
    normalizedGrant.scopeType === "event" &&
    normalizedTarget.scopeType === "event" &&
    normalizedGrant.companyId != null &&
    normalizedGrant.eventId != null &&
    normalizedGrant.companyId === normalizedTarget.companyId &&
    normalizedGrant.eventId === normalizedTarget.eventId
  );
}

export function collectAccessibleCompanyIds(
  principal: Pick<RbacPrincipal, "isSuperAdmin" | "accessScopes">,
): number[] | null {
  if (principal.isSuperAdmin) {
    return null;
  }

  const companyIds: number[] = [];

  for (const scope of principal.accessScopes) {
    if (scope.membershipStatus && scope.membershipStatus !== "active") {
      continue;
    }

    if (scope.scopeType === "system") {
      return null;
    }

    if (scope.scopeType === "company" && scope.companyId != null) {
      companyIds.push(scope.companyId);
    }

    if (scope.scopeType === "event" && scope.companyId != null) {
      companyIds.push(scope.companyId);
    }
  }

  return uniqueNumbers(companyIds);
}

export function collectAccessibleEventIds(
  principal: Pick<RbacPrincipal, "isSuperAdmin" | "accessScopes">,
  companyId?: number | null,
): number[] | null {
  if (principal.isSuperAdmin) {
    return null;
  }

  const eventIds: number[] = [];

  for (const scope of principal.accessScopes) {
    if (scope.membershipStatus && scope.membershipStatus !== "active") {
      continue;
    }

    if (scope.scopeType === "system") {
      return null;
    }

    if (scope.scopeType === "event" && scope.eventId != null) {
      if (companyId != null && scope.companyId !== companyId) {
        continue;
      }

      eventIds.push(scope.eventId);
    }
  }

  return uniqueNumbers(eventIds);
}

export function canAccessScope(
  principal: Pick<RbacPrincipal, "isSuperAdmin" | "userId" | "accessScopes">,
  target: ScopeDescriptor,
): boolean {
  if (principal.isSuperAdmin) {
    return true;
  }

  return principal.accessScopes.some((grant) => scopeMatches(grant, target, principal.userId));
}

export function buildScopeDescriptor(
  scopeType: AppScopeType,
  options: Partial<Omit<ScopeDescriptor, "scopeType">> = {},
): ScopeDescriptor {
  return normalizeScope({
    scopeType,
    companyId: options.companyId ?? null,
    eventId: options.eventId ?? null,
    userId: options.userId ?? null,
  });
}
