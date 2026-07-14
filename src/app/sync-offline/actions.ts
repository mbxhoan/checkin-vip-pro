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

async function resolveBatchScope(batchId: number) {
  const admin = getSupabaseServiceRoleClient();
  const { data: batch, error } = await admin
    .from("scan_offline_batches")
    .select("id, event_id, scanner_device_id")
    .eq("id", batchId)
    .maybeSingle<{ id: number; event_id: number; scanner_device_id: number | null }>();

  if (error) {
    throw error;
  }

  if (!batch) {
    throw new Error("Không tìm thấy offline batch.");
  }

  const { data: event, error: eventError } = await admin
    .from("events")
    .select("id, company_id")
    .eq("id", batch.event_id)
    .maybeSingle<{ id: number; company_id: number }>();

  if (eventError) {
    throw eventError;
  }

  if (!event) {
    throw new Error("Không tìm thấy event của batch.");
  }

  return { batch, event };
}

export async function completeOfflineBatchAction(formData: FormData) {
  const batchId = parseNumber(formData.get("batch_id"));
  if (!batchId) {
    throw new Error("Thiếu batch_id.");
  }

  const { batch, event } = await resolveBatchScope(batchId);
  const session = await requireSessionWithPermission("checkin.run", {
    scopeType: "event",
    companyId: event.company_id,
    eventId: event.id,
  });

  const admin = getSupabaseServiceRoleClient();
  const now = new Date().toISOString();

  await admin
    .from("scan_offline_batches")
    .update({
      status: "completed",
      synced_at: now,
      error_message: null,
    })
    .eq("id", batch.id);

  if (batch.scanner_device_id) {
    await admin
      .from("scanner_devices")
      .update({
        last_seen_at: now,
        last_sync_at: now,
        status: "active",
      })
      .eq("id", batch.scanner_device_id);
  }

  await admin.from("background_jobs").insert({
    company_id: event.company_id,
    event_id: event.id,
    actor_user_id: session.profile.id,
    kind: "other",
    status: "completed",
    idempotency_key: `offline-sync-${batch.id}-${Date.now()}`,
    payload: {
      source: "sync-offline",
      batch_id: batch.id,
    },
    result_payload: {
      batch_id: batch.id,
      synced_at: now,
    },
    attempts: 1,
    max_attempts: 3,
    scheduled_at: now,
    started_at: now,
    finished_at: now,
    metadata: {
      source: "sync-offline",
      requested_via: "completeOfflineBatchAction",
    },
  });

  revalidatePath("/sync-offline");
  revalidatePath("/checkin");
  revalidatePath("/audience");
  redirect("/sync-offline?synced=1");
}
