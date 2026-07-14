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
  loadUsersByIds,
  resolveScopedEventRows,
  type ScopedCompanyRow,
  type ScopedEventRow,
  type ScopedUserRow,
} from "@/lib/scope/read-model";
import { getSupabaseServiceRoleClient } from "@/lib/supabase/service";

const REPORT_VIEW_PERMISSIONS = ["report.view"] as const satisfies readonly PermissionKey[];

type ReportAccessMode = "session" | "seed";

interface ReportRow {
  id: number;
  scope_type: string;
  company_id: number | null;
  event_id: number | null;
  kind: string;
  name: string;
  key: string;
  is_active: boolean;
  updated_at: string;
}

interface ReportRunRow {
  id: number;
  report_id: number;
  requested_by_user_id: number | null;
  status: string;
  row_count: number | null;
  started_at: string | null;
  finished_at: string | null;
  error_message: string | null;
  created_at: string;
}

export interface ReportParityReportCard {
  id: number;
  scopeLabel: string;
  eventName: string | null;
  companyName: string | null;
  name: string;
  key: string;
  kind: string;
  isActive: boolean;
  updatedAt: string;
  latestRunStatus: string | null;
  latestRunAt: string | null;
  latestRunRowCount: number | null;
}

export interface ReportParityRunCard {
  id: number;
  reportName: string;
  reportKey: string;
  eventName: string | null;
  companyName: string | null;
  requestedByName: string | null;
  status: string;
  rowCount: number | null;
  startedAt: string | null;
  finishedAt: string | null;
  errorMessage: string | null;
  createdAt: string;
}

export interface ReportParityMetrics {
  reportCount: number;
  activeReportCount: number;
  runCount: number;
  successfulRunCount: number;
  failedRunCount: number;
  queuedRunCount: number;
  coverageCount: number;
}

export interface ReportParitySnapshot {
  accessMode: ReportAccessMode;
  canView: boolean;
  accessSummary: string;
  scopeSummary: string;
  principalName: string;
  companyName: string;
  metrics: ReportParityMetrics;
  reports: readonly ReportParityReportCard[];
  runs: readonly ReportParityRunCard[];
  uncoveredReportNames: readonly string[];
}

export interface ReportParityContext {
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

async function loadScopedReportRows(payload: RbacPayload) {
  const admin = getSupabaseServiceRoleClient();
  const companyIds = payload.accessibleCompanyIds ?? [];
  const eventIds = payload.accessibleEventIds ?? [];

  if (payload.accessibleCompanyIds === null && payload.accessibleEventIds === null) {
    const { data, error } = await admin
      .from("reports")
      .select("id, scope_type, company_id, event_id, kind, name, key, is_active, updated_at")
      .order("updated_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []) as ReportRow[];
  }

  if (companyIds.length === 0 && eventIds.length === 0) {
    return [];
  }

  const rowsById = new Map<number, ReportRow>();

  if (companyIds.length > 0) {
    const { data, error } = await admin
      .from("reports")
      .select("id, scope_type, company_id, event_id, kind, name, key, is_active, updated_at")
      .in("company_id", companyIds)
      .order("updated_at", { ascending: false });

    if (error) {
      throw error;
    }

    for (const row of (data ?? []) as ReportRow[]) {
      rowsById.set(row.id, row);
    }
  }

  if (eventIds.length > 0) {
    const { data, error } = await admin
      .from("reports")
      .select("id, scope_type, company_id, event_id, kind, name, key, is_active, updated_at")
      .in("event_id", eventIds)
      .order("updated_at", { ascending: false });

    if (error) {
      throw error;
    }

    for (const row of (data ?? []) as ReportRow[]) {
      rowsById.set(row.id, row);
    }
  }

  return Array.from(rowsById.values()).sort((left, right) => {
    const leftTime = Date.parse(left.updated_at);
    const rightTime = Date.parse(right.updated_at);
    return rightTime - leftTime || left.id - right.id;
  });
}

async function loadReportRuns(reportIds: readonly number[]) {
  if (reportIds.length === 0) {
    return [];
  }

  const { data, error } = await getSupabaseServiceRoleClient()
    .from("report_runs")
    .select(
      "id, report_id, requested_by_user_id, status, row_count, started_at, finished_at, error_message, created_at",
    )
    .in("report_id", reportIds)
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) {
    throw error;
  }

  return (data ?? []) as ReportRunRow[];
}

export const getReportParitySnapshot = cache(
  async ({
    session,
    bootstrap,
  }: ReportParityContext): Promise<ReportParitySnapshot> => {
    const principal = session?.principal ?? bootstrap.principal;
    const payload = session?.rbac ?? bootstrap.payload;
    const accessMode: ReportAccessMode = session ? "session" : "seed";
    const canView = hasAnyPermission(principal, REPORT_VIEW_PERMISSIONS);
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
        accessSummary,
        scopeSummary: "Report parity data is hidden until the user has report access.",
        principalName,
        companyName,
        metrics: {
          reportCount: 0,
          activeReportCount: 0,
          runCount: 0,
          successfulRunCount: 0,
          failedRunCount: 0,
          queuedRunCount: 0,
          coverageCount: 0,
        },
        reports: [],
        runs: [],
        uncoveredReportNames: [],
      };
    }

