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

export const ARCHIVED_DEMO_ROUTE_GROUPS = [
  {
    title: "Dashboard demos",
    tone: "blue",
    description:
      "Existing chart, table, and calendar dashboards stay available for comparison and component reuse.",
    routes: [
      { label: "Calendar", href: "/calendar" },
      { label: "Charts", href: "/charts/basic-chart" },
      { label: "Tables", href: "/tables" },
    ],
  },
  {
    title: "Form demos",
    tone: "violet",
    description:
      "Layout and form examples remain available for future admin flows and complex editors.",
    routes: [
      { label: "Form elements", href: "/forms/form-elements" },
      { label: "Form layout", href: "/forms/form-layout" },
    ],
  },
  {
    title: "UI element demos",
    tone: "emerald",
    description:
      "Alert and button examples can be reused when building sharper product interactions.",
    routes: [
      { label: "Alerts", href: "/ui-elements/alerts" },
      { label: "Buttons", href: "/ui-elements/buttons" },
    ],
  },
  {
    title: "Archived account templates",
    tone: "amber",
    description:
      "Profile and settings surfaces stay archived for reference and later adaptation.",
    routes: [
      { label: "Profile", href: "/profile" },
      { label: "Settings", href: "/pages/settings" },
    ],
  },
] as const satisfies readonly ArchivedDemoRouteGroup[];

export const ARCHIVED_COMPONENT_FAMILIES = [
  {
    title: "Charts",
    tone: "blue",
    note: "Reusable visual patterns for KPIs and dashboard sections.",
  },
  {
    title: "Tables",
    tone: "violet",
    note: "Row-based layouts, skeletons, and summary tables.",
  },
  {
    title: "Form elements",
    tone: "emerald",
    note: "Inputs, date pickers, selects, radios, switches, and validation UI.",
  },
  {
    title: "UI elements",
    tone: "amber",
    note: "Alerts, buttons, badges, and small composition primitives.",
  },
  {
    title: "Shell components",
    tone: "teal",
    note: "Sidebar, header, breadcrumbs, card layout, and responsive scaffolding.",
  },
  {
    title: "Home demo blocks",
    tone: "slate",
    note: "The existing home-page demo widgets stay available for reuse and comparison.",
  },
] as const satisfies readonly ArchivedComponentFamily[];

export const ARCHIVED_DEMO_ROUTE_COUNT = ARCHIVED_DEMO_ROUTE_GROUPS.reduce(
  (count, group) => count + group.routes.length,
  0,
);

export const ARCHIVED_COMPONENT_FAMILY_COUNT =
  ARCHIVED_COMPONENT_FAMILIES.length;
