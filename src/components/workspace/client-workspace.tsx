import { MetricCard, SectionCard, ToneBadge } from "@/components/rbac/panels";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { queueClientExportAction, queueClientImportAction, saveClientAction } from "@/app/workspace/actions";
import type { WorkspaceClientSnapshot } from "@/lib/workspace/clients";

const CLIENT_STATUS_OPTIONS = [
  "pending",
  "registered",
  "confirmed",
  "checked_in",
  "cancelled",
  "blocked",
];

const CLIENT_SOURCE_OPTIONS = [
  "manual",
  "import",
  "landing_page",
  "api",
  "sync",
];

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
    normalized.includes("registered") ||
    normalized.includes("confirmed") ||
    normalized.includes("completed") ||
    normalized.includes("success")
  ) {
    return "emerald" as const;
  }

  if (
    normalized.includes("pending") ||
    normalized.includes("queued") ||
    normalized.includes("draft")
  ) {
    return "amber" as const;
  }

  if (
    normalized.includes("cancel") ||
    normalized.includes("block") ||
    normalized.includes("failed") ||
    normalized.includes("error")
  ) {
    return "rose" as const;
  }

  return "slate" as const;
}

function ClientEditorCard({
  snapshot,
  client,
}: {
  snapshot: WorkspaceClientSnapshot;
  client: WorkspaceClientSnapshot["clients"][number] | null;
}) {
  const defaultEventId = client?.eventId ?? snapshot.events[0]?.id ?? null;

  return (
    <SectionCard
      title={client ? `Edit ${client.fullName}` : "Create client"}
      description={
        client
          ? "Cập nhật attendee profile, status, và event scope."
          : "Tạo client mới ngay trong workspace lane."
      }
      action={<ToneBadge tone={client ? toneForStatus(client.status) : "teal"}>{client ? client.status : "new"}</ToneBadge>}
    >
      <form action={saveClientAction} className="space-y-3">
        {client ? <input type="hidden" name="client_id" value={client.id} /> : null}

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
              Full name
            </span>
            <input
              name="full_name"
              defaultValue={client?.fullName ?? ""}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
              required
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-dark dark:text-white">
              Registration code
            </span>
            <input
              name="registration_code"
              defaultValue={client?.registrationCode ?? ""}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-dark dark:text-white">
              Email
            </span>
            <input
              name="email"
              defaultValue={client?.email ?? ""}
              type="email"
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-dark dark:text-white">
              Phone
            </span>
            <input
              name="phone"
              defaultValue={client?.phone ?? ""}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-dark dark:text-white">
              Company name
            </span>
            <input
              name="company_name"
              defaultValue={client?.attendeeCompanyName ?? ""}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-dark dark:text-white">
              Ticket type
            </span>
            <input
              name="ticket_type"
              defaultValue={client?.ticketType ?? ""}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-dark dark:text-white">
              Source
            </span>
            <select
              name="source"
              defaultValue={client?.source ?? "manual"}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
            >
              {CLIENT_SOURCE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-dark dark:text-white">
              Status
            </span>
            <select
              name="status"
              defaultValue={client?.status ?? "pending"}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
            >
              {CLIENT_STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-dark dark:text-white">
              Internal notes
            </span>
            <textarea
              name="internal_notes"
              defaultValue={client?.internalNotes ?? ""}
              rows={4}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-3 font-medium text-white transition hover:bg-opacity-90"
          >
            {client ? "Save client" : "Create client"}
          </button>

          {client ? (
            <div className="text-sm text-dark-5 dark:text-dark-6">
              Checked in at {formatDateTime(client.checkedInAt)}
            </div>
          ) : null}
        </div>
      </form>
    </SectionCard>
  );
}

export function ClientWorkspacePanel({
  snapshot,
}: {
  snapshot: WorkspaceClientSnapshot;
}) {
  if (!snapshot.canView) {
    return (
      <SectionCard
        title="Client workspace"
        description="Client data stays hidden until the user has client permissions."
        action={<ToneBadge tone="rose">Restricted</ToneBadge>}
      >
        <div className="rounded-[16px] border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-100">
          This lane uses `client.view` as the base permission. `client.create`,
          `client.update`, `client.import`, and `client.export` unlock the
          write paths.
        </div>
      </SectionCard>
    );
  }

  const defaultEventId = snapshot.events[0]?.id ?? null;

  return (
    <div className="space-y-4">
      <SectionCard
        title="Client workspace"
        description="This screen gives the client module a real workspace: editable records, import/export queue hooks, and backup inventory."
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
            <p className="text-sm text-dark-4 dark:text-dark-6">Import/export</p>
            <p className="mt-2 text-lg font-semibold text-dark dark:text-white">
              {snapshot.metrics.backupCount} backups
            </p>
            <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
              {snapshot.metrics.queuedJobCount} queued jobs in the workspace queue
            </p>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          label="Events"
          value={snapshot.metrics.eventCount}
          note="Scoped event records available to the client lane"
          tone="blue"
        />
        <MetricCard
          label="Clients"
          value={snapshot.metrics.clientCount}
          note="Recent client rows in the accessible scope"
          tone="emerald"
        />
        <MetricCard
          label="Checked in"
          value={snapshot.metrics.checkedInClientCount}
          note="Clients already processed through check-in"
          tone="teal"
        />
        <MetricCard
          label="Pending"
          value={snapshot.metrics.pendingClientCount}
          note="Clients still waiting for operator processing"
          tone="amber"
        />
        <MetricCard
          label="Backups"
          value={snapshot.metrics.backupCount}
          note="Import/export snapshots retained for reuse"
          tone="violet"
        />
        <MetricCard
          label="Queued jobs"
          value={snapshot.metrics.queuedJobCount}
          note="Import and export jobs waiting in the worker queue"
          tone="slate"
        />
      </div>

      <SectionCard
        title="Client editor"
        description="Create a new client or revise a recent record without leaving the workspace lane."
      >
        {!snapshot.canEdit ? (
          <div className="rounded-[16px] border border-stroke bg-stone-50 p-4 text-sm text-dark-5 dark:border-dark-3 dark:bg-slate-950/60 dark:text-dark-6">
            Write access is hidden until the principal has `client.create` or
            `client.update`.
          </div>
        ) : (
          <div className="grid gap-3 xl:grid-cols-2">
            <ClientEditorCard snapshot={snapshot} client={null} />
            {snapshot.clients.slice(0, 3).map((client) => (
              <ClientEditorCard key={client.id} snapshot={snapshot} client={client} />
            ))}
          </div>
        )}
      </SectionCard>

      <div className="grid gap-4 xl:grid-cols-2">
        <SectionCard
          title="Import and export queue"
          description="These buttons queue background jobs so the eventual worker layer can process client imports and exports."
        >
          {!snapshot.canQueueJobs ? (
            <div className="rounded-[16px] border border-stroke bg-stone-50 p-4 text-sm text-dark-5 dark:border-dark-3 dark:bg-slate-950/60 dark:text-dark-6">
              Queue actions are hidden until the principal has `client.import`
              or `client.export`.
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              <form action={queueClientImportAction} className="rounded-[16px] border border-stroke p-3.5 dark:border-dark-3">
                <h3 className="font-semibold text-dark dark:text-white">
                  Queue import preview
                </h3>
                <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
                  Create a queued client import job for the selected event.
                </p>
                <input type="hidden" name="event_id" value={defaultEventId ?? ""} />
                <button
                  type="submit"
                  className="mt-3 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 font-medium text-white transition hover:bg-opacity-90"
                >
                  Queue import job
                </button>
              </form>

              <form action={queueClientExportAction} className="rounded-[16px] border border-stroke p-3.5 dark:border-dark-3">
                <h3 className="font-semibold text-dark dark:text-white">
                  Queue export snapshot
                </h3>
                <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
                  Queue an export job for the currently scoped event.
                </p>
                <input type="hidden" name="event_id" value={defaultEventId ?? ""} />
                <button
                  type="submit"
                  className="mt-3 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 font-medium text-white transition hover:bg-opacity-90"
                >
                  Queue export job
                </button>
              </form>
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Backup inventory"
          description="Client backups preserve import/export history and provide the seed for later bulk operations."
        >
          {snapshot.backups.length === 0 ? (
            <div className="rounded-[16px] border border-stroke bg-stone-50 p-4 text-sm text-dark-5 dark:border-dark-3 dark:bg-slate-950/60 dark:text-dark-6">
              No client backups are available in the current scope.
            </div>
          ) : (
            <div className="overflow-hidden rounded-[16px] border border-stroke dark:border-dark-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Backup</TableHead>
                    <TableHead>Kind</TableHead>
                    <TableHead>Rows</TableHead>
                    <TableHead>Created by</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {snapshot.backups.map((backup) => (
                    <TableRow key={backup.id}>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-dark dark:text-white">
                            {backup.backupName}
                          </p>
                          <p className="text-sm text-dark-5 dark:text-dark-6">
                            {backup.companyName} · {backup.eventName}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <ToneBadge tone={backup.backupKind === "export" ? "emerald" : "blue"}>
                          {backup.backupKind}
                        </ToneBadge>
                      </TableCell>
                      <TableCell>{backup.rowCount}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-dark dark:text-white">
                            {backup.createdByName ?? "n/a"}
                          </p>
                          <p className="text-sm text-dark-5 dark:text-dark-6">
                            {formatDateTime(backup.createdAt)}
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

      <SectionCard
        title="Recent client jobs"
        description="Import and export jobs queued from this workspace are surfaced here for operator review."
      >
        {snapshot.jobs.length === 0 ? (
          <div className="rounded-[16px] border border-stroke bg-stone-50 p-4 text-sm text-dark-5 dark:border-dark-3 dark:bg-slate-950/60 dark:text-dark-6">
            No background jobs are visible in the current client scope.
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
  );
}
