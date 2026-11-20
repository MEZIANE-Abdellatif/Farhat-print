import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactPage } from "@/components/pages/SimplePages";
import { getMessages } from "@/lib/i18n";
import { isLocale } from "@/lib/locales";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getMessages(locale);
  return buildMetadata({
    locale,
    title: t.meta.contactTitle,
    description: t.meta.contactDescription,
    path: "/contact",
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <ContactPage messages={getMessages(locale)} />;
}
