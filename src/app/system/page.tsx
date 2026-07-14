import { ModuleLanding } from "@/components/shell/module-landing";
import { getAuthSessionBootstrap } from "@/lib/auth/bootstrap";
import { getRbacBootstrapContext } from "@/lib/rbac/bootstrap";
import { getSystemShellLanding } from "@/lib/shell/module-pages";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Shell",
  description:
    "Giltech Solutions Check-in system shell for governance, logs, legal, and integration settings.",
};

export default async function Page() {
  const [session, bootstrap] = await Promise.all([
    getAuthSessionBootstrap(),
    getRbacBootstrapContext(),
  ]);

  return <ModuleLanding {...getSystemShellLanding({ session, bootstrap })} />;
}
