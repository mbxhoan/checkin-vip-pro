"use client";

import { ChevronUpIcon } from "@/assets/icons";
import { useAuthSession } from "@/components/Auth/session-provider";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LogOutIcon, SettingsIcon, UserIcon } from "./icons";
import { useI18n } from "@/lib/i18n/client";

export function UserInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const { session, signOut } = useAuthSession();
  const { messages } = useI18n();

  const user = session?.profile;
  const userName = user?.displayName ?? messages.common.hello;
  const userEmail = user?.email ?? messages.common.notSignedIn;
  const userAvatar = session?.authUser.avatarUrl ?? "/images/user/user-03.png";

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="rounded align-middle outline-none ring-primary ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-dark">
        <span className="sr-only">{messages.common.profile}</span>

        <figure className="flex items-center gap-3">
          <Image
            src={userAvatar}
            className="size-12"
            alt={`Avatar of ${userName}`}
            role="presentation"
            width={200}
            height={200}
          />
          <figcaption className="flex items-center gap-1 font-medium text-dark dark:text-dark-6 max-[1024px]:sr-only">
            <span>{userName}</span>

            <ChevronUpIcon
              aria-hidden
              className={cn(
                "rotate-180 transition-transform",
                isOpen && "rotate-0",
              )}
              strokeWidth={1.5}
            />
          </figcaption>
        </figure>
      </DropdownTrigger>

      <DropdownContent
        className="border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-dark min-[230px]:min-w-[17.5rem]"
        align="end"
      >
        <h2 className="sr-only">{messages.common.profile}</h2>

        <figure className="flex items-center gap-2.5 px-5 py-3.5">
          <Image
            src={userAvatar}
            className="size-12"
            alt={`Avatar for ${userName}`}
            role="presentation"
            width={200}
            height={200}
          />

          <figcaption className="space-y-1 text-base font-medium">
            <div className="mb-2 leading-none text-dark dark:text-white">
              {userName}
            </div>

            <div className="leading-none text-gray-6">{userEmail}</div>
          </figcaption>
        </figure>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6 [&>*]:cursor-pointer">
          {session ? (
            <div className="space-y-1">
              <Link
                href={"/workspace/clients"}
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
              >
                <UserIcon />

                <span className="mr-auto text-base font-medium">
                  {messages.nav.items.clientWorkspace}
                </span>
              </Link>

              <Link
                href={"/checkin"}
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
              >
                <SettingsIcon />

                <span className="mr-auto text-base font-medium">
                  {messages.nav.items.checkinRuntime}
                </span>
              </Link>

              <Link
                href={"/reports"}
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
              >
                <UserIcon />

                <span className="mr-auto text-base font-medium">
                  {messages.nav.items.reports}
                </span>
              </Link>

              <Link
                href={"/system"}
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
              >
                <SettingsIcon />

                <span className="mr-auto text-base font-medium">
                  {messages.common.backToWorkspace}
                </span>
              </Link>

              <Link
                href={"/system/template-vault"}
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
              >
                <UserIcon />

                <span className="mr-auto text-base font-medium">
                  {messages.common.templateVault}
                </span>
              </Link>
            </div>
          ) : (
            <Link
              href={"/auth/sign-in"}
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
            >
              <UserIcon />

              <span className="mr-auto text-base font-medium">
                {messages.common.signIn}
              </span>
            </Link>
          )}
        </div>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6">
          {session ? (
            <button
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
              onClick={async () => {
                setIsOpen(false);
                await signOut();
              }}
              >
                <LogOutIcon />

              <span className="text-base font-medium">
                {messages.common.signOut}
              </span>
              </button>
            ) : null}
        </div>
      </DropdownContent>
    </Dropdown>
  );
}
