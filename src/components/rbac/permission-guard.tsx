"use client";

import { useAuthSession } from "@/components/Auth/session-provider";
import { authorize } from "@/lib/rbac/authorize";
import type { PermissionKey } from "@/lib/rbac/permissions";
import type { ScopeDescriptor } from "@/lib/rbac/types";
import type { ReactNode } from "react";

interface PermissionGateProps {
  permissionKey: PermissionKey;
  scope?: ScopeDescriptor;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGate({
  permissionKey,
  scope,
  children,
  fallback = null,
}: PermissionGateProps) {
  const { session } = useAuthSession();

  if (!session) {
    return fallback;
  }

  const decision = authorize(session.principal, permissionKey, scope);

  return decision.allowed ? children : fallback;
}
