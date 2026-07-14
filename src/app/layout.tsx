import "@/css/satoshi.css";
import "@/css/style.css";

import { Sidebar } from "@/components/Layouts/sidebar";
import { Footer } from "@/components/Layouts/footer";
import { getAuthSessionBootstrap } from "@/lib/auth/bootstrap";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import { Header } from "@/components/Layouts/header";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    template: "%s | Giltech Solutions Check-in",
    default: "Giltech Solutions Check-in",
  },
  description:
    "Giltech Solutions Check-in is a multi-company SaaS for event check-in, audience operations, print workflows, and RBAC-controlled admin modules.",
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const initialAuthSession = await getAuthSessionBootstrap();

  return (
    <html lang="vi" suppressHydrationWarning>
      <body>
        <Providers initialAuthSession={initialAuthSession}>
          <NextTopLoader color="#5750F1" showSpinner={false} />

          <div className="flex min-h-screen">
            <Sidebar />

            <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
              <Header />

              <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
                {children}
              </main>

              <Footer />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
