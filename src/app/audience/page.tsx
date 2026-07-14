import { ModuleLanding } from "@/components/shell/module-landing";
import { AudienceDashboard } from "@/components/audience/audience-dashboard";
import { getAuthSessionBootstrap } from "@/lib/auth/bootstrap";
import { getAudienceDashboardSnapshot } from "@/lib/audience/dashboard";
import { getRbacBootstrapContext } from "@/lib/rbac/bootstrap";
import { getAudienceShellLanding } from "@/lib/shell/module-pages";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audience Shell",
  description:
    "Giltech Solutions Check-in audience shell for client intake and the operational read-model.",
};

export default async function Page() {
  const [session, bootstrap] = await Promise.all([
    getAuthSessionBootstrap(),
    getRbacBootstrapContext(),
  ]);
  const snapshot = await getAudienceDashboardSnapshot({ session, bootstrap });

  return (
    <div className="space-y-4">
      <ModuleLanding {...getAudienceShellLanding({ session, bootstrap })} />
      <AudienceDashboard snapshot={snapshot} />
    </div>
  );
}
