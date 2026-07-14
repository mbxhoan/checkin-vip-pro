"use client";

import { SearchIcon } from "@/assets/icons";
import { useAuthSession } from "@/components/Auth/session-provider";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebarContext } from "../sidebar/sidebar-context";
import { MenuIcon } from "./icons";
import { Notification } from "./notification";
import { ThemeToggleSwitch } from "./theme-toggle";
import { UserInfo } from "./user-info";

function getSectionLabel(pathname: string) {
  if (pathname.startsWith("/workspace")) {
    return "Workspace shell";
  }

  if (pathname.startsWith("/audience")) {
    return "Audience shell";
  }

  if (pathname.startsWith("/experience")) {
    return "Experience shell";
  }

  if (pathname.startsWith("/engagement")) {
    return "Engagement shell";
  }

  if (pathname.startsWith("/system/template-vault")) {
    return "Template vault";
  }

  if (pathname.startsWith("/system")) {
    return "System shell";
  }

  if (pathname.startsWith("/rbac")) {
    return "RBAC console";
  }

  if (pathname.startsWith("/auth")) {
    return "Authentication";
  }

  if (
    pathname.startsWith("/terms-of-use") ||
    pathname.startsWith("/privacy-policy") ||
    pathname.startsWith("/payment-refund-policy")
  ) {
    return "Legal";
  }

  if (pathname.startsWith("/profile") || pathname.startsWith("/pages/settings")) {
    return "Archived account";
  }

  return "Foundation dashboard";
}

export function Header() {
  const { toggleSidebar, isMobile } = useSidebarContext();
  const pathname = usePathname();
  const { session } = useAuthSession();
  const sectionLabel = getSectionLabel(pathname);
  const workspaceName = session?.profile.defaultCompanyName ?? "Giltech Solutions";

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-white/95 px-4 py-4 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur dark:border-stone-800 dark:bg-slate-950/80 md:px-6 2xl:px-10">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="rounded-xl border border-stone-200 bg-white px-2 py-2 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-stone-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 lg:hidden"
        >
          <MenuIcon />
          <span className="sr-only">Toggle Sidebar</span>
        </button>

        {isMobile && (
          <Link href={"/"} className="ml-1 max-[430px]:hidden min-[375px]:ml-2">
            <Image
              src={"/images/logo/logo-icon.svg"}
              width={32}
              height={32}
              alt=""
              role="presentation"
            />
          </Link>
        )}

        <div className="max-xl:hidden">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-600 dark:text-teal-400">
            {sectionLabel}
          </p>
          <h1 className="text-[1.75rem] font-semibold leading-tight text-slate-950 dark:text-white">
            Giltech Solutions Check-in
          </h1>
          <p className="mt-0.5 text-sm font-medium text-slate-500 dark:text-slate-400">
            {workspaceName} workspace
          </p>
        </div>

        <div className="ml-auto flex flex-1 items-center justify-end gap-2 min-[375px]:gap-4">
          <div className="relative hidden w-full max-w-[360px] lg:block">
            <input
              type="search"
              placeholder="Search users, companies, roles"
              className="flex w-full items-center gap-3.5 rounded-full border border-stone-200 bg-white py-3 pl-[53px] pr-5 text-sm outline-none transition-colors placeholder:text-slate-400 focus-visible:border-teal-500 dark:border-stone-800 dark:bg-slate-900 dark:placeholder:text-slate-500"
            />

            <SearchIcon className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 max-[1015px]:size-5 text-slate-400" />
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 dark:border-stone-800 dark:bg-slate-900 dark:text-slate-300 xl:flex">
            <span className="size-2 rounded-full bg-emerald-500" />
            Foundation ready
          </div>

          <ThemeToggleSwitch />

          <Notification />

          <div className="shrink-0">
            <UserInfo />
          </div>
        </div>
      </div>
    </header>
  );
}
