import { MetricCard, SectionCard, ToneBadge } from "@/components/rbac/panels";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ReportParitySnapshot } from "@/lib/reports/parity";

function formatDateTime(value: string | null) {
  if (!value) {
    return "n/a";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function formatShortDateTime(value: string | null) {
  if (!value) {
    return "n/a";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function toneForStatus(status: string) {
  const normalized = status.toLowerCase();

  if (
    normalized.includes("active") ||
    normalized.includes("checked") ||
    normalized.includes("success") ||
    normalized.includes("completed")
  ) {
    return "emerald" as const;
  }

  if (normalized.includes("queued") || normalized.includes("running")) {
    return "amber" as const;
  }

  if (normalized.includes("failed") || normalized.includes("error")) {
    return "rose" as const;
  }

  return "slate" as const;
}

export function ReportParityPanel({
  snapshot,
}: {
  snapshot: ReportParitySnapshot;
}) {
  if (!snapshot.canView) {
    return (
      <SectionCard
        id="report-parity"
        title="Report parity"
        description="Report parity data stays hidden until the user has report permissions."
        action={<ToneBadge tone="rose">Restricted</ToneBadge>}
      >
        <div className="rounded-[16px] border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-100">
          This lane uses `report.view` as the base permission for parity
          snapshots and report run history.
        </div>
      </SectionCard>
    );
  }

  const coverageLabel = `${snapshot.metrics.coverageCount}/${snapshot.metrics.activeReportCount || 0} active reports with successful runs`;

  return (
    <div className="space-y-4">
      <SectionCard
        id="report-parity"
        title="Report parity snapshot"
        description="This section pairs the live report catalog with run history so parity review is visible before the UX/UI rewrite."
        action={
          <ToneBadge tone={snapshot.metrics.failedRunCount > 0 ? "rose" : "emerald"}>
            {snapshot.metrics.failedRunCount > 0 ? "Review needed" : "Parity ready"}
          </ToneBadge>
        }
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-[16px] border border-stroke p-3.5 dark:border-dark-3">
            <p className="text-sm text-dark-4 dark:text-dark-6">Principal</p>
            <p className="mt-2 text-lg font-semibold text-dark dark:text-white">
              {snapshot.principalName}
            </p>
            <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
              {snapshot.companyName}
            </p>
          </div>

          <div className="rounded-[16px] border border-stroke p-3.5 dark:border-dark-3">
            <p className="text-sm text-dark-4 dark:text-dark-6">Scope</p>
            <p className="mt-2 text-lg font-semibold text-dark dark:text-white">
              {snapshot.accessSummary}
            </p>
            <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
              {snapshot.scopeSummary}
            </p>
          </div>

          <div className="rounded-[16px] border border-stroke p-3.5 dark:border-dark-3">
            <p className="text-sm text-dark-4 dark:text-dark-6">Coverage</p>
            <p className="mt-2 text-lg font-semibold text-dark dark:text-white">
              {coverageLabel}
            </p>
            <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
              Active reports, latest runs, and failure state are tracked here.
            </p>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          label="Reports"
          value={snapshot.metrics.reportCount}
          note="Scoped report definitions available in the live model"
          tone="blue"
        />
        <MetricCard
          label="Active reports"
          value={snapshot.metrics.activeReportCount}
          note="Enabled report definitions that should have successful coverage"
          tone="emerald"
        />
        <MetricCard
          label="Runs"
          value={snapshot.metrics.runCount}
          note="Recent report execution history"
          tone="violet"
        />
        <MetricCard
          label="Successful runs"
          value={snapshot.metrics.successfulRunCount}
          note="Completed runs ready for parity comparison"
          tone="emerald"
        />
        <MetricCard
          label="Failed runs"
          value={snapshot.metrics.failedRunCount}
          note="Runs still requiring investigation"
          tone="rose"
        />
        <MetricCard
          label="Queued runs"
          value={snapshot.metrics.queuedRunCount}
          note="Reports waiting in the execution queue"
          tone="amber"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <SectionCard
          title="Coverage by report"
          description="Each row shows the report definition and the latest execution state."
        >
          {snapshot.reports.length === 0 ? (
            <div className="rounded-[16px] border border-stroke bg-stone-50 p-4 text-sm text-dark-5 dark:border-dark-3 dark:bg-slate-950/60 dark:text-dark-6">
              No reports are available in the current scope.
            </div>
          ) : (
            <div className="overflow-hidden rounded-[16px] border border-stroke dark:border-dark-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report</TableHead>
                    <TableHead>Scope</TableHead>
                    <TableHead>Latest run</TableHead>
                    <TableHead>Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {snapshot.reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-dark dark:text-white">
                            {report.name}
                          </p>
                          <p className="text-sm text-dark-5 dark:text-dark-6">
                            {report.key} · {report.kind}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <ToneBadge tone={report.isActive ? "emerald" : "slate"}>
                              {report.isActive ? "active" : "inactive"}
                            </ToneBadge>
                            <ToneBadge tone="slate">{report.scopeLabel}</ToneBadge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-dark dark:text-white">
                            {report.companyName ?? "n/a"}
                          </p>
                          <p className="text-sm text-dark-5 dark:text-dark-6">
                            {report.eventName ?? "System-wide"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <ToneBadge tone={toneForStatus(report.latestRunStatus ?? "queued")}>
                            {report.latestRunStatus ?? "no run"}
                          </ToneBadge>
                          <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
                            {report.latestRunRowCount ?? "n/a"} rows · {formatShortDateTime(report.latestRunAt)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{formatDateTime(report.updatedAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Parity notes"
          description="These notes highlight where the current snapshot already matches and where the legacy compare flow still needs work."
        >
          <div className="space-y-4">
            <div className="rounded-[16px] border border-stroke p-4 dark:border-dark-3">
              <p className="text-sm text-dark-4 dark:text-dark-6">Coverage status</p>
              <p className="mt-2 text-lg font-semibold text-dark dark:text-white">
                {coverageLabel}
              </p>
              <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
                Latest successful run history is already visible for the seeded
                attendance report.
              </p>
            </div>

            <div className="rounded-[16px] border border-stroke p-4 dark:border-dark-3">
              <p className="text-sm text-dark-4 dark:text-dark-6">Reports awaiting success</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {snapshot.uncoveredReportNames.length > 0 ? (
                  snapshot.uncoveredReportNames.map((name) => (
                    <ToneBadge key={name} tone="amber">
                      {name}
                    </ToneBadge>
                  ))
                ) : (
                  <ToneBadge tone="emerald">All active reports covered</ToneBadge>
                )}
              </div>
            </div>

            <div className="rounded-[16px] border border-stroke p-4 dark:border-dark-3">
              <p className="text-sm text-dark-4 dark:text-dark-6">Parity reminder</p>
              <p className="mt-2 text-sm leading-6 text-dark-5 dark:text-dark-6">
                Legacy comparison is still required before pilot cutover, but the
                runtime snapshot now exposes the exact data needed for the diff.
              </p>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Recent report runs"
        description="A live history of report executions, requested users, and result state."
      >
        {snapshot.runs.length === 0 ? (
          <div className="rounded-[16px] border border-stroke bg-stone-50 p-4 text-sm text-dark-5 dark:border-dark-3 dark:bg-slate-950/60 dark:text-dark-6">
            No report run history is available in the current scope.
          </div>
        ) : (
          <div className="overflow-hidden rounded-[16px] border border-stroke dark:border-dark-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested by</TableHead>
                  <TableHead>Rows</TableHead>
                  <TableHead>Finished</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {snapshot.runs.map((run) => (
                  <TableRow key={run.id}>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-dark dark:text-white">
                          {run.reportName}
                        </p>
                        <p className="text-sm text-dark-5 dark:text-dark-6">
                          {run.reportKey}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <ToneBadge tone={toneForStatus(run.status)}>{run.status}</ToneBadge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-dark dark:text-white">
                          {run.requestedByName ?? "n/a"}
                        </p>
                        <p className="text-sm text-dark-5 dark:text-dark-6">
                          {run.companyName ?? "n/a"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{run.rowCount ?? "n/a"}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm text-dark-5 dark:text-dark-6">
                          {formatDateTime(run.finishedAt ?? run.startedAt)}
                        </p>
                        {run.errorMessage ? (
                          <p className="mt-1 text-sm text-rose-600 dark:text-rose-400">
                            {run.errorMessage}
                          </p>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
