import "server-only";

import type { User } from "@supabase/supabase-js";
import { cache } from "react";

import { createRbacPayload } from "@/lib/rbac/authorize";
import type { AccessScope, RbacPrincipal } from "@/lib/rbac/types";
import { getSupabaseServiceRoleClient } from "@/lib/supabase/service";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AuthSessionBootstrap, AuthUserProfile } from "./types";

type UserRow = {
  id: number;
  auth_user_id: string | null;
  email: string | null;
  full_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
  default_company_id: number | null;
  is_super_admin: boolean;
  last_seen_at: string | null;
};

type RbacContextRow = {
  userId: number;
  authUserId: string | null;
  displayName: string | null;
  defaultCompanyId: number | null;
  isSuperAdmin: boolean;
  roleKeys: string[];
  permissionKeys: string[];
  accessScopes: Array<{
    scopeType: AccessScope["scopeType"];
    companyId: number | null;
    eventId: number | null;
    userId: number | null;
    membershipStatus?: AccessScope["membershipStatus"];
    roleKey?: string | null;
  }>;
  accessibleCompanyIds: number[] | null;
  accessibleEventIds: number[] | null;
};

function deriveDisplayName(user: User) {
  return (
    user.user_metadata?.display_name ??
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.email?.split("@")[0] ??
    "Giltech User"
  );
}

function buildScopeLabels(accessScopes: RbacContextRow["accessScopes"]) {
  return accessScopes.map((scope) => {
    if (scope.scopeType === "system") {
      return "System";
    }

    if (scope.scopeType === "company") {
      return `Company ${scope.companyId ?? ""}`.trim();
    }

    if (scope.scopeType === "event") {
      return `Event ${scope.eventId ?? ""}`.trim();
    }

    return `Self ${scope.userId ?? ""}`.trim();
  });
}

async function resolveProfileFromAuthUser(authUser: User) {
  const admin = getSupabaseServiceRoleClient();

  const { data: directProfile } = await admin
    .from("users")
    .select(
      "id, auth_user_id, email, full_name, display_name, avatar_url, default_company_id, is_super_admin, last_seen_at",
    )
    .eq("auth_user_id", authUser.id)
    .maybeSingle<UserRow>();

  if (directProfile) {
    return directProfile;
  }

  if (authUser.email) {
    const { data: profileByEmail } = await admin
      .from("users")
      .select(
        "id, auth_user_id, email, full_name, display_name, avatar_url, default_company_id, is_super_admin, last_seen_at",
      )
      .ilike("email", authUser.email)
      .maybeSingle<UserRow>();

    if (profileByEmail) {
      if (!profileByEmail.auth_user_id) {
        const { data: attachedProfile } = await admin
          .from("users")
          .update({
            auth_user_id: authUser.id,
            display_name:
              profileByEmail.display_name ?? deriveDisplayName(authUser),
            full_name: profileByEmail.full_name ?? deriveDisplayName(authUser),
            avatar_url:
              profileByEmail.avatar_url ??
              authUser.user_metadata?.avatar_url ??
              null,
            last_seen_at: new Date().toISOString(),
          })
          .eq("id", profileByEmail.id)
          .select(
            "id, auth_user_id, email, full_name, display_name, avatar_url, default_company_id, is_super_admin, last_seen_at",
          )
          .single<UserRow>();

        if (attachedProfile) {
          return attachedProfile;
        }
      }

      return profileByEmail;
    }
  }

  const { data: company } = authUser.email
    ? await admin
        .from("companies")
        .select("id, name")
        .ilike("billing_email", `%${authUser.email}%`)
        .maybeSingle<{ id: number; name: string }>()
    : { data: null };

  const { data: createdProfile } = await admin
    .from("users")
    .insert({
      auth_user_id: authUser.id,
      email: authUser.email,
      full_name: deriveDisplayName(authUser),
      display_name: deriveDisplayName(authUser),
      avatar_url: authUser.user_metadata?.avatar_url ?? null,
      status: "active",
      login_app: "web",
      is_super_admin: false,
      default_company_id: company?.id ?? null,
      locale: "vi",
      preferences: { seed: false, source: "auth-bootstrap" },
      metadata: {
        source: "auth-bootstrap",
        auth_provider: authUser.app_metadata?.provider ?? null,
      },
    })
    .select(
      "id, auth_user_id, email, full_name, display_name, avatar_url, default_company_id, is_super_admin, last_seen_at",
    )
    .single<UserRow>();

  if (!createdProfile) {
    throw new Error("Unable to bootstrap public.users profile from auth user");
  }

  return createdProfile;
}

async function resolveCompanyName(defaultCompanyId: number | null) {
  if (defaultCompanyId == null) {
    return null;
  }

  const admin = getSupabaseServiceRoleClient();
  const { data } = await admin
    .from("companies")
    .select("id, name")
    .eq("id", defaultCompanyId)
    .maybeSingle<{ id: number; name: string }>();

  return data?.name ?? null;
}

export const getAuthSessionBootstrap = cache(async (): Promise<AuthSessionBootstrap | null> => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const authUser = data.user;

  if (!authUser) {
    return null;
  }

  const profile = await resolveProfileFromAuthUser(authUser);
  const admin = getSupabaseServiceRoleClient();
  const { data: rbacContextRaw } = await admin.rpc("get_user_rbac_context", {
    p_user_id: profile.id,
  });

  const rbacContext = rbacContextRaw as unknown as RbacContextRow | null;
  if (!rbacContext) {
    return null;
  }

  const defaultCompanyName = await resolveCompanyName(profile.default_company_id);
  const roleKeys = Array.from(new Set(rbacContext.roleKeys)).sort();
  const accessScopes = rbacContext.accessScopes.map((scope) => ({
    scopeType: scope.scopeType,
    companyId: scope.companyId ?? null,
    eventId: scope.eventId ?? null,
    userId: scope.userId ?? null,
    membershipStatus: scope.membershipStatus ?? "active",
    roleKey: scope.roleKey ?? null,
  }));

  const principal: RbacPrincipal = {
    userId: profile.id,
    authUserId: profile.auth_user_id,
    displayName: profile.display_name ?? profile.full_name,
    defaultCompanyId: profile.default_company_id,
    isSuperAdmin: profile.is_super_admin,
    roleKeys,
    permissionKeys: rbacContext.permissionKeys,
    accessScopes,
  };

  return {
    authUser: {
      id: authUser.id,
      email: authUser.email ?? "",
      name: deriveDisplayName(authUser),
      avatarUrl: authUser.user_metadata?.avatar_url ?? null,
    },
    profile: {
      id: profile.id,
      authUserId: profile.auth_user_id ?? authUser.id,
      email: profile.email ?? authUser.email ?? "",
      fullName: profile.full_name ?? deriveDisplayName(authUser),
      displayName: profile.display_name ?? deriveDisplayName(authUser),
      avatarUrl: profile.avatar_url ?? authUser.user_metadata?.avatar_url ?? null,
      defaultCompanyId: profile.default_company_id,
      defaultCompanyName,
      isSuperAdmin: profile.is_super_admin,
      lastSeenAt: profile.last_seen_at,
      roleKeys,
      scopeLabels: buildScopeLabels(accessScopes),
    },
    principal,
    rbac: createRbacPayload(principal),
  };
});
