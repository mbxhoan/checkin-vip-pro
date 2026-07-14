import "@/css/style.css";

import { Sidebar } from "@/components/Layouts/sidebar";
import { Footer } from "@/components/Layouts/footer";
import { getAuthSessionBootstrap } from "@/lib/auth/bootstrap";
import { getLocale } from "@/lib/i18n/server";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import { Header } from "@/components/Layouts/header";
import { Montserrat } from "next/font/google";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "./providers";

const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Giltech Solutions Check-in",
    default: "Giltech Solutions Check-in",
  },
  description:
    "Giltech Solutions Check-in is a multi-company SaaS for event check-in, audience operations, print workflows, and RBAC-controlled admin modules. Hệ thống song ngữ Việt - Anh.",
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const [initialAuthSession, initialLocale] = await Promise.all([
    getAuthSessionBootstrap(),
    getLocale(),
  ]);
  const showShell = Boolean(initialAuthSession);

  return (
    <html lang={initialLocale} suppressHydrationWarning>
      <body className={montserrat.className}>
        <Providers
          initialAuthSession={initialAuthSession}
          initialLocale={initialLocale}
        >
          <NextTopLoader color="#5750F1" showSpinner={false} />

          {showShell ? (
            <div className="flex min-h-screen">
              <Sidebar />

              <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
                <Header />

                <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-3 md:p-4 xl:p-6">
                  {children}
                </main>

                <Footer />
              </div>
            </div>
          ) : (
            <main className="min-h-screen bg-gray-2 p-3 dark:bg-[#020d1a] md:p-4 xl:p-6">
              {children}
            </main>
          )}
        </Providers>
      </body>
    </html>
  );
}