    const eventRows = await resolveScopedEventRows(payload);
    const companyIds = collectCompanyIdsFromEvents(eventRows);

    const [reportRows, companyRows] = await Promise.all([
      loadScopedReportRows(payload),
      loadCompaniesByIds(companyIds),
    ]);

    const reportIds = reportRows.map((row) => row.id);
    const reportRuns = await loadReportRuns(reportIds);

    const userIds = uniqueNumbers(reportRuns.map((row) => row.requested_by_user_id ?? -1)).filter(
      (value) => value > 0,
    );
    const userRows = await loadUsersByIds(userIds);
    const userNameById = new Map<number, ScopedUserRow>(
      userRows.map((row) => [row.id, row]),
    );

    const companyNameById = new Map<number, ScopedCompanyRow>(
      companyRows.map((row) => [row.id, row]),
    );

    const eventById = new Map<number, ScopedEventRow>(
      eventRows.map((row) => [row.id, row]),
    );

    const latestRunByReportId = new Map<number, ReportRunRow>();
    for (const run of reportRuns) {
      if (!latestRunByReportId.has(run.report_id)) {
        latestRunByReportId.set(run.report_id, run);
      }
    }

    const activeReports = reportRows.filter((report) => report.is_active);
    const successfulRunCount = reportRuns.filter((run) => run.status === "success").length;
    const failedRunCount = reportRuns.filter((run) => run.status === "failed").length;
    const queuedRunCount = reportRuns.filter((run) => run.status === "queued").length;
    const coverageCount = activeReports.filter((report) => {
      const latest = latestRunByReportId.get(report.id);
      return latest?.status === "success";
    }).length;

    const reports = reportRows.map((row) => {
      const event = row.event_id ? eventById.get(row.event_id) : null;
      const latestRun = latestRunByReportId.get(row.id) ?? null;

      return {
        id: row.id,
        scopeLabel:
          row.scope_type === "system"
            ? "System"
            : row.scope_type === "company"
              ? "Company"
              : "Event",
        eventName: event?.name ?? null,
        companyName: row.company_id
          ? companyNameById.get(row.company_id)?.name ??
            bootstrap.companies.find((company) => company.id === row.company_id)?.name ??
            `Company ${row.company_id}`
          : event
            ? companyNameById.get(event.company_id)?.name ??
              `Company ${event.company_id}`
            : null,
        name: row.name,
        key: row.key,
        kind: row.kind,
        isActive: row.is_active,
        updatedAt: row.updated_at,
        latestRunStatus: latestRun?.status ?? null,
        latestRunAt: latestRun?.finished_at ?? latestRun?.created_at ?? null,
        latestRunRowCount: latestRun?.row_count ?? null,
      };
    });

    const uncoveredReportNames = reports
      .filter((report) => report.isActive && report.latestRunStatus !== "success")
      .map((report) => report.name);

    const runs = reportRuns.map((run) => {
      const report = reportRows.find((item) => item.id === run.report_id);
      const event = report?.event_id ? eventById.get(report.event_id) : null;

      return {
        id: run.id,
        reportName: report?.name ?? `Report ${run.report_id}`,
        reportKey: report?.key ?? `report-${run.report_id}`,
        eventName: event?.name ?? null,
        companyName: report?.company_id
          ? companyNameById.get(report.company_id)?.name ??
            bootstrap.companies.find((company) => company.id === report.company_id)?.name ??
            `Company ${report.company_id}`
          : event
            ? companyNameById.get(event.company_id)?.name ??
              `Company ${event.company_id}`
            : null,
        requestedByName: findUserDisplayName(userNameById, run.requested_by_user_id),
        status: run.status,
        rowCount: run.row_count,
        startedAt: run.started_at,
        finishedAt: run.finished_at,
        errorMessage: run.error_message,
        createdAt: run.created_at,
      };
    });

    return {
      accessMode,
      canView,
      accessSummary,
      scopeSummary:
        reportRows.length > 0
          ? `${reportRows.length} reports in scope · ${reportRuns.length} recent runs`
          : "No report scope resolved for parity comparison",
      principalName,
      companyName,
      metrics: {
        reportCount: reportRows.length,
        activeReportCount: activeReports.length,
        runCount: reportRuns.length,
        successfulRunCount,
        failedRunCount,
        queuedRunCount,
        coverageCount,
      },
      reports,
      runs,
      uncoveredReportNames,
    };
  },
);
