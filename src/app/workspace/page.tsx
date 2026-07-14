import { ModuleLanding } from "@/components/shell/module-landing";
import { getAuthSessionBootstrap } from "@/lib/auth/bootstrap";
import { getRbacBootstrapContext } from "@/lib/rbac/bootstrap";
import { getWorkspaceShellLanding } from "@/lib/shell/module-pages";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workspace Shell",
  description:
    "Giltech Solutions Check-in workspace shell for companies, events, and access settings.",
};

export default async function Page() {
  const [session, bootstrap] = await Promise.all([
    getAuthSessionBootstrap(),
    getRbacBootstrapContext(),
  ]);

  return <ModuleLanding {...getWorkspaceShellLanding({ session, bootstrap })} />;
}
