import type { RbacPayload, RbacPrincipal } from "@/lib/rbac/types";

export interface AuthUserProfile {
  id: number;
  authUserId: string;
  email: string;
  fullName: string;
  displayName: string;
  avatarUrl: string | null;
  defaultCompanyId: number | null;
  defaultCompanyName: string | null;
  isSuperAdmin: boolean;
  lastSeenAt: string | null;
  roleKeys: readonly string[];
  scopeLabels: readonly string[];
}

export interface AuthSessionBootstrap {
  authUser: {
    id: string;
    email: string;
    name: string;
    avatarUrl: string | null;
  };
  profile: AuthUserProfile;
  principal: RbacPrincipal;
  rbac: RbacPayload;
}
