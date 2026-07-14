import { ModuleLanding } from "@/components/shell/module-landing";
import { getAuthSessionBootstrap } from "@/lib/auth/bootstrap";
import { getRbacBootstrapContext } from "@/lib/rbac/bootstrap";
import { getAudienceShellLanding } from "@/lib/shell/module-pages";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audience Shell",
  description:
    "Giltech Solutions Check-in audience shell for client intake, check-in, and reports.",
};

export default async function Page() {
  const [session, bootstrap] = await Promise.all([
    getAuthSessionBootstrap(),
    getRbacBootstrapContext(),
  ]);

  return <ModuleLanding {...getAudienceShellLanding({ session, bootstrap })} />;
}
