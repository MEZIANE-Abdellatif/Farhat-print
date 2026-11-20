"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, type Locale } from "@/lib/locales";

const LABELS: Record<Locale, string> = {
  fr: "FR",
  en: "EN",
  ma: "MA",
};

export function LocaleSwitcher({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const pathname = usePathname();
  const rest = pathname.split("/").slice(2).join("/");

  return (
    <nav aria-label={label} className="flex items-center gap-1">
      {LOCALES.map((loc) => {
        const href = rest ? `/${loc}/${rest}` : `/${loc}`;
        const current = loc === locale;
        return (
          <Link
            key={loc}
            href={href}
            hrefLang={loc === "ma" ? "ar-MA" : loc}
            className={`inline-flex min-h-11 min-w-9 items-center justify-center rounded-full text-xs font-bold sm:min-w-11 ${
              current
                ? "bg-cyan-400 text-navy"
                : "text-slate-200 hover:bg-white/10"
            }`}
            aria-current={current ? "true" : undefined}
          >
            {LABELS[loc]}
          </Link>
        );
      })}
    </nav>
  );
}
