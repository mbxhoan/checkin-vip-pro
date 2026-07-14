import { getMessages, type Locale } from "@/lib/i18n/messages";
import type { ComponentType } from "react";
import * as Icons from "../icons";

type NavItem = {
  title: string;
  url?: string;
  icon?: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  items: readonly { title: string; url: string }[];
};

type NavSection = {
  label: string;
  items: readonly NavItem[];
};

export function getNavData(locale: Locale): NavSection[] {
  const copy = getMessages(locale);

  return [
    {
      label: copy.nav.sections.overview,
      items: [
        {
          title: copy.nav.items.dashboard,
          url: "/",
          icon: Icons.HomeIcon,
          items: [],
        },
      ],
    },
    {
      label: copy.nav.sections.workspace,
      items: [
        {
          title: copy.nav.items.workspace,
          url: "/workspace",
          icon: Icons.Workspace,
          items: [],
        },
        {
          title: copy.nav.items.clientWorkspace,
          url: "/workspace/clients",
          icon: Icons.Table,
          items: [],
        },
      ],
    },
    {
      label: copy.nav.sections.audience,
      items: [
        {
          title: copy.nav.items.audience,
          url: "/audience",
          icon: Icons.Audience,
          items: [],
        },
      ],
    },
    {
      label: copy.nav.sections.operations,
      items: [
        {
          title: copy.nav.items.checkinRuntime,
          url: "/checkin",
          icon: Icons.ShieldCheck,
          items: [],
        },
        {
          title: copy.nav.items.offlineSync,
          url: "/sync-offline",
          icon: Icons.FourCircle,
          items: [],
        },
      ],
    },
    {
      label: copy.nav.sections.reports,
      items: [
        {
          title: copy.nav.items.reports,
          url: "/reports",
          icon: Icons.PieChart,
          items: [],
        },
      ],
    },
    {
      label: copy.nav.sections.experience,
      items: [
        {
          title: copy.nav.items.experience,
          url: "/experience",
          icon: Icons.Experience,
          items: [],
        },
      ],
    },
    {
      label: copy.nav.sections.engagement,
      items: [
        {
          title: copy.nav.items.engagement,
          url: "/engagement",
          icon: Icons.Engagement,
          items: [],
        },
      ],
    },
    {
      label: copy.nav.sections.access,
      items: [
        {
          title: copy.nav.items.rbac,
          url: "/rbac",
          icon: Icons.ShieldCheck,
          items: [],
        },
        {
          title: copy.nav.items.authentication,
          icon: Icons.Authentication,
          items: [
            { title: copy.nav.items.signIn, url: "/auth/sign-in" },
            { title: copy.nav.items.signUp, url: "/auth/sign-up" },
            {
              title: copy.nav.items.forgotPassword,
              url: "/auth/forgot-password",
            },
            {
              title: copy.nav.items.resetPassword,
              url: "/auth/reset-password",
            },
          ],
        },
      ],
    },
    {
      label: copy.nav.sections.system,
      items: [
        {
          title: copy.nav.items.system,
          url: "/system",
          icon: Icons.System,
          items: [],
        },
        {
          title: copy.nav.items.templateVault,
          url: "/system/template-vault",
          icon: Icons.FourCircle,
          items: [],
        },
        {
          title: copy.nav.items.termsOfUse,
          icon: Icons.Legal,
          items: [
            { title: copy.nav.items.termsOfUse, url: "/terms-of-use" },
            {
              title: copy.nav.items.privacyPolicy,
              url: "/privacy-policy",
            },
            { title: copy.nav.items.refundPolicy, url: "/payment-refund-policy" },
          ],
        },
      ],
    },
  ];
}
