import { ModuleLanding } from "@/components/shell/module-landing";
import { CheckinRuntimePanel } from "@/components/checkin/checkin-runtime";
import { getAuthSessionBootstrap } from "@/lib/auth/bootstrap";
import { getCheckinRuntimeSnapshot } from "@/lib/checkin/runtime";
import { getRbacBootstrapContext } from "@/lib/rbac/bootstrap";
import { getCheckinRuntimeLanding } from "@/lib/shell/module-pages";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Check-in Runtime",
  description:
    "Giltech Solutions Check-in operator runtime for scan actions and live queue processing.",
};

export default async function Page() {
  const [session, bootstrap] = await Promise.all([
    getAuthSessionBootstrap(),
    getRbacBootstrapContext(),
  ]);
  const snapshot = await getCheckinRuntimeSnapshot({ session, bootstrap });

  return (
    <div className="space-y-4">
      <ModuleLanding {...getCheckinRuntimeLanding({ session, bootstrap })} />
      <CheckinRuntimePanel snapshot={snapshot} />
    </div>
  );
}
