import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/legal-document";
import { getLocale } from "@/lib/i18n/server";
import { getMessages } from "@/lib/i18n/messages";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const messages = getMessages(locale);

  return {
    title: messages.nav.items.refundPolicy,
  };
}

export default async function PaymentRefundPolicyPage() {
  const locale = await getLocale();

  const copy =
    locale === "vi"
      ? {
          title: "Chính sách thanh toán và hoàn tiền",
          summary:
            "Điều khoản thanh toán và hoàn tiền cho Giltech Solutions Check-in cần giữ nhất quán với mô hình SaaS mục tiêu và quyền sở hữu theo company.",
          effectiveDate: "7 tháng 4, 2026",
          owner: "Giltech Solutions",
          sections: [
            {
              title: "Thanh toán",
              bullets: [
                "Gói thuê bao được gán ở cấp company và có thể điều khiển quyền truy cập tính năng, giới hạn người dùng và giới hạn sự kiện.",
                "Metadata thanh toán nên được gắn với subscription của company để đội hỗ trợ có thể truy vết gói hiện tại và trạng thái thanh toán.",
              ],
            },
            {
              title: "Hoàn tiền",
              bullets: [
                "Quyết định hoàn tiền phải tuân theo hợp đồng đã ký, điều khoản của cổng thanh toán và quy trình phê duyệt nội bộ.",
                "Phần sử dụng nghiệp vụ đã được cung cấp cho một sự kiện đang chạy hoặc một chu kỳ thanh toán đã hoàn tất có thể không được hoàn tiền trừ khi hợp đồng quy định khác.",
              ],
            },
            {
              title: "Hủy dịch vụ",
              bullets: [
                "Việc hủy subscription phải giữ nguyên dữ liệu lịch sử và audit trail trong khi thu hồi quyền truy cập theo luồng trạng thái company.",
                "Nếu sau này bật tự động hóa thanh toán, lỗi webhook và lần thử lại cần được ghi trong bảng tích hợp và job.",
              ],
            },
          ],
          footerNote:
            "Hãy hoàn tất chính sách này cùng nhà cung cấp thanh toán và rà soát pháp lý trước khi công bố ra bên ngoài.",
        }
      : {
          title: "Payment & Refund Policy",
          summary:
            "Subscription and billing terms for Giltech Solutions Check-in should stay consistent with the target SaaS billing model and company-level ownership.",
          effectiveDate: "April 7, 2026",
          owner: "Giltech Solutions",
          sections: [
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
          ],
          footerNote:
            "Finalize this policy with the billing provider and legal review before external publication.",
        };

  return (
    <LegalDocument
      title={copy.title}
      summary={copy.summary}
      effectiveDate={copy.effectiveDate}
      owner={copy.owner}
      sections={copy.sections}
      footerNote={copy.footerNote}
    />
  );
}
