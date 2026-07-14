import { ModuleLanding } from "@/components/shell/module-landing";
import { OfflineSyncPanel } from "@/components/checkin/offline-sync";
import { getAuthSessionBootstrap } from "@/lib/auth/bootstrap";
import { getCheckinRuntimeSnapshot } from "@/lib/checkin/runtime";
import { getRbacBootstrapContext } from "@/lib/rbac/bootstrap";
import { getOfflineSyncLanding } from "@/lib/shell/module-pages";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offline Sync",
  description:
    "Giltech Solutions Check-in offline sync surface for batch reconciliation and device heartbeat.",
};

export default async function Page() {
  const [session, bootstrap] = await Promise.all([
    getAuthSessionBootstrap(),
    getRbacBootstrapContext(),
  ]);
  const snapshot = await getCheckinRuntimeSnapshot({ session, bootstrap });

  return (
    <div className="space-y-4">
      <ModuleLanding {...getOfflineSyncLanding({ session, bootstrap })} />
      <OfflineSyncPanel snapshot={snapshot} />
    </div>
  );
}
