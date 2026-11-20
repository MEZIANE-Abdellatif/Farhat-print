import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCatalog } from "@/components/products/ProductCatalog";
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
    title: t.meta.productsTitle,
    description: t.meta.productsDescription,
    path: "/products",
  });
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { category } = await searchParams;
  return (
    <ProductCatalog
      locale={locale}
      messages={getMessages(locale)}
      initialCategory={category}
    />
  );
}
