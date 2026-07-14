import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { SectionCard, ToneBadge } from "@/components/rbac/panels";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getRbacAdminSnapshot } from "@/lib/rbac/admin-data";
import { UserAssignmentCard } from "@/components/rbac/user-assignment-card";

export const metadata = {
  title: "RBAC Users",
  description: "Users, memberships, and role assignments for Giltech Solutions Check-in.",
};

export default async function Page() {
  const { users, companyOptions, eventOptions, roleOptions } = await getRbacAdminSnapshot();

  return (
    <div className="space-y-6">
      <Breadcrumb pageName="RBAC Users" />

      <SectionCard
        title="User membership list"
        description="Mỗi user card cho phép gán role + scope mà không phải rời khỏi console."
      >
        <div className="overflow-hidden rounded-[16px] border border-stroke dark:border-dark-3">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead>Last seen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <p className="font-semibold text-dark dark:text-white">
                        {user.displayName}
                      </p>
                      <p className="text-sm text-dark-5 dark:text-dark-6">
                        {user.email} · {user.loginApp}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {user.scopeSummaries.slice(0, 3).map((scope) => (
                          <ToneBadge key={`${user.id}-${scope.roleKey}-${scope.label}`} tone="slate">
                            {scope.roleKey} · {scope.label}
                          </ToneBadge>
                        ))}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.companyName ?? "-"}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {user.roleKeys.map((roleKey) => (
                        <ToneBadge key={roleKey} tone={user.isSuperAdmin ? "emerald" : "blue"}>
                          {roleKey}
                        </ToneBadge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {user.scopeSummaries.length > 0 ? (
                        user.scopeSummaries.map((scope) => (
                          <ToneBadge key={`${user.id}-${scope.roleKey}-${scope.scopeType}`} tone="violet">
                            {scope.scopeType} · {scope.membershipStatus}
                          </ToneBadge>
                        ))
                      ) : (
                        <ToneBadge tone="slate">n/a</ToneBadge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{user.lastSeenAt ?? "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <div className="grid gap-4 xl:grid-cols-2">
        {users.map((user) => (
          <UserAssignmentCard
            key={user.id}
            user={user}
            companyOptions={companyOptions}
            eventOptions={eventOptions}
            roleOptions={roleOptions}
          />
        ))}
      </div>
    </div>
  );
}
