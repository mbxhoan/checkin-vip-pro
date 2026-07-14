import "server-only";

import { cache } from "react";

import type { AuthSessionBootstrap } from "@/lib/auth/types";
import { hasAnyPermission } from "@/lib/rbac/authorize";
import type { RbacBootstrapContext } from "@/lib/rbac/bootstrap";
import type { PermissionKey } from "@/lib/rbac/permissions";
import type { RbacPayload } from "@/lib/rbac/types";
import { getSupabaseServiceRoleClient } from "@/lib/supabase/service";

const AUDIENCE_VIEW_PERMISSIONS = [
  "client.view",
  "checkin.view",
  "report.view",
] as const satisfies readonly PermissionKey[];

type AudienceAccessMode = "session" | "seed";

interface AudienceEventRow {
  id: number;
  company_id: number;
  name: string;
  code: string | null;
  status: string;
  visibility: string;
  starts_at: string | null;
  ends_at: string | null;
}

interface AudienceCompanyRow {
  id: number;
  name: string;
  legal_name: string | null;
  slug: string;
}

interface AudienceClientRow {
  id: number;
  event_id: number;
  full_name: string;
  email: string | null;
  phone: string | null;
  company_name: string | null;
  ticket_type: string | null;
  status: string;
  registration_code: string | null;
  checked_in_at: string | null;
  created_at: string;
}

interface AudienceCheckinRow {
  id: number;
  event_id: number;
  client_id: number;
  scanner_device_id: number | null;
  checked_by_user_id: number | null;
  status: string;
  method: string;
  happened_at: string;
  note: string | null;
  created_at: string;
}

interface AudienceDeviceRow {
  id: number;
  event_id: number;
  user_id: number | null;
  device_name: string;
  status: string;
  last_seen_at: string | null;
  last_sync_at: string | null;
  assigned_at: string | null;
  created_at: string;
}

interface AudienceReportRow {
  id: number;
  company_id: number | null;
  event_id: number | null;
  scope_type: string;
  kind: string;
  name: string;
  key: string;
  is_active: boolean;
  updated_at: string;
}

interface AudienceUserRow {
  id: number;
  display_name: string | null;
  full_name: string | null;
  email: string | null;
}

export interface AudienceEventCard {
  id: number;
  companyName: string;
  name: string;
  code: string | null;
  status: string;
  visibility: string;
  startsAt: string | null;
  endsAt: string | null;
}

export interface AudienceClientCard {
  id: number;
  eventName: string;
  companyName: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  ticketType: string | null;
  status: string;
  registrationCode: string | null;
  checkedInAt: string | null;
}

