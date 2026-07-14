import { ModuleLanding } from "@/components/shell/module-landing";
import { getAuthSessionBootstrap } from "@/lib/auth/bootstrap";
import { getRbacBootstrapContext } from "@/lib/rbac/bootstrap";
import { getExperienceShellLanding } from "@/lib/shell/module-pages";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience Shell",
  description:
    "Giltech Solutions Check-in experience shell for landing pages, campaigns, and templates.",
};

export default async function Page() {
  const [session, bootstrap] = await Promise.all([
    getAuthSessionBootstrap(),
    getRbacBootstrapContext(),
  ]);

  return <ModuleLanding {...getExperienceShellLanding({ session, bootstrap })} />;
}
