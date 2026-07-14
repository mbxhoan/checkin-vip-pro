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

export async function saveClientAction(formData: FormData) {
  const clientId = parseNumber(formData.get("client_id"));
  const eventId = parseNumber(formData.get("event_id"));
  const fullName = parseString(formData.get("full_name"));
  const registrationCode = parseString(formData.get("registration_code"));
  const email = parseString(formData.get("email"));
  const phone = parseString(formData.get("phone"));
  const attendeeCompanyName = parseString(formData.get("company_name"));
  const ticketType = parseString(formData.get("ticket_type"));
  const source = parseString(formData.get("source")) || "manual";
  const status = parseString(formData.get("status")) || "pending";
  const internalNotes = parseString(formData.get("internal_notes"));

  if (!eventId) {
    throw new Error("Thiếu event_id.");
  }

  if (!fullName) {
    throw new Error("Thiếu full_name.");
  }

  const eventScope = await resolveEventScope(eventId);
  const permissionKey = clientId ? "client.update" : "client.create";
  await requireSessionWithPermission(permissionKey, {
    scopeType: "event",
    companyId: eventScope.company_id,
    eventId: eventScope.id,
  });

  const admin = getSupabaseServiceRoleClient();
  const now = new Date().toISOString();

  if (clientId) {
    const { data: existingClient, error: clientError } = await admin
      .from("clients")
      .select("id, event_id")
      .eq("id", clientId)
      .maybeSingle<{ id: number; event_id: number }>();

    if (clientError) {
      throw clientError;
    }

    if (!existingClient) {
      throw new Error("Không tìm thấy client.");
    }

    await admin
      .from("clients")
      .update({
        event_id: eventId,
        source,
        status,
        registration_code: registrationCode || null,
        full_name: fullName,
        email: email || null,
        phone: phone || null,
        company_name: attendeeCompanyName || null,
        ticket_type: ticketType || null,
        checked_in_at: status === "checked_in" ? now : null,
        registration_payload: {
          source: "workspace",
          ticket_type: ticketType || null,
          registration_code: registrationCode || null,
          company_name: attendeeCompanyName || null,
        },
        internal_notes: internalNotes || null,
        metadata: {
          source: "workspace",
          editor: "client-workspace",
          updated_via: "saveClientAction",
        },
      })
      .eq("id", clientId);
  } else {
    await admin.from("clients").insert({
      event_id: eventId,
      source,
      status,
      registration_code: registrationCode || null,
      full_name: fullName,
      email: email || null,
      phone: phone || null,
      company_name: attendeeCompanyName || null,
      ticket_type: ticketType || null,
      checked_in_at: status === "checked_in" ? now : null,
      registration_payload: {
        source: "workspace",
        ticket_type: ticketType || null,
        registration_code: registrationCode || null,
        company_name: attendeeCompanyName || null,
      },
      internal_notes: internalNotes || null,
      metadata: {
        source: "workspace",
        editor: "client-workspace",
        updated_via: "saveClientAction",
      },
    });
  }

  revalidatePath("/workspace/clients");
  revalidatePath("/audience");
  revalidatePath("/checkin");
  redirect("/workspace/clients?saved=1");
}

async function queueClientJobAction(
  formData: FormData,
  kind: "import_clients" | "export_clients",
) {
  const eventId = parseNumber(formData.get("event_id"));

  if (!eventId) {
    throw new Error("Thiếu event_id.");
  }

  const eventScope = await resolveEventScope(eventId);
  await requireSessionWithPermission(kind === "import_clients" ? "client.import" : "client.export", {
    scopeType: "event",
    companyId: eventScope.company_id,
    eventId: eventScope.id,
  });

  const session = await getAuthSessionBootstrap();
  if (!session) {
    throw new Error("Bạn cần đăng nhập để thực hiện thao tác này.");
  }

  const admin = getSupabaseServiceRoleClient();
  const timestamp = Date.now();

  await admin.from("background_jobs").insert({
    company_id: eventScope.company_id,
    event_id: eventScope.id,
    actor_user_id: session.profile.id,
    kind,
    status: "queued",
    idempotency_key: `${kind}-${eventScope.id}-${timestamp}`,
    payload: {
      source: "workspace-clients",
      event_id: eventScope.id,
      company_id: eventScope.company_id,
    },
    result_payload: {},
    attempts: 0,
    max_attempts: 3,
    scheduled_at: new Date().toISOString(),
    metadata: {
      source: "workspace-clients",
      requested_via: kind,
    },
  });

  revalidatePath("/workspace/clients");
  revalidatePath("/system");
  redirect("/workspace/clients?queued=1");
}

export async function queueClientImportAction(formData: FormData) {
  await queueClientJobAction(formData, "import_clients");
}

export async function queueClientExportAction(formData: FormData) {
  await queueClientJobAction(formData, "export_clients");
}
