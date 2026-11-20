"use client";

import { useEffect } from "react";
import { localeDir, localeHtmlLang, type Locale } from "@/lib/locales";

export function LocaleHtml({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = localeHtmlLang(locale);
    document.documentElement.dir = localeDir(locale);
  }, [locale]);
  return null;
}
