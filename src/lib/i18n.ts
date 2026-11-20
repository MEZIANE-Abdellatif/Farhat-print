import en from "@/i18n/en.json";
import fr from "@/i18n/fr.json";
import ma from "@/i18n/ma.json";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/locales";
import { createTranslator as makeTranslator } from "@/lib/translate";

export type Messages = typeof en;

const dictionaries: Record<Locale, Messages> = {
  en,
  fr: fr as Messages,
  ma: ma as Messages,
};

export function getMessages(locale: string): Messages {
  if (isLocale(locale)) return dictionaries[locale];
  return dictionaries[DEFAULT_LOCALE];
}

export function createTranslator(messages: Messages) {
  return makeTranslator(messages);
}
