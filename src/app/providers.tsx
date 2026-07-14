"use client";

import { AuthSessionProvider } from "@/components/Auth/session-provider";
import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
import type { AuthSessionBootstrap } from "@/lib/auth/types";
import { ThemeProvider } from "next-themes";

export function Providers({
  children,
  initialAuthSession,
}: {
  children: React.ReactNode;
  initialAuthSession: AuthSessionBootstrap | null;
}) {
  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      <AuthSessionProvider initialSession={initialAuthSession}>
        <SidebarProvider>{children}</SidebarProvider>
      </AuthSessionProvider>
    </ThemeProvider>
  );
}
