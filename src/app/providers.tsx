"use client";

import { AuthSessionProvider } from "@/components/Auth/session-provider";
import { I18nProvider } from "@/lib/i18n/client";
import type { Locale } from "@/lib/i18n/messages";
import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
import type { AuthSessionBootstrap } from "@/lib/auth/types";
import { ThemeProvider } from "next-themes";

export function Providers({
  children,
  initialAuthSession,
  initialLocale,
}: {
  children: React.ReactNode;
  initialAuthSession: AuthSessionBootstrap | null;
  initialLocale: Locale;
}) {
  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      <I18nProvider initialLocale={initialLocale}>
        <AuthSessionProvider initialSession={initialAuthSession}>
          <SidebarProvider>{children}</SidebarProvider>
        </AuthSessionProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
