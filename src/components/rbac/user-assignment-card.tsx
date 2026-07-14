"use client";

import { assignUserRoleAction } from "@/app/rbac/actions";
import { ToneBadge } from "@/components/rbac/panels";
import type { AdminUserRow } from "@/lib/rbac/admin-data";
import type { RoleKey } from "@/lib/rbac/roles";
import { useMemo, useState } from "react";

type Option = {
  id: number;
  name: string;
};

type EventOption = {
  id: number;
  name: string;
  companyId: number;
};

type Props = {
  user: AdminUserRow;
  companyOptions: readonly Option[];
  eventOptions: readonly EventOption[];
  roleOptions: readonly { key: RoleKey; name: string }[];
};

const STATUS_OPTIONS = ["active", "invited", "suspended", "revoked", "inactive"];
const SCOPE_OPTIONS = ["system", "company", "event", "self"];

function toNumber(value: string) {
  return value ? Number(value) : null;
}

export function UserAssignmentCard({
  user,
  companyOptions,
  eventOptions,
  roleOptions,
}: Props) {
  const [scopeType, setScopeType] = useState(user.scopeType ?? "company");
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    user.companyId ?? user.defaultCompanyId ?? companyOptions[0]?.id ?? null,
  );
  const [selectedEventId, setSelectedEventId] = useState<number | null>(
    user.eventId ?? null,
  );
  const [selectedRoleKey, setSelectedRoleKey] = useState<RoleKey | "">(
    user.roleKeys[0] ?? roleOptions[0]?.key ?? "",
  );
  const [defaultCompanyId, setDefaultCompanyId] = useState<number | null>(
    user.defaultCompanyId ?? companyOptions[0]?.id ?? null,
  );
  const [membershipStatus, setMembershipStatus] = useState(
    user.membershipStatus ?? "active",
  );

  const filteredEvents = useMemo(() => {
    if (selectedCompanyId == null) {
      return eventOptions;
    }

    return eventOptions.filter((event) => event.companyId === selectedCompanyId);
  }, [eventOptions, selectedCompanyId]);

  const isScopedToCompany = scopeType === "company" || scopeType === "event";
  const isEventScope = scopeType === "event";

  return (
    <div className="rounded-[16px] border border-stroke p-4 dark:border-dark-3">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-dark dark:text-white">
            {user.displayName}
          </p>
          <p className="text-sm text-dark-5 dark:text-dark-6">
            {user.email} · {user.loginApp}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {user.scopeSummaries.length > 0 ? (
            <ToneBadge tone="violet">{user.scopeSummaries.length} scopes</ToneBadge>
          ) : (
            <ToneBadge tone="slate">No scopes</ToneBadge>
          )}
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {user.scopeSummaries.length > 0 ? (
          user.scopeSummaries.map((scope) => (
            <ToneBadge key={`${scope.roleKey}-${scope.label}-${scope.membershipStatus}`} tone="slate">
              {scope.roleKey} · {scope.label} · {scope.membershipStatus}
            </ToneBadge>
          ))
        ) : (
          <span className="text-sm text-dark-5 dark:text-dark-6">
            No assignments yet
          </span>
        )}
      </div>

      <form action={assignUserRoleAction} className="space-y-4">
        <input type="hidden" name="user_id" value={user.id} />

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-dark dark:text-white">
              Role
            </span>
            <select
              name="role_key"
              value={selectedRoleKey}
              onChange={(event) => setSelectedRoleKey(event.target.value as RoleKey)}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
            >
              {roleOptions.map((role) => (
                <option key={role.key} value={role.key}>
                  {role.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-dark dark:text-white">
              Scope type
            </span>
            <select
              name="scope_type"
              value={scopeType}
            onChange={(event) => {
              const nextScopeType = event.target.value;
              setScopeType(nextScopeType);

              if (nextScopeType === "system" || nextScopeType === "self") {
                setSelectedCompanyId(null);
                setSelectedEventId(null);
                return;
              }

              const nextCompanyId = selectedCompanyId ?? companyOptions[0]?.id ?? null;
              if (nextCompanyId != null && selectedCompanyId == null) {
                setSelectedCompanyId(nextCompanyId);
              }

              if (nextScopeType === "event" && nextCompanyId != null) {
                const nextFilteredEvents = eventOptions.filter(
                  (eventOption) => eventOption.companyId === nextCompanyId,
                );
                if (nextFilteredEvents.length > 0) {
                  setSelectedEventId(nextFilteredEvents[0].id);
                }
              }
            }}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
            >
              {SCOPE_OPTIONS.map((scope) => (
                <option key={scope} value={scope}>
                  {scope}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-dark dark:text-white">
              Default company
            </span>
            <select
              name="default_company_id"
              value={defaultCompanyId ?? ""}
              onChange={(event) => setDefaultCompanyId(toNumber(event.target.value))}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
            >
              <option value="">-- select company --</option>
              {companyOptions.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-dark dark:text-white">
              Membership status
            </span>
            <select
              name="membership_status"
              value={membershipStatus}
              onChange={(event) => setMembershipStatus(event.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          {isScopedToCompany ? (
            <label className="space-y-2">
              <span className="text-sm font-medium text-dark dark:text-white">
                Company
              </span>
              <select
                name="company_id"
                value={selectedCompanyId ?? ""}
            onChange={(event) => {
              const nextCompanyId = toNumber(event.target.value);
              setSelectedCompanyId(nextCompanyId);

              if (isEventScope && nextCompanyId != null) {
                const nextFilteredEvents = eventOptions.filter(
                  (eventOption) => eventOption.companyId === nextCompanyId,
                );
                if (
                  nextFilteredEvents.length > 0 &&
                  !nextFilteredEvents.some((eventOption) => eventOption.id === selectedEventId)
                ) {
                  setSelectedEventId(nextFilteredEvents[0].id);
                }
              }
            }}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
              >
                <option value="">-- select company --</option>
                {companyOptions.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <input type="hidden" name="company_id" value="" />
          )}

          {isEventScope ? (
            <label className="space-y-2">
              <span className="text-sm font-medium text-dark dark:text-white">
                Event
              </span>
              <select
                name="event_id"
                value={selectedEventId ?? ""}
                onChange={(event) => setSelectedEventId(toNumber(event.target.value))}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                disabled={selectedCompanyId == null}
              >
                <option value="">-- select event --</option>
                {filteredEvents.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <input type="hidden" name="event_id" value="" />
          )}
        </div>

        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-3 font-medium text-white transition hover:bg-opacity-90"
        >
          Save assignment
        </button>
      </form>
    </div>
  );
}
