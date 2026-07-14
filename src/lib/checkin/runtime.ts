import "server-only";

import { cache } from "react";

import type { AuthSessionBootstrap } from "@/lib/auth/types";
import { hasAnyPermission } from "@/lib/rbac/authorize";
import type { RbacBootstrapContext } from "@/lib/rbac/bootstrap";
import type { PermissionKey } from "@/lib/rbac/permissions";
import type { RbacPayload } from "@/lib/rbac/types";
import {
  collectCompanyIdsFromEvents,
  formatScopeSummary,
  loadCompaniesByIds,
  loadScopedBackgroundJobRows,
  loadScopedEventRows,
  loadUsersByIds,
  type ScopedCompanyRow,
  type ScopedUserRow,
} from "@/lib/scope/read-model";
import { getSupabaseServiceRoleClient } from "@/lib/supabase/service";

const CHECKIN_VIEW_PERMISSIONS = [
  "checkin.view",
  "checkin.run",
] as const satisfies readonly PermissionKey[];

type RuntimeAccessMode = "session" | "seed";

interface RuntimeClientRow {
  id: number;
  event_id: number;
  source: string;
  status: string;
  registration_code: string | null;
  full_name: string;
  email: string | null;
  phone: string | null;
  company_name: string | null;
  ticket_type: string | null;
  checked_in_at: string | null;
  created_at: string;
}

interface RuntimeCheckinRow {
  id: number;
  event_id: number;
  client_id: number;
  scanner_device_id: number | null;
  checked_by_user_id: number | null;
  source_batch_id: number | null;
  status: string;
  method: string;
  happened_at: string;
  note: string | null;
  created_at: string;
}

interface RuntimeDeviceRow {
  id: number;
  event_id: number;
  user_id: number | null;
  device_name: string;
  status: string;
  last_seen_at: string | null;
  last_sync_at: string | null;
  assigned_at: string | null;
}

interface RuntimeOfflineBatchRow {
  id: number;
  scanner_device_id: number;
  event_id: number;
  user_id: number | null;
  status: string;
  row_count: number;
  synced_at: string | null;
  error_message: string | null;
  created_at: string;
}

export interface RuntimeEventCard {
  id: number;
  companyName: string;
  name: string;
  code: string | null;
  status: string;
  visibility: string;
  startsAt: string | null;
  endsAt: string | null;
}

export interface RuntimeClientCard {
  id: number;
  eventId: number;
  eventName: string;
  companyName: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  registrationCode: string | null;
  ticketType: string | null;
  source: string;
  status: string;
  checkedInAt: string | null;
  createdAt: string;
}

export interface RuntimeCheckinCard {
  id: number;
  eventName: string;
  companyName: string;
  clientName: string;
  scannerDeviceName: string | null;
  checkedByName: string | null;
  status: string;
  method: string;
  happenedAt: string;
  note: string | null;
}

export interface RuntimeDeviceCard {
  id: number;
  eventName: string;
  companyName: string;
  deviceName: string;
  assignedOperatorName: string | null;
  status: string;
  lastSeenAt: string | null;
  lastSyncAt: string | null;
  assignedAt: string | null;
}

export interface RuntimeOfflineBatchCard {
  id: number;
  eventName: string;
  companyName: string;
  deviceName: string;
  assignedOperatorName: string | null;
  status: string;
  rowCount: number;
  syncedAt: string | null;
  errorMessage: string | null;
  createdAt: string;
}

export interface RuntimeJobCard {
  id: number;
  eventName: string | null;
  companyName: string | null;
  actorName: string | null;
  kind: string;
  status: string;
  scheduledAt: string;
  startedAt: string | null;
  finishedAt: string | null;
  attempts: number;
  errorMessage: string | null;
}

export interface RuntimeMetrics {
  eventCount: number;
  clientCount: number;
  checkedInClientCount: number;
  pendingClientCount: number;
  checkinCount: number;
  deviceCount: number;
  activeDeviceCount: number;
  offlineBatchCount: number;
  queuedBatchCount: number;
}

export interface CheckinRuntimeSnapshot {
  accessMode: RuntimeAccessMode;
  canView: boolean;
  canRunCheckin: boolean;
  canManageSync: boolean;
  accessSummary: string;
  scopeSummary: string;
  principalName: string;
  companyName: string;
  metrics: RuntimeMetrics;
  events: readonly RuntimeEventCard[];
  clients: readonly RuntimeClientCard[];
  checkins: readonly RuntimeCheckinCard[];
  devices: readonly RuntimeDeviceCard[];
  offlineBatches: readonly RuntimeOfflineBatchCard[];
  jobs: readonly RuntimeJobCard[];
}

