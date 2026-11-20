import Link from "next/link";
import { createTranslator, type Messages } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { CONTACT } from "@/lib/site";
import { CATEGORIES } from "@/lib/products";

export function SiteFooter({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  const t = createTranslator(messages);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-4 border-t border-white/10 bg-black text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <p className="font-display text-3xl tracking-[0.12em] text-cyan-300">
            {t("brand.name")}
          </p>
          <p className="mt-1 text-sm uppercase tracking-[0.18em] text-rose-300">
            {t("brand.tagline")}
          </p>
          <p className="mt-4 max-w-xs text-sm text-slate-400">{t("brand.slogan")}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            {t("nav.products")}
          </p>
          <ul className="mt-3 space-y-1">
            {CATEGORIES.map((category) => (
              <li key={category}>
                <Link
                  href={`/${locale}/products?category=${category}`}
                  className="inline-flex min-h-11 items-center text-sm text-slate-200 hover:text-cyan-300"
                >
                  {t(`categories.${category}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            {t("nav.contact")}
          </p>
          <ul className="mt-3 space-y-1 text-sm text-slate-200">
            <li>
              <a className="inline-flex min-h-11 items-center hover:text-cyan-300" href={`tel:${CONTACT.phoneTel}`}>
                {CONTACT.phoneDisplay}
              </a>
            </li>
            <li>
              <a className="inline-flex min-h-11 items-center hover:text-cyan-300" href={`mailto:${CONTACT.email}`}>
                {CONTACT.email}
              </a>
            </li>
            <li>Instagram @{CONTACT.instagram}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-slate-500">
        © {year} {t("brand.name")}. {t("footer.rights")} ·{" "}
        <Link href={`/${locale}/privacy`} className="underline hover:text-white">
          {t("footer.privacy")}
        </Link>{" "}
        ·{" "}
        <Link href={`/${locale}/terms`} className="underline hover:text-white">
          {t("footer.terms")}
        </Link>
      </div>
    </footer>
  );
}
