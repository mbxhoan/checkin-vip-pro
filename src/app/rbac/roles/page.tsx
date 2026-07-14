import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { SectionCard, ToneBadge } from "@/components/rbac/panels";
import { getRbacAdminSnapshot } from "@/lib/rbac/admin-data";
import { updateRoleAction } from "../actions";

export const metadata = {
  title: "RBAC Roles",
  description: "Role templates and permission coverage for Giltech Solutions Check-in.",
};

const SCOPE_OPTIONS = ["system", "company", "event", "self"];

export default async function Page() {
  const { roles, permissionGroups } = await getRbacAdminSnapshot();

  return (
    <div className="space-y-6">
      <Breadcrumb pageName="RBAC Roles" />

      <SectionCard
        title="Role template registry"
        description="Mỗi role card hỗ trợ chỉnh tên, scope mặc định, trạng thái hoạt động và permission matrix."
      >
        <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {roles.map((role) => (
            <div
              key={role.key}
              className="rounded-[16px] border border-stroke p-4 dark:border-dark-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-dark dark:text-white">
                    {role.name}
                  </p>
                  <p className="text-sm text-dark-5 dark:text-dark-6">
                    {role.description}
                  </p>
                </div>
                <ToneBadge tone={role.isSystemRole ? "emerald" : "blue"}>
                  {role.userCount} users
                </ToneBadge>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <ToneBadge tone="violet">{role.defaultScope}</ToneBadge>
                <ToneBadge tone={role.isActive ? "emerald" : "rose"}>
                  {role.permissionCount} permissions
                </ToneBadge>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {role.permissionKeys.slice(0, 8).map((permissionKey) => (
                  <ToneBadge key={permissionKey} tone="slate">
                    {permissionKey}
                  </ToneBadge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="space-y-4">
        {roles.map((role) => (
          <SectionCard
            key={role.key}
            title={`Edit role ${role.name}`}
            description="Cập nhật role metadata và replace toàn bộ permission set trong một lần submit."
          >
            <form action={updateRoleAction} className="space-y-5">
              <input type="hidden" name="role_key" value={role.key} />
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-dark dark:text-white">
                    Role name
                  </span>
                  <input
                    name="name"
                    defaultValue={role.name}
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-dark dark:text-white">
                    Default scope
                  </span>
                  <select
                    name="default_scope"
                    defaultValue={role.defaultScope}
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                  >
                    {SCOPE_OPTIONS.map((scope) => (
                      <option key={scope} value={scope}>
                        {scope}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-medium text-dark dark:text-white">
                    Description
                  </span>
                  <textarea
                    name="description"
                    defaultValue={role.description ?? ""}
                    className="min-h-[96px] w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                  />
                </label>
              </div>

              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_active"
                  defaultChecked={role.isActive}
                  className="size-4 rounded border-stroke text-primary focus:ring-primary dark:border-dark-3"
                />
                <span className="text-sm font-medium text-dark dark:text-white">
                  Active role
                </span>
              </label>

              <div className="space-y-4">
                {permissionGroups.map((group) => (
                  <div
                    key={group.resource}
                    className="rounded-[14px] border border-stroke p-4 dark:border-dark-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-dark dark:text-white">
                        {group.resource}
                      </p>
                      <ToneBadge tone="amber">
                        {group.permissionKeys.length} permissions
                      </ToneBadge>
                    </div>
                    <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                      {group.permissionKeys.map((permissionKey) => (
                        <label
                          key={permissionKey}
                          className="inline-flex items-center gap-2 rounded-lg border border-stroke px-3 py-2 dark:border-dark-3"
                        >
                          <input
                            type="checkbox"
                            name="permission_keys"
                            value={permissionKey}
                            defaultChecked={role.permissionKeys.includes(permissionKey)}
                            className="size-4 rounded border-stroke text-primary focus:ring-primary dark:border-dark-3"
                          />
                          <span className="text-sm text-dark dark:text-white">
                            {permissionKey}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-3 font-medium text-white transition hover:bg-opacity-90"
              >
                Save role
              </button>
            </form>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
