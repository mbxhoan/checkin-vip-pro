import { ModuleLanding } from "@/components/shell/module-landing";
import { ClientWorkspacePanel } from "@/components/workspace/client-workspace";
import { getAuthSessionBootstrap } from "@/lib/auth/bootstrap";
import { getWorkspaceClientSnapshot } from "@/lib/workspace/clients";
import { getRbacBootstrapContext } from "@/lib/rbac/bootstrap";
import { getWorkspaceClientsLanding } from "@/lib/shell/module-pages";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Workspace",
  description:
    "Giltech Solutions Check-in client workspace for CRUD, backup inventory, and import/export queue hooks.",
};

export default async function Page() {
  const [session, bootstrap] = await Promise.all([
    getAuthSessionBootstrap(),
    getRbacBootstrapContext(),
  ]);
  const snapshot = await getWorkspaceClientSnapshot({ session, bootstrap });

  return (
    <div className="space-y-4">
      <ModuleLanding {...getWorkspaceClientsLanding({ session, bootstrap })} />
      <ClientWorkspacePanel snapshot={snapshot} />
    </div>
  );
}
