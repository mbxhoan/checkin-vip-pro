import { recordCheckinAction } from "@/app/checkin/actions";
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
    normalized.includes("completed") ||
    normalized.includes("success") ||
    normalized.includes("running")
  ) {
    return "emerald" as const;
  }

  if (normalized.includes("pending") || normalized.includes("queued")) {
    return "amber" as const;
  }

  if (normalized.includes("failed") || normalized.includes("error") || normalized.includes("revoked")) {
    return "rose" as const;
  }

  return "slate" as const;
}

function getPrimaryDeviceId(snapshot: CheckinRuntimeSnapshot) {
  return snapshot.devices.find((device) => device.status === "active")?.id ?? snapshot.devices[0]?.id ?? null;
}

export function CheckinRuntimePanel({
  snapshot,
}: {
  snapshot: CheckinRuntimeSnapshot;
}) {
  if (!snapshot.canView) {
    return (
      <SectionCard
        title="Check-in runtime"
        description="Check-in data stays hidden until the user has operator permissions."
        action={<ToneBadge tone="rose">Restricted</ToneBadge>}
      >
        <div className="rounded-[16px] border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-100">
          This lane uses `checkin.view` or `checkin.run` as the base
          permission. `checkin.run` unlocks the scan action and sync queue.
        </div>
      </SectionCard>
    );
  }

  const defaultEventId = snapshot.events[0]?.id ?? null;
  const defaultDeviceId = getPrimaryDeviceId(snapshot);
  const pendingClients = snapshot.clients.filter((client) => client.status !== "checked_in");

  return (
    <div className="space-y-4">
      <SectionCard
        title="Check-in runtime"
        description="This screen is the operator console for scan actions, live queue review, and device heartbeat."
        action={
          <ToneBadge tone={snapshot.accessMode === "session" ? "emerald" : "amber"}>
            {snapshot.accessMode === "session" ? "Authenticated session" : "Seed snapshot"}
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
            <p className="text-sm text-dark-4 dark:text-dark-6">Runtime readiness</p>
            <p className="mt-2 text-lg font-semibold text-dark dark:text-white">
              {snapshot.metrics.deviceCount} devices
            </p>
            <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
              {snapshot.metrics.offlineBatchCount} offline batches and {snapshot.metrics.checkinCount} check-ins
            </p>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Events"
          value={snapshot.metrics.eventCount}
          note="Scoped events available for operator actions"
          tone="blue"
        />
        <MetricCard
          label="Clients"
          value={snapshot.metrics.clientCount}
          note="Recent client rows ready for scan"
          tone="emerald"
        />
        <MetricCard
          label="Checked in"
          value={snapshot.metrics.checkedInClientCount}
          note="Clients already processed"
          tone="teal"
        />
        <MetricCard
          label="Pending"
          value={snapshot.metrics.pendingClientCount}
          note="Clients waiting in the queue"
          tone="amber"
        />
        <MetricCard
          label="Devices"
          value={snapshot.metrics.deviceCount}
          note={`${snapshot.metrics.activeDeviceCount} active scanner devices`}
          tone="violet"
        />
        <MetricCard
          label="Offline batches"
          value={snapshot.metrics.offlineBatchCount}
          note={`${snapshot.metrics.queuedBatchCount} queued or processing batches`}
          tone="slate"
        />
      </div>

      <SectionCard
        title="Quick scan"
        description="Queue a check-in by registration code or client record."
      >
        {!snapshot.canRunCheckin ? (
          <div className="rounded-[16px] border border-stroke bg-stone-50 p-4 text-sm text-dark-5 dark:border-dark-3 dark:bg-slate-950/60 dark:text-dark-6">
            Check-in actions are hidden until the principal has `checkin.run`.
          </div>
        ) : (
          <form action={recordCheckinAction} className="grid gap-3 xl:grid-cols-[1.2fr_1fr]">
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-dark dark:text-white">
                  Event
                </span>
                <select
                  name="event_id"
                  defaultValue={defaultEventId ?? ""}
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                  required
                >
                  <option value="">-- select event --</option>
                  {snapshot.events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.companyName} · {event.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-dark dark:text-white">
                  Registration code
                </span>
                <input
                  name="registration_code"
                  placeholder="NW-0001"
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-dark dark:text-white">
                  Scanner device
                </span>
                <select
                  name="scanner_device_id"
                  defaultValue={defaultDeviceId ?? ""}
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                >
                  <option value="">-- select device --</option>
                  {snapshot.devices.map((device) => (
                    <option key={device.id} value={device.id}>
                      {device.deviceName} · {device.eventName}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-dark dark:text-white">
                  Note
                </span>
                <textarea
                  name="note"
                  rows={3}
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                  placeholder="Optional scan note"
                />
              </label>
            </div>

            <div className="rounded-[18px] border border-stroke p-3.5 dark:border-dark-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-dark dark:text-white">
                  Quick check-in
                </h3>
                <ToneBadge tone="emerald">QR</ToneBadge>
              </div>
              <p className="mt-2 text-sm leading-6 text-dark-5 dark:text-dark-6">
                Submit the registration code to create a live `checkins` row and
                update the matching client status.
              </p>
              <button
                type="submit"
                className="mt-3 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 font-medium text-white transition hover:bg-opacity-90"
              >
                Check in attendee
              </button>
            </div>
          </form>
        )}
      </SectionCard>

      <div className="grid gap-4 xl:grid-cols-2">
        <SectionCard
          title="Pending queue"
          description="These clients still need operator processing. Each row can be checked in directly."
        >
          {pendingClients.length === 0 ? (
            <div className="rounded-[16px] border border-stroke bg-stone-50 p-4 text-sm text-dark-5 dark:border-dark-3 dark:bg-slate-950/60 dark:text-dark-6">
              No pending clients are visible in the current scope.
            </div>
          ) : (
            <div className="overflow-hidden rounded-[16px] border border-stroke dark:border-dark-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-dark dark:text-white">
                            {client.fullName}
                          </p>
                          <p className="text-sm text-dark-5 dark:text-dark-6">
                            {client.registrationCode ?? "No code"} · {client.ticketType ?? "n/a"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <ToneBadge tone={toneForStatus(client.status)}>{client.status}</ToneBadge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-dark dark:text-white">
                            {client.eventName}
                          </p>
                          <p className="text-sm text-dark-5 dark:text-dark-6">
                            {client.companyName}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <form action={recordCheckinAction}>
                          <input type="hidden" name="event_id" value={client.eventId} />
                          <input type="hidden" name="client_id" value={client.id} />
                          {defaultDeviceId ? (
                            <input type="hidden" name="scanner_device_id" value={defaultDeviceId} />
                          ) : null}
                          <input type="hidden" name="method" value="qr" />
                          <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-opacity-90"
                          >
                            Check in
                          </button>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Recent check-ins"
          description="The latest check-in records already persisted in the runtime tables."
        >
          {snapshot.checkins.length === 0 ? (
            <div className="rounded-[16px] border border-stroke bg-stone-50 p-4 text-sm text-dark-5 dark:border-dark-3 dark:bg-slate-950/60 dark:text-dark-6">
              No check-in rows are available in the current scope.
            </div>
          ) : (
            <div className="overflow-hidden rounded-[16px] border border-stroke dark:border-dark-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {snapshot.checkins.map((checkin) => (
                    <TableRow key={checkin.id}>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-dark dark:text-white">
                            {checkin.clientName}
                          </p>
                          <p className="text-sm text-dark-5 dark:text-dark-6">
                            {checkin.eventName} · {checkin.companyName}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <ToneBadge tone={toneForStatus(checkin.status)}>{checkin.status}</ToneBadge>
                      </TableCell>
                      <TableCell>{checkin.method}</TableCell>
                      <TableCell>{formatDateTime(checkin.happenedAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </SectionCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <SectionCard
          title="Scanner devices"
          description="Device heartbeat, sync timestamps, and operator assignment."
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
                          Last sync {formatShortDateTime(device.lastSyncAt)} · last seen {formatShortDateTime(device.lastSeenAt)}
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
          title="Offline batches"
          description="These batches show the current offline sync queue and are mirrored on the /sync-offline surface."
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
                    <TableHead>Synced</TableHead>
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
                        </div>
                      </TableCell>
                      <TableCell>
                        <ToneBadge tone={toneForStatus(batch.status)}>{batch.status}</ToneBadge>
                      </TableCell>
                      <TableCell>{batch.rowCount}</TableCell>
                      <TableCell>
                        <div className="text-sm text-dark-5 dark:text-dark-6">
                          {formatShortDateTime(batch.syncedAt)}
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
