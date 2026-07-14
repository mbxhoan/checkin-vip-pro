import { ModuleLanding } from "@/components/shell/module-landing";
import { getAuthSessionBootstrap } from "@/lib/auth/bootstrap";
import { getRbacBootstrapContext } from "@/lib/rbac/bootstrap";
import { getEngagementShellLanding } from "@/lib/shell/module-pages";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Engagement Shell",
  description:
    "Giltech Solutions Check-in engagement shell for lucky draw, chatbot, and print runtime.",
};

export default async function Page() {
  const [session, bootstrap] = await Promise.all([
    getAuthSessionBootstrap(),
    getRbacBootstrapContext(),
  ]);

  return <ModuleLanding {...getEngagementShellLanding({ session, bootstrap })} />;
}
