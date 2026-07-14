import { completeOfflineBatchAction } from "@/app/sync-offline/actions";
import { MetricCard, SectionCard, ToneBadge } from "@/components/rbac/panels";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CheckinRuntimeSnapshot } from "@/lib/checkin/runtime";

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

function toneForStatus(status: string) {
  const normalized = status.toLowerCase();

  if (
    normalized.includes("active") ||
    normalized.includes("checked") ||
    normalized.includes("completed") ||
    normalized.includes("success") ||
    normalized.includes("running")
  ) {
    return "emerald" as const;
  }

  if (normalized.includes("pending") || normalized.includes("queued") || normalized.includes("processing")) {
    return "amber" as const;
  }

  if (normalized.includes("failed") || normalized.includes("error") || normalized.includes("revoked")) {
    return "rose" as const;
  }

  return "slate" as const;
}

export function OfflineSyncPanel({
  snapshot,
}: {
  snapshot: CheckinRuntimeSnapshot;
}) {
  if (!snapshot.canManageSync) {
    return (
      <SectionCard
        title="Offline sync"
        description="Offline sync data stays hidden until the user has operator permissions."
        action={<ToneBadge tone="rose">Restricted</ToneBadge>}
      >
        <div className="rounded-[16px] border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-100">
          This lane uses `checkin.run` as the fallback permission for sync
          operations. A dedicated `checkin.manage` grant can be introduced
          later without changing the screen contract.
        </div>
      </SectionCard>
    );
  }

  return (
    <div className="space-y-4">
      <SectionCard
        title="Offline sync"
        description="Use this surface to clear the offline batch queue and keep scanner devices in sync."
        action={<ToneBadge tone="amber">Sync queue</ToneBadge>}
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <MetricCard
            label="Devices"
            value={snapshot.metrics.deviceCount}
            note={`${snapshot.metrics.activeDeviceCount} active scanner devices in scope`}
            tone="violet"
          />
          <MetricCard
            label="Offline batches"
            value={snapshot.metrics.offlineBatchCount}
            note={`${snapshot.metrics.queuedBatchCount} queued or processing batches`}
            tone="amber"
          />
          <MetricCard
            label="Check-ins"
            value={snapshot.metrics.checkinCount}
            note="All persisted check-in rows in the current scope"
            tone="emerald"
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Queued offline batches"
        description="Mark a batch as synced once the offline payload has been processed."
      >
        {snapshot.offlineBatches.length === 0 ? (
          <div className="rounded-[16px] border border-stroke bg-stone-50 p-4 text-sm text-dark-5 dark:border-dark-3 dark:bg-slate-950/60 dark:text-dark-6">
            No offline batches are available in the current scope.
          </div>
        ) : (
          <div className="overflow-hidden rounded-[16px] border border-stroke dark:border-dark-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rows</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {snapshot.offlineBatches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-dark dark:text-white">
                          Batch #{batch.id}
                        </p>
                        <p className="text-sm text-dark-5 dark:text-dark-6">
                          {batch.companyName} · {batch.eventName}
                        </p>
                        <p className="text-sm text-dark-5 dark:text-dark-6">
                          Device {batch.deviceName} · {batch.assignedOperatorName ?? "n/a"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <ToneBadge tone={toneForStatus(batch.status)}>{batch.status}</ToneBadge>
                    </TableCell>
                    <TableCell>{batch.rowCount}</TableCell>
                    <TableCell>
                      {batch.status === "completed" ? (
                        <ToneBadge tone="emerald">Synced</ToneBadge>
                      ) : (
                        <form action={completeOfflineBatchAction}>
                          <input type="hidden" name="batch_id" value={batch.id} />
                          <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-opacity-90"
                          >
                            Mark synced
                          </button>
                        </form>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <div className="grid gap-4 xl:grid-cols-2">
        <SectionCard
          title="Device heartbeat"
          description="Scanner devices keep sync timestamps here."
        >
          {snapshot.devices.length === 0 ? (
            <div className="rounded-[16px] border border-stroke bg-stone-50 p-4 text-sm text-dark-5 dark:border-dark-3 dark:bg-slate-950/60 dark:text-dark-6">
              No devices are available in the current scope.
            </div>
          ) : (
            <div className="overflow-hidden rounded-[16px] border border-stroke dark:border-dark-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sync</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {snapshot.devices.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-dark dark:text-white">
                            {device.deviceName}
                          </p>
                          <p className="text-sm text-dark-5 dark:text-dark-6">
                            {device.companyName} · {device.eventName}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <ToneBadge tone={toneForStatus(device.status)}>{device.status}</ToneBadge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-dark-5 dark:text-dark-6">
                          Last sync {formatDateTime(device.lastSyncAt)} · last seen {formatDateTime(device.lastSeenAt)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Background jobs"
          description="Queued and running background jobs are the bridge to the eventual worker layer."
        >
          {snapshot.jobs.length === 0 ? (
            <div className="rounded-[16px] border border-stroke bg-stone-50 p-4 text-sm text-dark-5 dark:border-dark-3 dark:bg-slate-950/60 dark:text-dark-6">
              No background jobs are visible in the current scope.
            </div>
          ) : (
            <div className="overflow-hidden rounded-[16px] border border-stroke dark:border-dark-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Scope</TableHead>
                    <TableHead>Scheduled</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {snapshot.jobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-dark dark:text-white">
                            {job.kind}
                          </p>
                          <p className="text-sm text-dark-5 dark:text-dark-6">
                            {job.actorName ?? "n/a"} · attempts {job.attempts}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <ToneBadge tone={toneForStatus(job.status)}>{job.status}</ToneBadge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-dark dark:text-white">
                            {job.companyName ?? "n/a"}
                          </p>
                          <p className="text-sm text-dark-5 dark:text-dark-6">
                            {job.eventName ?? "System-wide"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-dark-5 dark:text-dark-6">
                          {formatDateTime(job.scheduledAt)}
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
    </div>
  );
}
