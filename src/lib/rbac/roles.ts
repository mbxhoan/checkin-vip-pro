import type { AppScopeType } from "./types";
import {
  PERMISSION_GROUPS,
  PERMISSION_KEYS,
  type PermissionKey,
} from "./permissions";

export const ROLE_KEYS = [
  "system_admin",
  "company_admin",
  "event_manager",
  "report_analyst",
  "content_operator",
  "checkin_operator",
  "scanner_device",
  "support_agent",
] as const;

export type RoleKey = (typeof ROLE_KEYS)[number];

export interface RoleTemplate {
  key: RoleKey;
  name: string;
  description: string;
  defaultScope: AppScopeType;
  isSystemRole: boolean;
  permissions: readonly PermissionKey[];
}

export const ROLE_TEMPLATES = [
  {
    key: "system_admin",
    name: "System Admin",
    description: "Cross-company administration",
    defaultScope: "system",
    isSystemRole: true,
    permissions: PERMISSION_KEYS,
  },
  {
    key: "company_admin",
    name: "Company Admin",
    description: "Company administration role",
    defaultScope: "company",
    isSystemRole: false,
    permissions: [
      ...PERMISSION_GROUPS.company,
      ...PERMISSION_GROUPS.user,
      ...PERMISSION_GROUPS.event,
      ...PERMISSION_GROUPS.client,
      ...PERMISSION_GROUPS.checkin,
      ...PERMISSION_GROUPS.report,
      ...PERMISSION_GROUPS.landing_page,
      ...PERMISSION_GROUPS.campaign,
      ...PERMISSION_GROUPS.email_template,
      ...PERMISSION_GROUPS.label,
      ...PERMISSION_GROUPS.card,
      ...PERMISSION_GROUPS.lucky_draw,
      ...PERMISSION_GROUPS.media,
      "chatbot.history.view",
    ],
  },
  {
    key: "event_manager",
    name: "Event Manager",
    description: "Event operations role",
    defaultScope: "event",
    isSystemRole: false,
    permissions: [
      ...PERMISSION_GROUPS.event,
      ...PERMISSION_GROUPS.client,
      ...PERMISSION_GROUPS.checkin,
      ...PERMISSION_GROUPS.report,
      "campaign.view",
      "campaign.create",
      "campaign.update",
    ],
  },
  {
    key: "report_analyst",
    name: "Report Analyst",
    description: "Read-only analytics role",
    defaultScope: "event",
    isSystemRole: false,
    permissions: [
      ...PERMISSION_GROUPS.report,
      "client.view",
      "checkin.view",
      "campaign.view",
    ],
  },
  {
    key: "content_operator",
    name: "Content Operator",
    description: "Content and communications role",
    defaultScope: "company",
    isSystemRole: false,
    permissions: [
      ...PERMISSION_GROUPS.landing_page,
      ...PERMISSION_GROUPS.campaign,
      "email_template.view",
      ...PERMISSION_GROUPS.label,
      ...PERMISSION_GROUPS.card,
      ...PERMISSION_GROUPS.media,
    ],
  },
  {
    key: "checkin_operator",
    name: "Check-in Operator",
    description: "Check-in runtime role",
    defaultScope: "event",
    isSystemRole: false,
    permissions: [
      "client.view",
      "checkin.run",
      "checkin.view",
      "label.print",
      "card.render",
    ],
  },
  {
    key: "scanner_device",
    name: "Scanner Device",
    description: "Minimal scanner role",
    defaultScope: "event",
    isSystemRole: false,
    permissions: ["checkin.run", "client.view"],
  },
  {
    key: "support_agent",
    name: "Support Agent",
    description: "Support and troubleshooting role",
    defaultScope: "company",
    isSystemRole: false,
    permissions: [
      "history.view",
      "system_log.view",
      "chatbot.admin",
      "chatbot.history.view",
      "user.view",
    ],
  },
] as const satisfies readonly RoleTemplate[];

export const ROLE_TEMPLATE_BY_KEY = ROLE_TEMPLATES.reduce(
  (accumulator, roleTemplate) => {
    accumulator[roleTemplate.key] = roleTemplate;
    return accumulator;
  },
  {} as Record<RoleKey, RoleTemplate>,
);

export function getRoleTemplate(roleKey: RoleKey): RoleTemplate {
  return ROLE_TEMPLATE_BY_KEY[roleKey];
}
