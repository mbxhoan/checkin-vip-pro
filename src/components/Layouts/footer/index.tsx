import Link from "next/link";
import { useI18n } from "@/lib/i18n/client";

export function Footer() {
  const year = new Date().getFullYear();
  const { messages } = useI18n();

  const footerLinks = [
    { label: messages.footer.rbac, href: "/rbac" },
    { label: messages.footer.terms, href: "/terms-of-use" },
    { label: messages.footer.privacy, href: "/privacy-policy" },
    { label: messages.footer.refunds, href: "/payment-refund-policy" },
  ];

  return (
    <footer className="border-t border-stone-200 bg-white px-4 py-3 text-sm text-slate-500 dark:border-stone-800 dark:bg-slate-950 dark:text-slate-400 md:px-5 2xl:px-8">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-slate-700 dark:text-slate-200">
            {messages.footer.productName}
          </p>
          <p>
            {messages.footer.copyright.replace("{year}", String(year))}{" "}
            {messages.footer.builtOn}
          </p>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-wrap gap-3">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-medium text-slate-600 transition hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
