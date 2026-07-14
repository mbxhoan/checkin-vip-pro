import type { Metadata } from "next";

import { TemplateVaultPage } from "@/components/template-vault/template-vault-page";

export const metadata: Metadata = {
  title: "Template Vault",
  description:
    "Archived demo routes and reusable template components for Giltech Solutions Check-in.",
};

export default function Page() {
  return <TemplateVaultPage />;
}
