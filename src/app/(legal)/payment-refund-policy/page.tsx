import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/legal-document";

export const metadata: Metadata = {
  title: "Payment refund policy",
};

export default function PaymentRefundPolicyPage() {
  return (
    <LegalDocument
      title="Payment & Refund Policy"
      summary="Subscription and billing terms for Giltech Solutions Check-in should stay consistent with the target SaaS billing model and company-level ownership."
      effectiveDate="April 7, 2026"
      owner="Giltech Solutions"
      sections={[
        {
          title: "Billing",
          bullets: [
            "Subscription plans are assigned at the company level and can control feature access, user limits, and event limits.",
            "Billing metadata should remain attached to company subscriptions so support teams can trace the active plan and payment state.",
          ],
        },
        {
          title: "Refunds",
          bullets: [
            "Refund decisions must follow the signed customer agreement, payment processor terms, and internal approval process.",
            "Operational usage already delivered for a live event or completed billing cycle may be treated as non-refundable unless the contract says otherwise.",
          ],
        },
        {
          title: "Cancellations",
          bullets: [
            "Canceling a subscription should preserve historical data and audit trails while revoking access according to the company status flow.",
            "If payment automation is enabled later, webhook failures and retries should be logged in integration and job tables.",
          ],
        },
      ]}
      footerNote="Finalize this policy with the billing provider and legal review before external publication."
    />
  );
}
