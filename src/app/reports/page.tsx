import { ModuleLanding } from "@/components/shell/module-landing";
import { ReportParityPanel } from "@/components/reports/report-parity";
import { getAuthSessionBootstrap } from "@/lib/auth/bootstrap";
import { getReportParitySnapshot } from "@/lib/reports/parity";
import { getRbacBootstrapContext } from "@/lib/rbac/bootstrap";
import { getReportsShellLanding } from "@/lib/shell/module-pages";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reports",
  description:
    "Giltech Solutions Check-in reports parity surface for catalog coverage and execution history.",
};

export default async function Page() {
  const [session, bootstrap] = await Promise.all([
    getAuthSessionBootstrap(),
    getRbacBootstrapContext(),
  ]);
  const snapshot = await getReportParitySnapshot({ session, bootstrap });

  return (
    <div className="space-y-4">
      <ModuleLanding {...getReportsShellLanding({ session, bootstrap })} />
      <ReportParityPanel snapshot={snapshot} />
    </div>
  );
}
