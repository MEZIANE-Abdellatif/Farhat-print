export const LOCALES = ["fr", "en", "ma"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fr";

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function localeDir(locale: Locale): "ltr" | "rtl" {
  return locale === "ma" ? "rtl" : "ltr";
}

export function localeHtmlLang(locale: Locale): string {
  if (locale === "ma") return "ar-MA";
  return locale;
}
