import { type Locale } from "@/lib/i18n/messages";

export type VaultTone =
  | "slate"
  | "emerald"
  | "amber"
  | "rose"
  | "blue"
  | "violet"
  | "teal";

export interface ArchivedDemoRouteGroup {
  title: string;
  tone: VaultTone;
  description: string;
  routes: readonly {
    label: string;
    href: string;
  }[];
}

export interface ArchivedComponentFamily {
  title: string;
  tone: VaultTone;
  note: string;
}

export function getArchivedDemoRouteGroups(
  locale: Locale,
): readonly ArchivedDemoRouteGroup[] {
  const vi = locale === "vi";

  return [
    {
      title: vi ? "Demo dashboard" : "Dashboard demos",
      tone: "blue",
      description: vi
        ? "Các dashboard chart, table và calendar hiện có vẫn có thể dùng để đối chiếu và tái sử dụng component."
        : "Existing chart, table, and calendar dashboards stay available for comparison and component reuse.",
      routes: [
        { label: vi ? "Lịch" : "Calendar", href: "/calendar" },
        { label: vi ? "Biểu đồ" : "Charts", href: "/charts/basic-chart" },
        { label: vi ? "Bảng" : "Tables", href: "/tables" },
      ],
    },
    {
      title: vi ? "Demo form" : "Form demos",
      tone: "violet",
      description: vi
        ? "Các ví dụ layout và form vẫn có để dùng cho các luồng admin và editor phức tạp trong tương lai."
        : "Layout and form examples remain available for future admin flows and complex editors.",
      routes: [
        { label: vi ? "Thành phần form" : "Form elements", href: "/forms/form-elements" },
        { label: vi ? "Bố cục form" : "Form layout", href: "/forms/form-layout" },
      ],
    },
    {
      title: vi ? "Demo UI element" : "UI element demos",
      tone: "emerald",
      description: vi
        ? "Mẫu alert và button có thể tái sử dụng khi xây dựng các tương tác sắc nét hơn cho sản phẩm."
        : "Alert and button examples can be reused when building sharper product interactions.",
      routes: [
        { label: vi ? "Cảnh báo" : "Alerts", href: "/ui-elements/alerts" },
        { label: vi ? "Nút bấm" : "Buttons", href: "/ui-elements/buttons" },
      ],
    },
    {
      title: vi ? "Template tài khoản lưu trữ" : "Archived account templates",
      tone: "amber",
      description: vi
        ? "Các màn profile và settings được lưu trữ để tham chiếu và điều chỉnh sau này."
        : "Profile and settings surfaces stay archived for reference and later adaptation.",
      routes: [
        { label: vi ? "Hồ sơ" : "Profile", href: "/profile" },
        { label: vi ? "Cài đặt" : "Settings", href: "/pages/settings" },
      ],
    },
  ] as const;
}

export function getArchivedComponentFamilies(
  locale: Locale,
): readonly ArchivedComponentFamily[] {
  const vi = locale === "vi";

  return [
    {
      title: vi ? "Biểu đồ" : "Charts",
      tone: "blue",
      note: vi
        ? "Mẫu trực quan tái sử dụng cho KPI và các khu vực dashboard."
        : "Reusable visual patterns for KPIs and dashboard sections.",
    },
    {
      title: vi ? "Bảng" : "Tables",
      tone: "violet",
      note: vi
        ? "Các layout theo dòng, skeleton và bảng tổng hợp."
        : "Row-based layouts, skeletons, and summary tables.",
    },
    {
      title: vi ? "Thành phần form" : "Form elements",
      tone: "emerald",
      note: vi
        ? "Input, date picker, select, radio, switch và UI validation."
        : "Inputs, date pickers, selects, radios, switches, and validation UI.",
    },
    {
      title: vi ? "Thành phần UI" : "UI elements",
      tone: "amber",
      note: vi
        ? "Alert, button, badge và các primitive nhỏ để ghép giao diện."
        : "Alerts, buttons, badges, and small composition primitives.",
    },
    {
      title: vi ? "Thành phần shell" : "Shell components",
      tone: "teal",
      note: vi
        ? "Sidebar, header, breadcrumb, bố cục card và scaffolding responsive."
        : "Sidebar, header, breadcrumbs, card layout, and responsive scaffolding.",
    },
    {
      title: vi ? "Khối trang chủ demo" : "Home demo blocks",
      tone: "slate",
      note: vi
        ? "Các widget trang chủ demo hiện có vẫn còn để tái sử dụng và đối chiếu."
        : "The existing home-page demo widgets stay available for reuse and comparison.",
    },
  ] as const;
}

export const ARCHIVED_DEMO_ROUTE_COUNT = getArchivedDemoRouteGroups("en").reduce(
  (count, group) => count + group.routes.length,
  0,
);

export const ARCHIVED_COMPONENT_FAMILY_COUNT =
  getArchivedComponentFamilies("en").length;

