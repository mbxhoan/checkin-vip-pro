"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { authorize } from "@/lib/rbac/authorize";
import type { PermissionKey } from "@/lib/rbac/permissions";
import type { AppScopeType } from "@/lib/rbac/types";
import { getAuthSessionBootstrap } from "@/lib/auth/bootstrap";
import { PERMISSION_SET } from "@/lib/rbac/permissions";
import { getSupabaseServiceRoleClient } from "@/lib/supabase/service";

function parseNumber(value: FormDataEntryValue | null) {
  if (value == null || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function parseString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function getFormValues(formData: FormData, key: string) {
  return formData.getAll(key).flatMap((value) =>
    typeof value === "string" ? [value] : [],
  );
}

async function requireSessionWithPermission(
  permissionKey: string,
  scope?: {
    scopeType: AppScopeType;
    companyId?: number | null;
    eventId?: number | null;
  },
) {
  const session = await getAuthSessionBootstrap();
  if (!session) {
    throw new Error("Bạn cần đăng nhập để thực hiện thao tác này.");
  }

  const decision = authorize(session.principal, permissionKey as PermissionKey, scope);
  if (!decision.allowed) {
    throw new Error("Bạn không có quyền thực hiện thao tác này.");
  }

  return session;
}

export async function updateCompanyAction(formData: FormData) {
  const companyId = parseNumber(formData.get("company_id"));
  if (companyId == null) {
    throw new Error("Thiếu company_id.");
  }

  await requireSessionWithPermission("company.manage_settings", {
    scopeType: "company",
    companyId,
  });

  const name = parseString(formData.get("name"));
  const legalName = parseString(formData.get("legal_name"));
  const status = parseString(formData.get("status"));
  const billingEmail = parseString(formData.get("billing_email"));
  const contactEmail = parseString(formData.get("contact_email"));
  const contactPhone = parseString(formData.get("contact_phone"));
  const primaryDomain = parseString(formData.get("primary_domain"));
  const subscriptionStatus = parseString(formData.get("subscription_status"));
  const planCode = parseString(formData.get("plan_code"));

  const admin = getSupabaseServiceRoleClient();

  await admin
    .from("companies")
    .update({
      name,
      legal_name: legalName || null,
      status,
      billing_email: billingEmail || null,
      contact_email: contactEmail || null,
      contact_phone: contactPhone || null,
    })
    .eq("id", companyId);

  if (primaryDomain) {
    const { data: existingDomain } = await admin
      .from("company_domains")
      .select("id")
      .eq("company_id", companyId)
      .eq("is_primary", true)
      .maybeSingle<{ id: number }>();

    if (existingDomain) {
      await admin
        .from("company_domains")
        .update({
          domain: primaryDomain,
          is_active: true,
          is_primary: true,
        })
        .eq("id", existingDomain.id);
    } else {
      await admin.from("company_domains").insert({
        company_id: companyId,
        domain: primaryDomain,
        is_primary: true,
        is_active: true,
        metadata: { source: "rbac-admin" },
      });
    }
  }

  if (planCode || subscriptionStatus) {
    const { data: plan } = planCode
      ? await admin
          .from("subscription_plans")
          .select("id")
          .eq("code", planCode)
          .maybeSingle<{ id: number }>()
      : { data: null };

    const { data: subscription } = await admin
      .from("company_subscriptions")
      .select("id")
      .eq("company_id", companyId)
      .maybeSingle<{ id: number }>();

    if (subscription) {
      await admin
        .from("company_subscriptions")
        .update({
          plan_id: plan?.id ?? undefined,
          status: subscriptionStatus || undefined,
        })
        .eq("id", subscription.id);
    }
  }

  revalidatePath("/rbac");
  revalidatePath("/rbac/companies");
  redirect("/rbac/companies?updated=1");
}

export async function assignUserRoleAction(formData: FormData) {
  const userId = parseNumber(formData.get("user_id"));
  const companyId = parseNumber(formData.get("company_id"));
  const eventId = parseNumber(formData.get("event_id"));
  const roleKey = parseString(formData.get("role_key"));
  const scopeType = parseString(formData.get("scope_type")) as AppScopeType;
  const membershipStatus = parseString(formData.get("membership_status"));
  const defaultCompanyId = parseNumber(formData.get("default_company_id"));

  if (!userId || !roleKey || !scopeType) {
    throw new Error("Thiếu dữ liệu gán role cho user.");
  }

  const scopeCompanyId = scopeType === "system" || scopeType === "self" ? null : companyId;
  const scopeEventId = scopeType === "event" ? eventId : null;

  if (scopeType === "company" && scopeCompanyId == null) {
    throw new Error("Thiếu company_id cho scope company.");
  }

  if (scopeType === "event" && (scopeCompanyId == null || scopeEventId == null)) {
    throw new Error("Thiếu company_id hoặc event_id cho scope event.");
  }

  const session = await requireSessionWithPermission("user.assign_role", {
    scopeType,
    companyId: scopeCompanyId ?? undefined,
    eventId: scopeEventId ?? undefined,
  });

  const admin = getSupabaseServiceRoleClient();
  const { data: role } = await admin
    .from("roles")
    .select("id")
    .eq("key", roleKey)
    .maybeSingle<{ id: number }>();

  if (!role) {
    throw new Error("Không tìm thấy role.");
  }

  const { data: matchingScopes } = await admin
    .from("user_access_scopes")
    .select("id, company_id, event_id")
    .eq("user_id", userId)
    .eq("role_id", role.id)
    .eq("scope_type", scopeType)
    .order("id");

  const existingScope = (matchingScopes ?? []).find((scope) => {
    return (scope.company_id ?? null) === scopeCompanyId && (scope.event_id ?? null) === scopeEventId;
  });

  if (existingScope) {
    await admin
      .from("user_access_scopes")
      .update({
        membership_status: membershipStatus || "active",
        granted_by_user_id: session.profile.id,
      })
      .eq("id", existingScope.id);
  } else {
    await admin.from("user_access_scopes").insert({
      user_id: userId,
      role_id: role.id,
      scope_type: scopeType,
      company_id: scopeCompanyId,
      event_id: scopeEventId,
      membership_status: membershipStatus || "active",
      granted_by_user_id: session.profile.id,
      metadata: { source: "rbac-admin" },
    });
  }

  if (defaultCompanyId) {
    await admin.from("users").update({ default_company_id: defaultCompanyId }).eq("id", userId);
  }

  revalidatePath("/rbac");
  revalidatePath("/rbac/users");
  redirect("/rbac/users?updated=1");
}

export async function updateRoleAction(formData: FormData) {
  const roleKey = parseString(formData.get("role_key"));
  const name = parseString(formData.get("name"));
  const description = parseString(formData.get("description"));
  const defaultScope = parseString(formData.get("default_scope")) as AppScopeType;
  const isActive = formData.get("is_active") === "on";
  const permissionKeys = getFormValues(formData, "permission_keys").filter((permissionKey) =>
    PERMISSION_SET.has(permissionKey as PermissionKey),
  );

  if (!roleKey) {
    throw new Error("Thiếu role_key.");
  }

  await requireSessionWithPermission("role.manage");

  const admin = getSupabaseServiceRoleClient();
  const { data: role } = await admin
    .from("roles")
    .select("id")
    .eq("key", roleKey)
    .maybeSingle<{ id: number }>();

  if (!role) {
    throw new Error("Không tìm thấy role.");
  }

  await admin
    .from("roles")
    .update({
      name,
      description: description || null,
      default_scope: defaultScope,
      is_active: isActive,
    })
    .eq("id", role.id);

  await admin.from("role_permissions").delete().eq("role_id", role.id);

  if (permissionKeys.length > 0) {
    const { data: permissions } = await admin
      .from("permissions")
      .select("id, key")
      .in("key", permissionKeys)
      .order("id");

    if ((permissions ?? []).length > 0) {
      await admin.from("role_permissions").insert(
        (permissions as Array<{ id: number; key: string }>).map((permission) => ({
          role_id: role.id,
          permission_id: permission.id,
        })),
      );
    }
  }

  revalidatePath("/rbac");
  revalidatePath("/rbac/roles");
  redirect("/rbac/roles?updated=1");
}
