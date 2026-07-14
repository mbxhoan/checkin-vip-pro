import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/legal-document";
import { getLocale } from "@/lib/i18n/server";
import { getMessages } from "@/lib/i18n/messages";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const messages = getMessages(locale);

  return {
    title: messages.nav.items.privacyPolicy,
  };
}

export default async function PrivacyPolicyPage() {
  const locale = await getLocale();

  const copy =
    locale === "vi"
      ? {
          title: "Chính sách quyền riêng tư",
          summary:
            "Giltech Solutions Check-in thu thập dữ liệu tài khoản, công ty, sự kiện và sử dụng để vận hành các luồng theo tenant, phân quyền và audit trail runtime.",
          effectiveDate: "7 tháng 4, 2026",
          owner: "Giltech Solutions",
          sections: [
            {
              title: "Dữ liệu chúng tôi xử lý",
              bullets: [
                "Dữ liệu định danh tài khoản từ Supabase Auth và các bản ghi hồ sơ public được liên kết.",
                "Dữ liệu vận hành như company, event, client, check-in, campaign, print và audit records.",
                "Log hệ thống và log sử dụng cần thiết để duy trì dịch vụ an toàn và ổn định.",
              ],
            },
            {
              title: "Cách dữ liệu được sử dụng",
              bullets: [
                "Để xác thực người dùng, xác định RBAC scope và hiển thị dữ liệu workspace phù hợp.",
                "Để thực thi các luồng check-in, báo cáo, nhắn tin, in ấn và hỗ trợ.",
                "Để chẩn đoán lỗi, theo dõi job runs và bảo vệ ranh giới tenant.",
              ],
            },
            {
              title: "Lưu trữ và chia sẻ",
              bullets: [
                "Dữ liệu vận hành được lưu giữ trong thời gian cần thiết cho dịch vụ đã đăng ký và yêu cầu kiểm toán.",
                "Quyền truy cập dữ liệu khách hàng chỉ dành cho nhân sự được ủy quyền, tích hợp dịch vụ và nhà cung cấp hạ tầng cần thiết để vận hành nền tảng.",
              ],
            },
          ],
          footerNote:
            "Chính sách quyền riêng tư cần được rà soát với cấu hình hosting, email và tuân thủ pháp lý cuối cùng trước khi phát hành công khai.",
        }
      : {
          title: "Privacy Policy",
          summary:
            "Giltech Solutions Check-in collects account, company, event, and usage data to operate tenant-aware workflows, permissions, and runtime audit trails.",
          effectiveDate: "April 7, 2026",
          owner: "Giltech Solutions",
          sections: [
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
          ],
          footerNote:
            "The privacy policy should be reviewed with the final hosting, email, and legal compliance setup before public launch.",
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
