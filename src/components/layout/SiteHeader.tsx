"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { useCart } from "@/components/cart/CartProvider";
import type { Messages } from "@/lib/i18n";
import { createTranslator } from "@/lib/translate";
import type { Locale } from "@/lib/locales";

export function SiteHeader({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  const t = createTranslator(messages);
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const links = [
    { href: `/${locale}`, label: t("nav.home") },
    { href: `/${locale}/products`, label: t("nav.products") },
    { href: `/${locale}/about`, label: t("nav.about") },
    { href: `/${locale}/contact`, label: t("nav.contact") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy/80 backdrop-blur-xl">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-navy"
      >
        {t("nav.skip")}
      </a>
      <div className="mx-auto flex w-full min-w-0 max-w-6xl items-center justify-between gap-2 px-3 py-2 sm:px-4">
        <Link href={`/${locale}`} className="flex min-h-11 min-w-0 items-center gap-2">
          <Image
            src="/brand/logo.jpg"
            alt={t("brand.name")}
            width={44}
            height={44}
            className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-cyan-400/40 sm:h-11 sm:w-11"
            priority
          />
          <span className="hidden min-w-0 leading-none sm:block">
            <span className="font-display text-2xl tracking-[0.14em] text-white">
              {t("brand.name")}
            </span>
            <span className="mt-0.5 block text-[10px] uppercase tracking-[0.22em] text-cyan-300">
              {t("brand.tagline")}
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-semibold text-slate-200 hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ms-auto flex shrink-0 items-center gap-1">
          <div className="hidden md:block">
            <LocaleSwitcher locale={locale} label={t("nav.language")} />
          </div>
          <Link
            href={`/${locale}/cart`}
            className="relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-white hover:bg-white/10"
            aria-label={`${t("nav.cart")} (${count})`}
          >
            <CartIcon />
            {count > 0 ? (
              <span className="absolute end-1 top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full hover:bg-white/10 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">
              {open ? t("nav.closeMenu") : t("nav.openMenu")}
            </span>
            <span className="flex flex-col gap-1.5" aria-hidden>
              <span className="block h-0.5 w-5 bg-white" />
              <span className="block h-0.5 w-5 bg-white" />
              <span className="block h-0.5 w-5 bg-white" />
            </span>
          </button>
        </div>
      </div>
      {open ? (
        <nav id="mobile-nav" className="border-t border-white/10 px-4 py-3 md:hidden">
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex min-h-11 items-center text-base font-semibold text-white"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-2 border-t border-white/10 pt-2">
            <LocaleSwitcher locale={locale} label={t("nav.language")} />
          </div>
        </nav>
      ) : null}
    </header>
  );
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6h15l-1.5 9h-12z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="20" r="1.4" fill="currentColor" />
      <circle cx="18" cy="20" r="1.4" fill="currentColor" />
      <path d="M6 6 5 3H2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
