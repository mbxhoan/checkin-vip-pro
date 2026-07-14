import "server-only";

import type { RbacPayload } from "@/lib/rbac/types";
import { getSupabaseServiceRoleClient } from "@/lib/supabase/service";

export interface ScopedCompanyRow {
  id: number;
  name: string;
  legal_name: string | null;
  slug: string;
}

export interface ScopedEventRow {
  id: number;
  company_id: number;
  name: string;
  code: string | null;
  status: string;
  visibility: string;
  starts_at: string | null;
  ends_at: string | null;
}

export interface ScopedUserRow {
  id: number;
  display_name: string | null;
  full_name: string | null;
  email: string | null;
}

export interface ScopedBackgroundJobRow {
  id: number;
  company_id: number | null;
  event_id: number | null;
  actor_user_id: number | null;
  kind: string;
  status: string;
  idempotency_key: string | null;
  scheduled_at: string;
  started_at: string | null;
  finished_at: string | null;
  attempts: number;
  max_attempts: number;
  error_message: string | null;
  created_at: string;
}

function uniqueNumbers(values: readonly number[]) {
  return Array.from(new Set(values)).sort((left, right) => left - right);
}

export function formatScopeSummary(payload: RbacPayload) {
  if (payload.accessibleCompanyIds === null && payload.accessibleEventIds === null) {
    return "System scope · all companies and events";
  }

  const companyCount = payload.accessibleCompanyIds?.length ?? 0;
  const eventCount = payload.accessibleEventIds?.length ?? 0;

  if (companyCount === 0 && eventCount === 0) {
    return "Self scope · no operational data";
  }

  if (companyCount > 0 && eventCount > 0) {
    return `Scoped access · ${companyCount} companies · ${eventCount} events`;
  }

  if (companyCount > 0) {
    return `Company scope · ${companyCount} companies`;
  }

  return `Event scope · ${eventCount} events`;
}

export async function resolveScopedEventRows(
  payload: RbacPayload,
): Promise<ScopedEventRow[]> {
  const admin = getSupabaseServiceRoleClient();
  const companyIds = payload.accessibleCompanyIds ?? [];
  const eventIds = payload.accessibleEventIds ?? [];

  if (payload.accessibleCompanyIds === null && payload.accessibleEventIds === null) {
    const { data, error } = await admin
      .from("events")
      .select("id, company_id, name, code, status, visibility, starts_at, ends_at")
      .order("starts_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []) as ScopedEventRow[];
  }

  if (companyIds.length === 0 && eventIds.length === 0) {
    return [];
  }

  const rowsById = new Map<number, ScopedEventRow>();

  if (companyIds.length > 0) {
    const { data, error } = await admin
      .from("events")
      .select("id, company_id, name, code, status, visibility, starts_at, ends_at")
      .in("company_id", companyIds)
      .order("starts_at", { ascending: false });

    if (error) {
      throw error;
    }

    for (const row of (data ?? []) as ScopedEventRow[]) {
      rowsById.set(row.id, row);
    }
  }

  if (eventIds.length > 0) {
    const { data, error } = await admin
      .from("events")
      .select("id, company_id, name, code, status, visibility, starts_at, ends_at")
      .in("id", eventIds)
      .order("starts_at", { ascending: false });

    if (error) {
      throw error;
    }

    for (const row of (data ?? []) as ScopedEventRow[]) {
      rowsById.set(row.id, row);
    }
  }

  return Array.from(rowsById.values()).sort((left, right) => {
    const leftTime = left.starts_at ? Date.parse(left.starts_at) : 0;
    const rightTime = right.starts_at ? Date.parse(right.starts_at) : 0;
    return rightTime - leftTime || left.id - right.id;
  });
}

export { resolveScopedEventRows as loadScopedEventRows };

export async function loadCompaniesByIds(
  companyIds: readonly number[],
): Promise<ScopedCompanyRow[]> {
  if (companyIds.length === 0) {
    return [];
  }

  const { data, error } = await getSupabaseServiceRoleClient()
    .from("companies")
    .select("id, name, legal_name, slug")
    .in("id", companyIds);

  if (error) {
    throw error;
  }

  return (data ?? []) as ScopedCompanyRow[];
}

export async function loadUsersByIds(
  userIds: readonly number[],
): Promise<ScopedUserRow[]> {
  if (userIds.length === 0) {
    return [];
  }

  const { data, error } = await getSupabaseServiceRoleClient()
    .from("users")
    .select("id, display_name, full_name, email")
    .in("id", userIds);

  if (error) {
    throw error;
  }

  return (data ?? []) as ScopedUserRow[];
}

export async function loadScopedBackgroundJobRows(
  payload: RbacPayload,
): Promise<ScopedBackgroundJobRow[]> {
  const admin = getSupabaseServiceRoleClient();

  if (payload.accessibleCompanyIds === null && payload.accessibleEventIds === null) {
    const { data, error } = await admin
      .from("background_jobs")
      .select(
        "id, company_id, event_id, actor_user_id, kind, status, idempotency_key, scheduled_at, started_at, finished_at, attempts, max_attempts, error_message, created_at",
      )
      .order("scheduled_at", { ascending: false })
      .limit(10);

    if (error) {
      throw error;
    }

    return (data ?? []) as ScopedBackgroundJobRow[];
  }

  const companyIds = payload.accessibleCompanyIds ?? [];
  const eventIds = payload.accessibleEventIds ?? [];

  if (companyIds.length === 0 && eventIds.length === 0) {
    return [];
  }

  const rowsById = new Map<number, ScopedBackgroundJobRow>();

  if (companyIds.length > 0) {
    const { data, error } = await admin
      .from("background_jobs")
      .select(
        "id, company_id, event_id, actor_user_id, kind, status, idempotency_key, scheduled_at, started_at, finished_at, attempts, max_attempts, error_message, created_at",
      )
      .in("company_id", companyIds)
      .order("scheduled_at", { ascending: false })
      .limit(10);

    if (error) {
      throw error;
    }

    for (const row of (data ?? []) as ScopedBackgroundJobRow[]) {
      rowsById.set(row.id, row);
    }
  }

  if (eventIds.length > 0) {
    const { data, error } = await admin
      .from("background_jobs")
      .select(
        "id, company_id, event_id, actor_user_id, kind, status, idempotency_key, scheduled_at, started_at, finished_at, attempts, max_attempts, error_message, created_at",
      )
      .in("event_id", eventIds)
      .order("scheduled_at", { ascending: false })
      .limit(10);

    if (error) {
      throw error;
    }

    for (const row of (data ?? []) as ScopedBackgroundJobRow[]) {
      rowsById.set(row.id, row);
    }
  }

  return Array.from(rowsById.values()).sort((left, right) => {
    const leftTime = Date.parse(left.scheduled_at);
    const rightTime = Date.parse(right.scheduled_at);
    return rightTime - leftTime || left.id - right.id;
  });
}

export function collectCompanyIdsFromEvents(
  eventRows: readonly ScopedEventRow[],
) {
  return uniqueNumbers(eventRows.map((event) => event.company_id));
}