export interface CheckinRuntimeContext {
  session: AuthSessionBootstrap | null;
  bootstrap: RbacBootstrapContext;
}

function uniqueNumbers(values: readonly number[]) {
  return Array.from(new Set(values)).sort((left, right) => left - right);
}

function findUserDisplayName(
  usersById: Map<number, ScopedUserRow>,
  userId: number | null,
) {
  if (userId == null) {
    return null;
  }

  const user = usersById.get(userId);
  return user?.display_name ?? user?.full_name ?? user?.email ?? `User ${userId}`;
}

async function countScopeRows(
  table: "clients" | "checkins" | "scanner_devices" | "scan_offline_batches",
  eventIds: readonly number[] | null,
  builder?: (query: any) => any,
) {
  if (eventIds !== null && eventIds.length === 0) {
    return 0;
  }

  let query: any = getSupabaseServiceRoleClient()
    .from(table)
    .select("id", { count: "exact", head: true });

  if (eventIds !== null) {
    query = query.in("event_id", eventIds);
  }

  if (builder) {
    query = builder(query);
  }

  const { count, error } = await query;
  if (error) {
    throw error;
  }

  return count ?? 0;
}

async function loadRecentClientRows(eventIds: readonly number[] | null) {
  if (eventIds !== null && eventIds.length === 0) {
    return [];
  }

  let query: any = getSupabaseServiceRoleClient()
    .from("clients")
    .select(
      "id, event_id, source, status, registration_code, full_name, email, phone, company_name, ticket_type, checked_in_at, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(8);

  if (eventIds !== null) {
    query = query.in("event_id", eventIds);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  return (data ?? []) as RuntimeClientRow[];
}

async function loadRecentCheckinRows(eventIds: readonly number[] | null) {
  if (eventIds !== null && eventIds.length === 0) {
    return [];
  }

  let query: any = getSupabaseServiceRoleClient()
    .from("checkins")
    .select(
      "id, event_id, client_id, scanner_device_id, checked_by_user_id, source_batch_id, status, method, happened_at, note, created_at",
    )
    .order("happened_at", { ascending: false })
    .limit(8);

  if (eventIds !== null) {
    query = query.in("event_id", eventIds);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  return (data ?? []) as RuntimeCheckinRow[];
}

async function loadRecentDeviceRows(eventIds: readonly number[] | null) {
  if (eventIds !== null && eventIds.length === 0) {
    return [];
  }

  let query: any = getSupabaseServiceRoleClient()
    .from("scanner_devices")
    .select(
      "id, event_id, user_id, device_name, status, last_seen_at, last_sync_at, assigned_at",
    )
    .order("created_at", { ascending: false })
    .limit(8);

  if (eventIds !== null) {
    query = query.in("event_id", eventIds);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  return (data ?? []) as RuntimeDeviceRow[];
}

async function loadRecentOfflineBatchRows(eventIds: readonly number[] | null) {
  if (eventIds !== null && eventIds.length === 0) {
    return [];
  }

  let query: any = getSupabaseServiceRoleClient()
    .from("scan_offline_batches")
    .select(
      "id, scanner_device_id, event_id, user_id, status, row_count, synced_at, error_message, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(8);

  if (eventIds !== null) {
    query = query.in("event_id", eventIds);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  return (data ?? []) as RuntimeOfflineBatchRow[];
}

async function loadClientsByIds(clientIds: readonly number[]) {
  if (clientIds.length === 0) {
    return [];
  }

  const { data, error } = await getSupabaseServiceRoleClient()
    .from("clients")
    .select("id, event_id, full_name, registration_code")
    .in("id", clientIds);

  if (error) {
    throw error;
  }

  return (data ?? []) as {
    id: number;
    event_id: number;
    full_name: string;
    registration_code: string | null;
  }[];
}

export const getCheckinRuntimeSnapshot = cache(
  async ({
    session,
    bootstrap,
  }: CheckinRuntimeContext): Promise<CheckinRuntimeSnapshot> => {
    const principal = session?.principal ?? bootstrap.principal;
    const payload = session?.rbac ?? bootstrap.payload;
    const accessMode: RuntimeAccessMode = session ? "session" : "seed";
    const canView = hasAnyPermission(principal, CHECKIN_VIEW_PERMISSIONS);
    const canRunCheckin = hasAnyPermission(principal, ["checkin.run"]);
    const canManageSync = hasAnyPermission(principal, ["checkin.manage", "checkin.run"]);
    const principalName =
      session?.profile.displayName ?? bootstrap.principal.displayName ?? "Guest";
    const companyName =
      session?.profile.defaultCompanyName ??
      bootstrap.companies.find((company) => company.id === principal.defaultCompanyId)?.name ??
      "Giltech Solutions";
    const accessSummary = formatScopeSummary(payload);

    if (!canView) {
      return {
        accessMode,
        canView,
        canRunCheckin,
        canManageSync,
        accessSummary,
        scopeSummary: "Check-in data is hidden until the user has check-in permissions.",
        principalName,
        companyName,
        metrics: {
          eventCount: 0,
          clientCount: 0,
          checkedInClientCount: 0,
          pendingClientCount: 0,
          checkinCount: 0,
          deviceCount: 0,
          activeDeviceCount: 0,
          offlineBatchCount: 0,
          queuedBatchCount: 0,
        },
        events: [],
        clients: [],
        checkins: [],
        devices: [],
        offlineBatches: [],
        jobs: [],
      };
    }

    const eventRows = await loadScopedEventRows(payload);
    const eventIds = eventRows.map((row) => row.id);
    const companyIds = collectCompanyIdsFromEvents(eventRows);

    const [
      clientRows,
      checkinRows,
      deviceRows,
      offlineBatchRows,
      jobRows,
      clientCount,
      checkinCount,
      deviceCount,
      activeDeviceCount,
      offlineBatchCount,
      queuedBatchCount,
      companyRows,
    ] = await Promise.all([
      loadRecentClientRows(eventIds),
      loadRecentCheckinRows(eventIds),
      loadRecentDeviceRows(eventIds),
      loadRecentOfflineBatchRows(eventIds),
      loadScopedBackgroundJobRows(payload),
      countScopeRows("clients", eventIds),
      countScopeRows("checkins", eventIds),
      countScopeRows("scanner_devices", eventIds),
      countScopeRows("scanner_devices", eventIds, (query) => query.eq("status", "active")),
      countScopeRows("scan_offline_batches", eventIds),
      countScopeRows("scan_offline_batches", eventIds, (query) =>
        query.in("status", ["queued", "processing"]),
      ),
      loadCompaniesByIds(companyIds),
    ]);

    const checkedInClientCount = clientRows.filter(
      (client) => client.checked_in_at !== null || client.status === "checked_in",
    ).length;
    const pendingClientCount = clientRows.filter((client) => client.status === "pending").length;

    const companyNameById = new Map<number, ScopedCompanyRow>(
      companyRows.map((row) => [row.id, row]),
    );

    const clientIds = uniqueNumbers(checkinRows.map((row) => row.client_id));
    const userIds = uniqueNumbers([
      ...checkinRows.flatMap((row) => [row.checked_by_user_id ?? -1]),
      ...deviceRows.flatMap((row) => [row.user_id ?? -1]),
      ...offlineBatchRows.flatMap((row) => [row.user_id ?? -1]),
      ...jobRows.flatMap((row) => [row.actor_user_id ?? -1]),
    ].filter((value) => value > 0));

    const [clientLookupRows, userLookupRows] = await Promise.all([
      loadClientsByIds(clientIds),
      loadUsersByIds(userIds),
    ]);

    const clientRowsById = new Map<number, { id: number; event_id: number; full_name: string; registration_code: string | null }>(
      clientLookupRows.map((row) => [row.id, row]),
    );
    const userRowsById = new Map<number, ScopedUserRow>(
      userLookupRows.map((row) => [row.id, row]),
    );

    const events = eventRows.map((row) => ({
      id: row.id,
      companyName:
        companyNameById.get(row.company_id)?.name ??
        bootstrap.companies.find((company) => company.id === row.company_id)?.name ??
        `Company ${row.company_id}`,
      name: row.name,
      code: row.code,
      status: row.status,
      visibility: row.visibility,
      startsAt: row.starts_at,
      endsAt: row.ends_at,
    }));

    const clients = clientRows.map((row) => {
      const event = eventRows.find((item) => item.id === row.event_id);

      return {
        id: row.id,
        eventId: row.event_id,
        eventName: event?.name ?? `Event ${row.event_id}`,
        companyName:
          companyNameById.get(event?.company_id ?? -1)?.name ??
          `Company ${event?.company_id ?? row.event_id}`,
        fullName: row.full_name,
        email: row.email,
        phone: row.phone,
        registrationCode: row.registration_code,
        ticketType: row.ticket_type,
        source: row.source,
        status: row.status,
        checkedInAt: row.checked_in_at,
        createdAt: row.created_at,
      };
    });

    const checkins = checkinRows.map((row) => {
      const event = eventRows.find((item) => item.id === row.event_id);
      const client = clientRowsById.get(row.client_id);

      return {
        id: row.id,
        eventName: event?.name ?? `Event ${row.event_id}`,
        companyName:
          companyNameById.get(event?.company_id ?? -1)?.name ??
          `Company ${event?.company_id ?? row.event_id}`,
        clientName: client?.full_name ?? `Client ${row.client_id}`,
        scannerDeviceName:
          deviceRows.find((device) => device.id === row.scanner_device_id)?.device_name ??
          (row.scanner_device_id ? `Scanner ${row.scanner_device_id}` : null),
        checkedByName: findUserDisplayName(userRowsById, row.checked_by_user_id),
        status: row.status,
        method: row.method,
        happenedAt: row.happened_at,
        note: row.note,
      };
    });

    const devices = deviceRows.map((row) => {
      const event = eventRows.find((item) => item.id === row.event_id);

      return {
        id: row.id,
        eventName: event?.name ?? `Event ${row.event_id}`,
        companyName:
          companyNameById.get(event?.company_id ?? -1)?.name ??
          `Company ${event?.company_id ?? row.event_id}`,
        deviceName: row.device_name,
        assignedOperatorName: findUserDisplayName(userRowsById, row.user_id),
        status: row.status,
        lastSeenAt: row.last_seen_at,
        lastSyncAt: row.last_sync_at,
        assignedAt: row.assigned_at,
      };
    });

    const offlineBatches = offlineBatchRows.map((row) => {
      const event = eventRows.find((item) => item.id === row.event_id);
      const device = deviceRows.find((item) => item.id === row.scanner_device_id);

      return {
        id: row.id,
        eventName: event?.name ?? `Event ${row.event_id}`,
        companyName:
          companyNameById.get(event?.company_id ?? -1)?.name ??
          `Company ${event?.company_id ?? row.event_id}`,
        deviceName: device?.device_name ?? `Scanner ${row.scanner_device_id}`,
        assignedOperatorName: findUserDisplayName(userRowsById, row.user_id),
        status: row.status,
        rowCount: row.row_count,
        syncedAt: row.synced_at,
        errorMessage: row.error_message,
        createdAt: row.created_at,
      };
    });

    const jobs = jobRows.map((row) => {
      const event = row.event_id ? eventRows.find((item) => item.id === row.event_id) : null;

      return {
        id: row.id,
        eventName: event?.name ?? (row.event_id ? `Event ${row.event_id}` : null),
        companyName:
          event?.company_id != null
            ? companyNameById.get(event.company_id)?.name ??
              `Company ${event.company_id}`
            : row.company_id != null
              ? companyNameById.get(row.company_id)?.name ??
                `Company ${row.company_id}`
              : null,
        actorName: findUserDisplayName(userRowsById, row.actor_user_id),
        kind: row.kind,
        status: row.status,
        scheduledAt: row.scheduled_at,
        startedAt: row.started_at,
        finishedAt: row.finished_at,
        attempts: row.attempts,
        errorMessage: row.error_message,
      };
    });

    return {
      accessMode,
      canView,
      canRunCheckin,
      canManageSync,
      accessSummary,
      scopeSummary:
        eventRows.length > 0
          ? `${eventRows.length} events in scope · ${checkinCount} check-ins recorded`
          : "No event scope resolved for the runtime lane",
      principalName,
      companyName,
      metrics: {
        eventCount: eventRows.length,
        clientCount,
        checkedInClientCount,
        pendingClientCount,
        checkinCount,
        deviceCount,
        activeDeviceCount,
        offlineBatchCount,
        queuedBatchCount,
      },
      events,
      clients,
      checkins,
      devices,
      offlineBatches,
      jobs,
    };
  },
);
