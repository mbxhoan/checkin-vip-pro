"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getAuthSessionBootstrap } from "@/lib/auth/bootstrap";
import { authorize } from "@/lib/rbac/authorize";
import type { PermissionKey } from "@/lib/rbac/permissions";
import type { AppScopeType } from "@/lib/rbac/types";
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

async function requireSessionWithPermission(
  permissionKey: PermissionKey,
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

  const decision = authorize(session.principal, permissionKey, scope);
  if (!decision.allowed) {
    throw new Error("Bạn không có quyền thực hiện thao tác này.");
  }

  return session;
}

async function resolveEventScope(eventId: number) {
  const admin = getSupabaseServiceRoleClient();
  const { data: event, error } = await admin
    .from("events")
    .select("id, company_id")
    .eq("id", eventId)
    .maybeSingle<{ id: number; company_id: number }>();

  if (error) {
    throw error;
  }

  if (!event) {
    throw new Error("Không tìm thấy event.");
  }

  return event;
}

async function resolveClientById(clientId: number) {
  const admin = getSupabaseServiceRoleClient();
  const { data: client, error } = await admin
    .from("clients")
    .select("id, event_id, full_name, registration_code")
    .eq("id", clientId)
    .maybeSingle<{ id: number; event_id: number; full_name: string; registration_code: string | null }>();

  if (error) {
    throw error;
  }

  return client;
}

export async function recordCheckinAction(formData: FormData) {
  const eventId = parseNumber(formData.get("event_id"));
  const companyId = parseNumber(formData.get("company_id"));
  const clientId = parseNumber(formData.get("client_id"));
  const scannerDeviceId = parseNumber(formData.get("scanner_device_id"));
  const registrationCode = parseString(formData.get("registration_code"));
  const note = parseString(formData.get("note"));
  const method = parseString(formData.get("method")) || "qr";

  if (!eventId) {
    throw new Error("Thiếu event_id.");
  }

  const eventScope = await resolveEventScope(eventId);
  await requireSessionWithPermission("checkin.run", {
    scopeType: "event",
    companyId: companyId ?? eventScope.company_id,
    eventId: eventScope.id,
  });

  const admin = getSupabaseServiceRoleClient();
  const session = await getAuthSessionBootstrap();
  if (!session) {
    throw new Error("Bạn cần đăng nhập để thực hiện thao tác này.");
  }

  let resolvedClient = clientId ? await resolveClientById(clientId) : null;

  if (!resolvedClient && registrationCode) {
    const { data: client, error } = await admin
      .from("clients")
      .select("id, event_id, full_name, registration_code")
      .eq("event_id", eventScope.id)
      .eq("registration_code", registrationCode)
      .maybeSingle<{ id: number; event_id: number; full_name: string; registration_code: string | null }>();

    if (error) {
      throw error;
    }

    resolvedClient = client;
  }

  if (!resolvedClient) {
    throw new Error("Không tìm thấy client để check-in.");
  }

  if (resolvedClient.event_id !== eventScope.id) {
    throw new Error("Client không thuộc event hiện tại.");
  }

  const now = new Date().toISOString();

  await admin.from("checkins").insert({
    event_id: eventScope.id,
    client_id: resolvedClient.id,
    scanner_device_id: scannerDeviceId ?? null,
    checked_by_user_id: session.profile.id,
    source_batch_id: null,
    event_area_id: null,
    status: "checked_in",
    method,
    happened_at: now,
    note: note || null,
    payload: {
      source: "checkin-runtime",
      registration_code: resolvedClient.registration_code ?? registrationCode ?? null,
    },
    metadata: {
      source: "checkin-runtime",
      actor_user_id: session.profile.id,
    },
  });

  await admin
    .from("clients")
    .update({
      status: "checked_in",
      checked_in_at: now,
    })
    .eq("id", resolvedClient.id);

  if (scannerDeviceId) {
    await admin
      .from("scanner_devices")
      .update({
        last_seen_at: now,
        last_sync_at: now,
      })
      .eq("id", scannerDeviceId);
  }

  revalidatePath("/checkin");
  revalidatePath("/audience");
  revalidatePath("/workspace/clients");
  revalidatePath("/sync-offline");
  redirect("/checkin?checked_in=1");
}
