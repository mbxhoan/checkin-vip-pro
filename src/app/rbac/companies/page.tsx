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
import { updateCompanyAction } from "../actions";

export const metadata = {
  title: "RBAC Companies",
  description: "Multi-company RBAC overview for Giltech Solutions Check-in.",
};

const STATUS_OPTIONS = ["active", "draft", "inactive", "suspended", "archived"];
const SUBSCRIPTION_OPTIONS = [
  "trialing",
  "active",
  "past_due",
  "cancelled",
  "expired",
];

export default async function Page() {
  const { companies, subscriptionPlans } = await getRbacAdminSnapshot();

  return (
    <div className="space-y-6">
      <Breadcrumb pageName="RBAC Companies" />

      <SectionCard
        title="Company tenancy"
        description="Mỗi card dưới đây có thể chỉnh trực tiếp company settings, domain và subscription state."
      >
        <div className="overflow-hidden rounded-[16px] border border-stroke dark:border-dark-3">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Events</TableHead>
                <TableHead>Roles</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>
                    <div>
                      <p className="font-semibold text-dark dark:text-white">
                        {company.name}
                      </p>
                      <p className="text-sm text-dark-5 dark:text-dark-6">
                        {company.legalName ?? company.slug} · {company.primaryDomain}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {company.domains.map((domain) => (
                          <ToneBadge
                            key={`${company.id}-${domain.domain}`}
                            tone={domain.isPrimary ? "emerald" : "slate"}
                          >
                            {domain.domain}
                          </ToneBadge>
                        ))}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <ToneBadge tone={company.subscriptionStatus === "active" ? "emerald" : "amber"}>
                        {company.subscriptionStatus ?? "n/a"}
                      </ToneBadge>
                      <span className="text-sm text-dark-5 dark:text-dark-6">
                        {company.planName ?? "No plan"} / {company.planCode ?? "-"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{company.activeUserCount}</TableCell>
                  <TableCell>{company.eventCount}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {company.roleKeys.map((roleKey) => (
                        <ToneBadge key={roleKey} tone="slate">
                          {roleKey}
                        </ToneBadge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <div className="grid gap-4 xl:grid-cols-2">
        {companies.map((company) => (
          <SectionCard
            key={company.id}
            title={`Edit ${company.name}`}
            description="Cập nhật settings của company, domain chính và trạng thái subscription."
          >
            <form action={updateCompanyAction} className="space-y-4">
              <input type="hidden" name="company_id" value={company.id} />
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-dark dark:text-white">
                    Name
                  </span>
                  <input
                    name="name"
                    defaultValue={company.name}
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-dark dark:text-white">
                    Legal name
                  </span>
                  <input
                    name="legal_name"
                    defaultValue={company.legalName ?? ""}
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-dark dark:text-white">
                    Billing email
                  </span>
                  <input
                    name="billing_email"
                    defaultValue={company.billingEmail ?? ""}
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-dark dark:text-white">
                    Contact email
                  </span>
                  <input
                    name="contact_email"
                    defaultValue={company.contactEmail ?? ""}
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-dark dark:text-white">
                    Contact phone
                  </span>
                  <input
                    name="contact_phone"
                    defaultValue={company.contactPhone ?? ""}
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-dark dark:text-white">
                    Primary domain
                  </span>
                  <input
                    name="primary_domain"
                    defaultValue={company.primaryDomain ?? ""}
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-dark dark:text-white">
                    Company status
                  </span>
                  <select
                    name="status"
                    defaultValue={company.status}
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-dark dark:text-white">
                    Subscription status
                  </span>
                  <select
                    name="subscription_status"
                    defaultValue={company.subscriptionStatus ?? "active"}
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                  >
                    {SUBSCRIPTION_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-dark dark:text-white">
                    Subscription plan
                  </span>
                  <select
                    name="plan_code"
                    defaultValue={company.planCode ?? ""}
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                  >
                    <option value="">-- select plan --</option>
                    {subscriptionPlans.map((plan) => (
                      <option key={plan.code} value={plan.code}>
                        {plan.name} ({plan.code})
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="rounded-[14px] border border-stroke p-4 dark:border-dark-3">
                <p className="mb-3 text-sm font-medium text-dark dark:text-white">
                  Domain inventory
                </p>
                <div className="flex flex-wrap gap-2">
                  {company.domains.length > 0 ? (
                    company.domains.map((domain) => (
                      <ToneBadge
                        key={`${company.id}-${domain.domain}-detail`}
                        tone={domain.isPrimary ? "emerald" : domain.isActive ? "blue" : "rose"}
                      >
                        {domain.domain}
                      </ToneBadge>
                    ))
                  ) : (
                    <span className="text-sm text-dark-5 dark:text-dark-6">
                      No domains on record
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-3 font-medium text-white transition hover:bg-opacity-90"
              >
                Save company
              </button>
            </form>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
