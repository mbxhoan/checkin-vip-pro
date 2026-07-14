import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type PropsType = {
  title: string;
  children: ReactNode;
  className?: string;
};

export function ShowcaseSection({ title, children, className }: PropsType) {
  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h2 className="border-b border-stroke px-3 py-3 font-medium text-dark dark:border-dark-3 dark:text-white sm:px-4 xl:px-6">
        {title}
      </h2>

      <div className={cn("p-3.5 sm:p-4 xl:p-6", className)}>{children}</div>
    </div>
  );
}
