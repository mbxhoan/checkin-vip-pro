import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/legal-document";

export const metadata: Metadata = {
  title: "Terms of use",
};

export default function TermsOfUsePage() {
  return (
    <LegalDocument
      title="Terms of Use"
      summary="These terms describe how Giltech Solutions Check-in can be accessed and used across company, event, and operator workflows."
      effectiveDate="April 7, 2026"
      owner="Giltech Solutions"
      sections={[
        {
          title: "Service access",
          bullets: [
            "Users must authenticate through supported account flows before accessing tenant-aware data.",
            "Access is governed by role, permission, and scope assignments maintained in the app database.",
            "Giltech may suspend access for security, billing, compliance, or misuse concerns.",
          ],
        },
        {
          title: "Acceptable use",
          bullets: [
            "Do not probe data outside your assigned company or event scope.",
            "Do not interfere with check-in, print, campaign, or chatbot workflows.",
            "Do not attempt to bypass server-side authorization or audit logging.",
          ],
        },
        {
          title: "Service changes",
          bullets: [
            "Giltech may update modules, permissions, and UI shell behavior as part of ongoing replatform work.",
            "Critical business meaning for check-in, reporting, and operational flows is preserved during migration.",
          ],
        },
      ]}
      footerNote="This page is part of the Giltech foundation shell and can be expanded with jurisdiction-specific legal language later."
    />
  );
}
