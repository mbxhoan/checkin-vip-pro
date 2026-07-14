import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/legal-document";
import { getLocale } from "@/lib/i18n/server";
import { getMessages } from "@/lib/i18n/messages";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const messages = getMessages(locale);

  return {
    title: messages.nav.items.termsOfUse,
  };
}

export default async function TermsOfUsePage() {
  const locale = await getLocale();

  const copy =
    locale === "vi"
      ? {
          title: "Điều khoản sử dụng",
          summary:
            "Các điều khoản này mô tả cách Giltech Solutions Check-in được truy cập và sử dụng trong các luồng công ty, sự kiện và vận hành.",
          effectiveDate: "7 tháng 4, 2026",
          owner: "Giltech Solutions",
          sections: [
            {
              title: "Quyền truy cập dịch vụ",
              bullets: [
                "Người dùng phải xác thực qua các luồng tài khoản được hỗ trợ trước khi truy cập dữ liệu theo tenant.",
                "Quyền truy cập được kiểm soát bằng vai trò, quyền và scope được lưu trong cơ sở dữ liệu của ứng dụng.",
                "Giltech có thể tạm ngưng quyền truy cập vì lý do bảo mật, thanh toán, tuân thủ hoặc lạm dụng.",
              ],
            },
            {
              title: "Sử dụng hợp lệ",
              bullets: [
                "Không dò quét dữ liệu ngoài company hoặc event scope được phân công.",
                "Không can thiệp vào luồng check-in, print, campaign hoặc chatbot.",
                "Không cố vượt qua cơ chế phân quyền phía server hoặc ghi audit log.",
              ],
            },
            {
              title: "Thay đổi dịch vụ",
              bullets: [
                "Giltech có thể cập nhật module, permission và hành vi shell UI trong quá trình replatform.",
                "Ý nghĩa nghiệp vụ cốt lõi của check-in, báo cáo và các luồng vận hành được giữ nguyên trong quá trình di chuyển.",
              ],
            },
          ],
          footerNote:
            "Trang này thuộc Giltech foundation shell và có thể được mở rộng bằng ngôn ngữ pháp lý theo từng khu vực pháp lý sau này.",
        }
      : {
          title: "Terms of Use",
          summary:
            "These terms describe how Giltech Solutions Check-in can be accessed and used across company, event, and operator workflows.",
          effectiveDate: "April 7, 2026",
          owner: "Giltech Solutions",
          sections: [
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
          ],
          footerNote:
            "This page is part of the Giltech foundation shell and can be expanded with jurisdiction-specific legal language later.",
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
