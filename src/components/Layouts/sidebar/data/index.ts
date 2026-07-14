import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "OVERVIEW",
    items: [
      {
        title: "Dashboard",
        url: "/",
        icon: Icons.HomeIcon,
        items: [],
      },
    ],
  },
  {
    label: "WORKSPACE",
    items: [
      {
        title: "Workspace",
        url: "/workspace",
        icon: Icons.Workspace,
        items: [],
      },
    ],
  },
  {
    label: "AUDIENCE",
    items: [
      {
        title: "Audience",
        url: "/audience",
        icon: Icons.Audience,
        items: [],
      },
    ],
  },
  {
    label: "EXPERIENCE",
    items: [
      {
        title: "Experience",
        url: "/experience",
        icon: Icons.Experience,
        items: [],
      },
    ],
  },
  {
    label: "ENGAGEMENT",
    items: [
      {
        title: "Engagement",
        url: "/engagement",
        icon: Icons.Engagement,
        items: [],
      },
    ],
  },
  {
    label: "ACCESS",
    items: [
      {
        title: "RBAC",
        url: "/rbac",
        icon: Icons.ShieldCheck,
        items: [],
      },
      {
        title: "Authentication",
        icon: Icons.Authentication,
        items: [
          {
            title: "Sign In",
            url: "/auth/sign-in",
          },
          {
            title: "Sign Up",
            url: "/auth/sign-up",
          },
          {
            title: "Forgot Password",
            url: "/auth/forgot-password",
          },
          {
            title: "Reset Password",
            url: "/auth/reset-password",
          },
        ],
      },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      {
        title: "System",
        url: "/system",
        icon: Icons.System,
        items: [],
      },
      {
        title: "Template vault",
        url: "/system/template-vault",
        icon: Icons.FourCircle,
        items: [],
      },
      {
        title: "Legal",
        icon: Icons.Legal,
        items: [
          {
            title: "Terms of use",
            url: "/terms-of-use",
          },
          {
            title: "Privacy policy",
            url: "/privacy-policy",
          },
          {
            title: "Refund policy",
            url: "/payment-refund-policy",
          },
        ],
      },
    ],
  },
];
