import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/legal-document";

export const metadata: Metadata = {
  title: "Privacy policy",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      summary="Giltech Solutions Check-in collects account, company, event, and usage data to operate tenant-aware workflows, permissions, and runtime audit trails."
      effectiveDate="April 7, 2026"
      owner="Giltech Solutions"
      sections={[
        {
          title: "Data we process",
          bullets: [
            "Account identity data from Supabase Auth and mapped public profile records.",
            "Operational data such as company, event, client, check-in, campaign, print, and audit records.",
            "Usage and system logs needed to keep the service reliable and secure.",
          ],
        },
        {
          title: "How data is used",
          bullets: [
            "To authenticate users, resolve RBAC scopes, and show the correct workspace data.",
            "To execute check-in, reporting, messaging, print, and support workflows.",
            "To diagnose errors, monitor job runs, and protect tenant boundaries.",
          ],
        },
        {
          title: "Retention and sharing",
          bullets: [
            "Operational data is retained as long as needed for the subscribed service and audit requirements.",
            "Access to customer data is limited to authorized staff, service integrations, and infrastructure providers needed to run the platform.",
          ],
        },
      ]}
      footerNote="The privacy policy should be reviewed with the final hosting, email, and legal compliance setup before public launch."
    />
  );
}
