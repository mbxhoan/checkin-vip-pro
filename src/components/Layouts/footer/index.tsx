import Link from "next/link";

const footerLinks = [
  { label: "RBAC", href: "/rbac" },
  { label: "Terms", href: "/terms-of-use" },
  { label: "Privacy", href: "/privacy-policy" },
  { label: "Refunds", href: "/payment-refund-policy" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-200 bg-white px-4 py-4 text-sm text-slate-500 dark:border-stone-800 dark:bg-slate-950 dark:text-slate-400 md:px-6 2xl:px-10">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-slate-700 dark:text-slate-200">
            Giltech Solutions Check-in
          </p>
          <p>
            © {year} Giltech Solutions. Built on Next.js and Supabase
            PostgreSQL.
          </p>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-wrap gap-4">
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
