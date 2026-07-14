import { MetricCard, SectionCard, ToneBadge } from "@/components/rbac/panels";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AudienceDashboardSnapshot } from "@/lib/audience/dashboard";

type Tone = "slate" | "emerald" | "amber" | "rose" | "blue" | "violet" | "teal";

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

function toneForStatus(status: string): Tone {
  const normalized = status.toLowerCase();

  if (
    normalized.includes("active") ||
    normalized.includes("checked") ||
    normalized.includes("registered") ||
    normalized.includes("published")
  ) {
    return "emerald";
  }

  if (
    normalized.includes("pending") ||
    normalized.includes("draft") ||
    normalized.includes("queued")
  ) {
    return "amber";
  }

  if (
    normalized.includes("cancel") ||
    normalized.includes("error") ||
    normalized.includes("inactive") ||
    normalized.includes("suspend")
  ) {
    return "rose";
  }

  return "slate";
}

export function AudienceDashboard({
  snapshot,
}: {
  snapshot: AudienceDashboardSnapshot;
}) {
  if (!snapshot.canView) {
    return (
      <SectionCard
        title="Audience read model"
        description="Client, check-in, and report data stay hidden until the user has audience permissions."
        action={<ToneBadge tone="rose">Restricted</ToneBadge>}
      >
        <div className="rounded-[16px] border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-100">
          This lane uses `client.view`, `checkin.view`, or `report.view` as the
          permission gate. Grant one of those permissions to surface the live
          operational snapshot.
        </div>
      </SectionCard>
    );
  }

  return (
    <div className="space-y-4">
      <SectionCard
        title="Audience read model"
        description="This snapshot is assembled server-side from public.clients, public.checkins, public.scanner_devices, and public.reports."
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
            <p className="text-sm text-dark-4 dark:text-dark-6">Coverage</p>
            <p className="mt-2 text-lg font-semibold text-dark dark:text-white">
              {snapshot.metrics.eventCount} events
            </p>
            <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
              {snapshot.metrics.reportCount} reports and {snapshot.metrics.deviceCount} devices available
            </p>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          label="Events"
          value={snapshot.metrics.eventCount}
          note="Scoped event records available to the current principal"
          tone="blue"
        />
        <MetricCard
          label="Clients"
          value={snapshot.metrics.clientCount}
          note="Client intake rows in the accessible event scope"
          tone="emerald"
        />
        <MetricCard
          label="Checked in"
          value={snapshot.metrics.checkedInClientCount}
          note="Clients with a non-null checked_in_at timestamp"
          tone="teal"
        />
        <MetricCard
          label="Pending"
          value={snapshot.metrics.pendingClientCount}
          note="Clients still waiting for check-in"
          tone="amber"
        />
        <MetricCard
          label="Devices"
          value={snapshot.metrics.deviceCount}
          note={`${snapshot.metrics.activeDeviceCount} active scanner devices in scope`}
          tone="violet"
        />
        <MetricCard
          label="Reports"
          value={snapshot.metrics.reportCount}
          note={`${snapshot.metrics.activeReportCount} active reports visible to the lane`}
          tone="slate"
        />
      </div>

      <SectionCard
        title="Event scope"
        description="Company-scoped access expands to child events so the audience lane sees the same operational boundary as the legacy app."
      >
        {snapshot.events.length === 0 ? (
          <div className="rounded-[16px] border border-stroke bg-stone-50 p-4 text-sm text-dark-5 dark:border-dark-3 dark:bg-slate-950/60 dark:text-dark-6">
            No event rows were resolved for the current scope.
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {snapshot.events.map((event) => (
              <div
                key={event.id}
                className="rounded-[18px] border border-stroke p-3.5 dark:border-dark-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-dark-4 dark:text-dark-6">
                      {event.companyName}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-dark dark:text-white">
                      {event.name}
                    </h3>
                  </div>
                  <ToneBadge tone={toneForStatus(event.status)}>
                    {event.status}
                  </ToneBadge>
                </div>

                <p className="mt-3 text-sm text-dark-5 dark:text-dark-6">
                  {event.code ?? "No event code"} · {event.visibility}
                </p>
                <p className="mt-1 text-sm leading-6 text-dark-5 dark:text-dark-6">
                  {formatShortDateTime(event.startsAt)} - {formatShortDateTime(event.endsAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <div className="grid gap-4 xl:grid-cols-2">
        <SectionCard
          title="Client intake"
          description="Recent client rows in the accessible scope, ready for migration parity and future CRUD screens."
        >
          {snapshot.clients.length === 0 ? (
            <div className="rounded-[16px] border border-stroke bg-stone-50 p-4 text-sm text-dark-5 dark:border-dark-3 dark:bg-slate-950/60 dark:text-dark-6">
              No client rows are available in the current scope.
            </div>
          ) : (
            <div className="overflow-hidden rounded-[16px] border border-stroke dark:border-dark-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ticket</TableHead>
                    <TableHead>Check-in</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {snapshot.clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-dark dark:text-white">
                            {client.fullName}
                          </p>
                          <p className="text-sm text-dark-5 dark:text-dark-6">
                            {client.eventName} · {client.companyName}
                          </p>
                          <p className="text-xs text-dark-5 dark:text-dark-6">
                            {client.email ?? "No email"} · {client.phone ?? "No phone"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <ToneBadge tone={toneForStatus(client.status)}>
                          {client.status}
                        </ToneBadge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium text-dark dark:text-white">
                            {client.ticketType ?? "No ticket"}
                          </p>
                          <p className="text-xs text-dark-5 dark:text-dark-6">
                            {client.registrationCode ?? "No registration code"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-dark-5 dark:text-dark-6">
                        {formatDateTime(client.checkedInAt)}
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
          description="Check-in runtime rows show the live operational flow that still needs a dedicated rewrite."
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
                    <TableHead>Check-in</TableHead>
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
                          <p className="text-xs text-dark-5 dark:text-dark-6">
                            {checkin.scannerDeviceName ?? "No scanner"} · {checkin.checkedByName ?? "Unassigned"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <ToneBadge tone={toneForStatus(checkin.status)}>
                          {checkin.status}
                        </ToneBadge>
                      </TableCell>
                      <TableCell>
                        <ToneBadge tone="blue">{checkin.method}</ToneBadge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium text-dark dark:text-white">
                            {formatDateTime(checkin.happenedAt)}
                          </p>
                          <p className="text-xs text-dark-5 dark:text-dark-6">
                            {checkin.note ?? "No operator note"}
                          </p>
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

      <div className="grid gap-4 xl:grid-cols-2">
        <SectionCard
          title="Scanner devices"
          description="Scanner hardware and sync state stay separate from the check-in UI so field operators can move quickly."
        >
          {snapshot.devices.length === 0 ? (
            <div className="rounded-[16px] border border-stroke bg-stone-50 p-4 text-sm text-dark-5 dark:border-dark-3 dark:bg-slate-950/60 dark:text-dark-6">
              No scanner devices are available in the current scope.
            </div>
          ) : (
            <div className="overflow-hidden rounded-[16px] border border-stroke dark:border-dark-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sync</TableHead>
                    <TableHead>Operator</TableHead>
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
                            {device.eventName} · {device.companyName}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <ToneBadge tone={toneForStatus(device.status)}>
                          {device.status}
                        </ToneBadge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium text-dark dark:text-white">
                            {formatShortDateTime(device.lastSyncAt)}
                          </p>
                          <p className="text-xs text-dark-5 dark:text-dark-6">
                            Last seen {formatShortDateTime(device.lastSeenAt)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-dark-5 dark:text-dark-6">
                        {device.assignedOperatorName ?? "Unassigned"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Report catalog"
          description="Reports are grouped by scope so company and event level access keep their meaning in the new app."
        >
          {snapshot.reports.length === 0 ? (
            <div className="rounded-[16px] border border-stroke bg-stone-50 p-4 text-sm text-dark-5 dark:border-dark-3 dark:bg-slate-950/60 dark:text-dark-6">
              No reports are visible in the current scope.
            </div>
          ) : (
            <div className="overflow-hidden rounded-[16px] border border-stroke dark:border-dark-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report</TableHead>
                    <TableHead>Scope</TableHead>
                    <TableHead>Kind</TableHead>
                    <TableHead>Active</TableHead>
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
                            {report.companyName ?? report.eventName ?? "Global scope"}
                          </p>
                          <p className="text-xs text-dark-5 dark:text-dark-6">
                            {report.key}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <ToneBadge tone={report.scopeLabel === "Event" ? "blue" : report.scopeLabel === "Company" ? "violet" : "emerald"}>
                          {report.scopeLabel}
                        </ToneBadge>
                      </TableCell>
                      <TableCell className="text-sm text-dark-5 dark:text-dark-6">
                        {report.kind}
                      </TableCell>
                      <TableCell>
                        <ToneBadge tone={report.isActive ? "emerald" : "rose"}>
                          {report.isActive ? "active" : "inactive"}
                        </ToneBadge>
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
