import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { SectionCard, ToneBadge } from "@/components/rbac/panels";
import { getRbacBootstrapContext, getRoleLabel } from "@/lib/rbac/bootstrap";
import { PERMISSION_GROUPS } from "@/lib/rbac/permissions";

export const metadata = {
  title: "RBAC Permissions",
  description: "Permission registry coverage for Giltech Solutions Check-in.",
};

export default function Page() {
  const { permissionGroups } = getRbacBootstrapContext();

  return (
    <div className="space-y-6">
      <Breadcrumb pageName="RBAC Permissions" />

      <SectionCard
        title="Permission registry"
        description="Each resource group below mirrors the permission keys used by server actions, RLS, and admin screens."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {permissionGroups.map((group) => (
            <div
              key={group.resource}
              className="rounded-[16px] border border-stroke p-4 dark:border-dark-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-dark dark:text-white">
                    {group.resource}
                  </p>
                  <p className="text-sm text-dark-5 dark:text-dark-6">
                    {group.permissions.length} permissions
                  </p>
                </div>
                <ToneBadge tone="blue">{group.roleCount} roles</ToneBadge>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {group.roleKeys.map((roleKey) => (
                  <ToneBadge key={roleKey} tone="slate">
                    {getRoleLabel(roleKey)}
                  </ToneBadge>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.permissions.map((permissionKey) => (
                  <ToneBadge key={permissionKey} tone="violet">
                    {permissionKey}
                  </ToneBadge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Registry snapshot"
        description="This view is useful when you add a new feature surface and need to confirm the permission key already exists."
      >
        <div className="space-y-4">
          {Object.entries(PERMISSION_GROUPS).map(([resource, permissions]) => (
            <div
              key={resource}
              className="rounded-[16px] border border-stroke p-4 dark:border-dark-3"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-dark dark:text-white">
                  {resource}
                </p>
                <ToneBadge tone="amber">{permissions.length} keys</ToneBadge>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {permissions.map((permissionKey) => (
                  <ToneBadge key={permissionKey} tone="slate">
                    {permissionKey}
                  </ToneBadge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
