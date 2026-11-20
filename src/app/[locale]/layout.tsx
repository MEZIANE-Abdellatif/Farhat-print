import { notFound } from "next/navigation";
import { CartProvider } from "@/components/cart/CartProvider";
import { LocaleHtml } from "@/components/layout/LocaleHtml";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getMessages } from "@/lib/i18n";
import { LOCALES, isLocale, localeDir, localeHtmlLang } from "@/lib/locales";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getMessages(locale);

  return (
    <CartProvider>
      <LocaleHtml locale={locale} />
      <div lang={localeHtmlLang(locale)} dir={localeDir(locale)} className="min-h-screen">
        <SiteHeader locale={locale} messages={messages} />
        <main id="content">{children}</main>
        <SiteFooter locale={locale} messages={messages} />
      </div>
    </CartProvider>
  );
}
