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

const CLIENT_VIEW_PERMISSIONS = [
  "client.view",
  "client.create",
  "client.update",
  "client.import",
  "client.export",
] as const satisfies readonly PermissionKey[];

type WorkspaceAccessMode = "session" | "seed";

interface WorkspaceClientRow {
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
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
}

interface WorkspaceClientBackupRow {
  id: number;
  event_id: number;
  source_media_id: number | null;
  created_by_user_id: number | null;
  backup_name: string;
  backup_kind: string;
  row_count: number;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceClientEventCard {
  id: number;
  companyName: string;
  name: string;
  code: string | null;
  status: string;
  visibility: string;
  startsAt: string | null;
  endsAt: string | null;
}

export interface WorkspaceClientCard {
  id: number;
  eventId: number;
  eventName: string;
  companyName: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  attendeeCompanyName: string | null;
  ticketType: string | null;
  source: string;
  status: string;
  registrationCode: string | null;
  checkedInAt: string | null;
  internalNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceClientBackupCard {
  id: number;
  eventName: string;
  companyName: string;
  backupName: string;
  backupKind: string;
  rowCount: number;
  createdByName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceClientJobCard {
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

export interface WorkspaceClientMetrics {
  eventCount: number;
  clientCount: number;
  checkedInClientCount: number;
  pendingClientCount: number;
  backupCount: number;
  queuedJobCount: number;
}

export interface WorkspaceClientSnapshot {
  accessMode: WorkspaceAccessMode;
  canView: boolean;
  canEdit: boolean;
  canQueueJobs: boolean;
  accessSummary: string;
  scopeSummary: string;
  principalName: string;
  companyName: string;
  metrics: WorkspaceClientMetrics;
  events: readonly WorkspaceClientEventCard[];
  clients: readonly WorkspaceClientCard[];
  backups: readonly WorkspaceClientBackupCard[];
  jobs: readonly WorkspaceClientJobCard[];
}

export interface WorkspaceClientContext {
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
  table: "clients" | "client_backups",
  eventIds: readonly number[] | null,
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
      "id, event_id, source, status, registration_code, full_name, email, phone, company_name, ticket_type, checked_in_at, internal_notes, created_at, updated_at",
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

  return (data ?? []) as WorkspaceClientRow[];
}

async function loadClientBackups(eventIds: readonly number[] | null) {
  if (eventIds !== null && eventIds.length === 0) {
    return [];
  }

  let query: any = getSupabaseServiceRoleClient()
    .from("client_backups")
    .select(
      "id, event_id, source_media_id, created_by_user_id, backup_name, backup_kind, row_count, created_at, updated_at",
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

  return (data ?? []) as WorkspaceClientBackupRow[];
}

export const getWorkspaceClientSnapshot = cache(
  async ({
    session,
    bootstrap,
  }: WorkspaceClientContext): Promise<WorkspaceClientSnapshot> => {
    const principal = session?.principal ?? bootstrap.principal;
    const payload = session?.rbac ?? bootstrap.payload;
    const accessMode: WorkspaceAccessMode = session ? "session" : "seed";
    const canView = hasAnyPermission(principal, CLIENT_VIEW_PERMISSIONS);
    const canEdit = hasAnyPermission(principal, ["client.create", "client.update"]);
    const canQueueJobs = hasAnyPermission(principal, ["client.import", "client.export"]);
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
        canEdit,
        canQueueJobs,
        accessSummary,
        scopeSummary: "Client data is hidden until the user has client access.",
        principalName,
        companyName,
        metrics: {
          eventCount: 0,
          clientCount: 0,
          checkedInClientCount: 0,
          pendingClientCount: 0,
          backupCount: 0,
          queuedJobCount: 0,
        },
        events: [],
        clients: [],
        backups: [],
        jobs: [],
      };
    }

    const eventRows = await loadScopedEventRows(payload);
    const eventIds = eventRows.map((row) => row.id);
    const companyIds = collectCompanyIdsFromEvents(eventRows);

    const [
      clientRows,
      backupRows,
      jobRows,
      clientCount,
      backupCount,
      companyRows,
    ] = await Promise.all([
      loadRecentClientRows(eventIds),
      loadClientBackups(eventIds),
      loadScopedBackgroundJobRows(payload),
      countScopeRows("clients", eventIds),
      countScopeRows("client_backups", eventIds),
      loadCompaniesByIds(companyIds),
    ]);

    const checkedInClientCountValue = clientRows.filter(
      (client) => client.checked_in_at !== null || client.status === "checked_in",
    ).length;
    const pendingClientCountValue = clientRows.filter(
      (client) => client.status === "pending",
    ).length;
    const queuedJobCount = jobRows.filter((job) => job.status === "queued").length;

    const companyNameById = new Map<number, ScopedCompanyRow>(
      companyRows.map((row) => [row.id, row]),
    );

    const userIds = uniqueNumbers([
      ...backupRows.flatMap((row) => [row.created_by_user_id ?? -1]),
      ...jobRows.flatMap((row) => [row.actor_user_id ?? -1]),
    ].filter((value) => value > 0));

    const userRows = await loadUsersByIds(userIds);
    const userNameById = new Map<number, ScopedUserRow>(
      userRows.map((row) => [row.id, row]),
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
        attendeeCompanyName: row.company_name,
        ticketType: row.ticket_type,
        source: row.source,
        status: row.status,
        registrationCode: row.registration_code,
        checkedInAt: row.checked_in_at,
        internalNotes: row.internal_notes,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    });

    const backups = backupRows.map((row) => {
      const event = eventRows.find((item) => item.id === row.event_id);

      return {
        id: row.id,
        eventName: event?.name ?? `Event ${row.event_id}`,
        companyName:
          companyNameById.get(event?.company_id ?? -1)?.name ??
          `Company ${event?.company_id ?? row.event_id}`,
        backupName: row.backup_name,
        backupKind: row.backup_kind,
        rowCount: row.row_count,
        createdByName: findUserDisplayName(userNameById, row.created_by_user_id),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
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
        actorName: findUserDisplayName(userNameById, row.actor_user_id),
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
      canEdit,
      canQueueJobs,
      accessSummary,
      scopeSummary:
        eventRows.length > 0
          ? `${eventRows.length} events in scope · ${clients.length} recent clients`
          : "No event scope resolved for the client workspace",
      principalName,
      companyName,
      metrics: {
        eventCount: eventRows.length,
        clientCount,
        checkedInClientCount: checkedInClientCountValue,
        pendingClientCount: pendingClientCountValue,
        backupCount,
        queuedJobCount,
      },
      events,
      clients,
      backups,
      jobs,
    };
  },
);