export interface AudienceCheckinCard {
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

export interface AudienceDeviceCard {
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

export interface AudienceReportCard {
  id: number;
  scopeLabel: string;
  eventName: string | null;
  companyName: string | null;
  name: string;
  key: string;
  kind: string;
  isActive: boolean;
  updatedAt: string;
}

export interface AudienceMetrics {
  eventCount: number;
  clientCount: number;
  checkedInClientCount: number;
  pendingClientCount: number;
  checkinCount: number;
  deviceCount: number;
  activeDeviceCount: number;
  reportCount: number;
  activeReportCount: number;
}

export interface AudienceDashboardSnapshot {
  accessMode: AudienceAccessMode;
  canView: boolean;
  accessSummary: string;
  scopeSummary: string;
  principalName: string;
  companyName: string;
  metrics: AudienceMetrics;
  events: readonly AudienceEventCard[];
  clients: readonly AudienceClientCard[];
  checkins: readonly AudienceCheckinCard[];
  devices: readonly AudienceDeviceCard[];
  reports: readonly AudienceReportCard[];
}

export interface AudienceDashboardContext {
  session: AuthSessionBootstrap | null;
  bootstrap: RbacBootstrapContext;
}

function uniqueNumbers(values: readonly number[]) {
  return Array.from(new Set(values)).sort((left, right) => left - right);
}

function getAccessibleScopeSummary(payload: RbacPayload) {
  if (payload.accessibleCompanyIds === null && payload.accessibleEventIds === null) {
    return "System scope · all companies and events";
  }

  const companyCount = payload.accessibleCompanyIds?.length ?? 0;
  const eventCount = payload.accessibleEventIds?.length ?? 0;

  if (companyCount === 0 && eventCount === 0) {
    return "Self scope · no operational audience data";
  }

  if (companyCount > 0 && eventCount > 0) {
    return `Scoped access · ${companyCount} companies · ${eventCount} events`;
  }

  if (companyCount > 0) {
    return `Company scope · ${companyCount} companies`;
  }

  return `Event scope · ${eventCount} events`;
}

async function countScopeRows(
  table:
    | "clients"
    | "checkins"
    | "scanner_devices",
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

async function resolveAudienceEventRows(
  payload: RbacPayload,
): Promise<AudienceEventRow[]> {
  const admin = getSupabaseServiceRoleClient();

  if (payload.accessibleCompanyIds === null && payload.accessibleEventIds === null) {
    const { data, error } = await admin
      .from("events")
      .select("id, company_id, name, code, status, visibility, starts_at, ends_at")
      .order("starts_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []) as AudienceEventRow[];
  }

  const rowsById = new Map<number, AudienceEventRow>();

  if (payload.accessibleCompanyIds && payload.accessibleCompanyIds.length > 0) {
    const { data, error } = await admin
      .from("events")
      .select("id, company_id, name, code, status, visibility, starts_at, ends_at")
      .in("company_id", payload.accessibleCompanyIds)
      .order("starts_at", { ascending: false });

    if (error) {
      throw error;
    }

    for (const row of (data ?? []) as AudienceEventRow[]) {
      rowsById.set(row.id, row);
    }
  }

  if (payload.accessibleEventIds && payload.accessibleEventIds.length > 0) {
    const { data, error } = await admin
      .from("events")
      .select("id, company_id, name, code, status, visibility, starts_at, ends_at")
      .in("id", payload.accessibleEventIds)
      .order("starts_at", { ascending: false });

    if (error) {
      throw error;
    }

    for (const row of (data ?? []) as AudienceEventRow[]) {
      rowsById.set(row.id, row);
    }
  }

  return Array.from(rowsById.values()).sort((left, right) => {
    const leftTime = left.starts_at ? Date.parse(left.starts_at) : 0;
    const rightTime = right.starts_at ? Date.parse(right.starts_at) : 0;
    return rightTime - leftTime || left.id - right.id;
  });
}

async function loadCompanyRows(companyIds: readonly number[]) {
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

  return (data ?? []) as AudienceCompanyRow[];
}

async function loadRecentClientRows(eventIds: readonly number[] | null) {
  if (eventIds !== null && eventIds.length === 0) {
    return [];
  }

  let query: any = getSupabaseServiceRoleClient()
    .from("clients")
    .select(
      "id, event_id, full_name, email, phone, company_name, ticket_type, status, registration_code, checked_in_at, created_at",
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

  return (data ?? []) as AudienceClientRow[];
}

async function loadRecentCheckinRows(eventIds: readonly number[] | null) {
  if (eventIds !== null && eventIds.length === 0) {
    return [];
  }

  let query: any = getSupabaseServiceRoleClient()
    .from("checkins")
    .select(
      "id, event_id, client_id, scanner_device_id, checked_by_user_id, status, method, happened_at, note, created_at",
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

  return (data ?? []) as AudienceCheckinRow[];
}

async function loadRecentDeviceRows(eventIds: readonly number[] | null) {
  if (eventIds !== null && eventIds.length === 0) {
    return [];
  }

  let query: any = getSupabaseServiceRoleClient()
    .from("scanner_devices")
    .select(
      "id, event_id, user_id, device_name, status, last_seen_at, last_sync_at, assigned_at, created_at",
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

  return (data ?? []) as AudienceDeviceRow[];
}

async function loadAudienceReportRows(payload: RbacPayload) {
  const admin = getSupabaseServiceRoleClient();

  if (payload.accessibleCompanyIds === null && payload.accessibleEventIds === null) {
    const { data, error } = await admin
      .from("reports")
      .select("id, company_id, event_id, scope_type, kind, name, key, is_active, updated_at")
      .order("updated_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []) as AudienceReportRow[];
  }

  const rowsById = new Map<number, AudienceReportRow>();

  if (payload.accessibleCompanyIds && payload.accessibleCompanyIds.length > 0) {
    const { data, error } = await admin
      .from("reports")
      .select("id, company_id, event_id, scope_type, kind, name, key, is_active, updated_at")
      .in("company_id", payload.accessibleCompanyIds)
      .order("updated_at", { ascending: false });

    if (error) {
      throw error;
    }

    for (const row of (data ?? []) as AudienceReportRow[]) {
      rowsById.set(row.id, row);
    }
  }

  if (payload.accessibleEventIds && payload.accessibleEventIds.length > 0) {
    const { data, error } = await admin
      .from("reports")
      .select("id, company_id, event_id, scope_type, kind, name, key, is_active, updated_at")
      .in("event_id", payload.accessibleEventIds)
      .order("updated_at", { ascending: false });

    if (error) {
      throw error;
    }

    for (const row of (data ?? []) as AudienceReportRow[]) {
      rowsById.set(row.id, row);
    }
  }

  return Array.from(rowsById.values()).sort((left, right) => {
    const leftTime = Date.parse(left.updated_at);
    const rightTime = Date.parse(right.updated_at);
    return rightTime - leftTime || left.id - right.id;
  });
}

async function loadAudienceUsers(userIds: readonly number[]) {
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

  return (data ?? []) as AudienceUserRow[];
}

function findUserDisplayName(
  usersById: Map<number, AudienceUserRow>,
  userId: number | null,
) {
  if (userId == null) {
    return null;
  }

  const user = usersById.get(userId);
  return user?.display_name ?? user?.full_name ?? user?.email ?? `User ${userId}`;
}

export const getAudienceDashboardSnapshot = cache(
  async ({
    session,
    bootstrap,
  }: AudienceDashboardContext): Promise<AudienceDashboardSnapshot> => {
    const principal = session?.principal ?? bootstrap.principal;
    const payload = session?.rbac ?? bootstrap.payload;
    const accessMode: AudienceAccessMode = session ? "session" : "seed";
    const canView = hasAnyPermission(principal, AUDIENCE_VIEW_PERMISSIONS);
    const principalName =
      session?.profile.displayName ?? bootstrap.principal.displayName ?? "Guest";
    const companyName =
      session?.profile.defaultCompanyName ??
      bootstrap.companies.find((company) => company.id === principal.defaultCompanyId)?.name ??
      "Giltech Solutions";
    const accessSummary = getAccessibleScopeSummary(payload);

    if (!canView) {
      return {
        accessMode,
        canView,
        accessSummary,
        scopeSummary: "Audience data is hidden until the user has client, check-in, or report view permission.",
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
          reportCount: 0,
          activeReportCount: 0,
        },
        events: [],
        clients: [],
        checkins: [],
        devices: [],
        reports: [],
      };
    }

    const eventRows = await resolveAudienceEventRows(payload);
    const eventIds = eventRows.map((row) => row.id);
    const [
      recentClientRows,
      recentCheckinRows,
      recentDeviceRows,
      reportRows,
      clientCount,
      checkedInClientCount,
      pendingClientCount,
      checkinCount,
      deviceCount,
      activeDeviceCount,
    ] = await Promise.all([
      loadRecentClientRows(eventIds),
      loadRecentCheckinRows(eventIds),
      loadRecentDeviceRows(eventIds),
      loadAudienceReportRows(payload),
      countScopeRows("clients", eventIds),
      countScopeRows("clients", eventIds, (query) => query.not("checked_in_at", "is", null)),
      countScopeRows("clients", eventIds, (query) => query.eq("status", "pending")),
      countScopeRows("checkins", eventIds),
      countScopeRows("scanner_devices", eventIds),
      countScopeRows("scanner_devices", eventIds, (query) => query.eq("status", "active")),
    ]);

    const companiesNeeded = uniqueNumbers([
      ...eventRows.map((row) => row.company_id),
      ...reportRows.flatMap((row) => [
        row.company_id ?? -1,
        row.event_id
          ? eventRows.find((event) => event.id === row.event_id)?.company_id ?? -1
          : -1,
      ]),
    ].filter((value) => value > 0));

    const companyRows = await loadCompanyRows(companiesNeeded);

    const companyNameById = new Map<number, AudienceCompanyRow>(
      companyRows.map((row) => [row.id, row]),
    );

    const clientIds = uniqueNumbers(recentCheckinRows.map((row) => row.client_id));
    const userIds = uniqueNumbers([
      ...recentCheckinRows.flatMap((row) => [
        row.checked_by_user_id ?? -1,
      ]),
      ...recentDeviceRows.flatMap((row) => [row.user_id ?? -1]),
    ].filter((value) => value > 0));

    const [clientLookupRows, userLookupRows] = await Promise.all([
      loadAudienceClientsByIds(clientIds),
      loadAudienceUsers(userIds),
    ]);

    const clientNameById = new Map<number, AudienceClientRow>(
      clientLookupRows.map((row) => [row.id, row]),
    );
    const userNameById = new Map<number, AudienceUserRow>(
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

    const clients = recentClientRows.map((row) => {
      const event = eventRows.find((item) => item.id === row.event_id);

      return {
        id: row.id,
        eventName: event?.name ?? `Event ${row.event_id}`,
        companyName:
          companyNameById.get(event?.company_id ?? -1)?.name ??
          `Company ${event?.company_id ?? row.event_id}`,
        fullName: row.full_name,
        email: row.email,
        phone: row.phone,
        ticketType: row.ticket_type,
        status: row.status,
        registrationCode: row.registration_code,
        checkedInAt: row.checked_in_at,
      };
    });

    const devices = recentDeviceRows.map((row) => {
      const event = eventRows.find((item) => item.id === row.event_id);

      return {
        id: row.id,
        eventName: event?.name ?? `Event ${row.event_id}`,
        companyName:
          companyNameById.get(event?.company_id ?? -1)?.name ??
          `Company ${event?.company_id ?? row.event_id}`,
        deviceName: row.device_name,
        assignedOperatorName: findUserDisplayName(userNameById, row.user_id),
        status: row.status,
        lastSeenAt: row.last_seen_at,
        lastSyncAt: row.last_sync_at,
        assignedAt: row.assigned_at,
      };
    });

    const checkins = recentCheckinRows.map((row) => {
      const event = eventRows.find((item) => item.id === row.event_id);
      const client = clientNameById.get(row.client_id);

      return {
        id: row.id,
        eventName: event?.name ?? `Event ${row.event_id}`,
        companyName:
          companyNameById.get(event?.company_id ?? -1)?.name ??
          `Company ${event?.company_id ?? row.event_id}`,
        clientName: client?.full_name ?? `Client ${row.client_id}`,
        scannerDeviceName:
          recentDeviceRows.find((device) => device.id === row.scanner_device_id)?.device_name ??
          (row.scanner_device_id ? `Scanner ${row.scanner_device_id}` : null),
        checkedByName: findUserDisplayName(userNameById, row.checked_by_user_id),
        status: row.status,
        method: row.method,
        happenedAt: row.happened_at,
        note: row.note,
      };
    });

    const reports = reportRows.map((row) => {
      const event = row.event_id ? eventRows.find((item) => item.id === row.event_id) : null;
      const company = row.company_id
        ? companyNameById.get(row.company_id)?.name ??
          bootstrap.companies.find((item) => item.id === row.company_id)?.name ??
          `Company ${row.company_id}`
        : event
          ? companyNameById.get(event.company_id)?.name ??
            `Company ${event.company_id}`
          : null;

      return {
        id: row.id,
        scopeLabel:
          row.scope_type === "system"
            ? "System"
            : row.scope_type === "company"
              ? "Company"
              : "Event",
        eventName: event?.name ?? null,
        companyName: company,
        name: row.name,
        key: row.key,
        kind: row.kind,
        isActive: row.is_active,
        updatedAt: row.updated_at,
      };
    });

    const activeReportCount = reports.filter((report) => report.isActive).length;

    return {
      accessMode,
      canView,
      accessSummary,
      scopeSummary:
        eventRows.length > 0
          ? `${eventRows.length} events in scope · ${reports.length} reports visible`
          : reports.length > 0
            ? `${reports.length} reports visible in the current company scope`
            : "No event scope resolved for this audience lane",
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
        reportCount: reports.length,
        activeReportCount,
      },
      events,
      clients,
      checkins,
      devices,
      reports,
    };
  },
);

async function loadAudienceClientsByIds(clientIds: readonly number[]) {
  if (clientIds.length === 0) {
    return [];
  }

  const { data, error } = await getSupabaseServiceRoleClient()
    .from("clients")
    .select("id, event_id, full_name, email, phone, company_name, ticket_type, status, registration_code, checked_in_at, created_at")
    .in("id", clientIds);

  if (error) {
    throw error;
  }

  return (data ?? []) as AudienceClientRow[];
}
