import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StudioLoader } from "@/components/studio/StudioLoader";
import { getMessages } from "@/lib/i18n";
import { isLocale } from "@/lib/locales";
import { PRODUCTS, getProduct } from "@/lib/products";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const product = getProduct(slug);
  if (!product) return {};
  const t = getMessages(locale);
  const name = t.productNames[slug as keyof typeof t.productNames];
  return buildMetadata({
    locale,
    title: t.meta.studioTitle.replace("{name}", name),
    description: t.meta.studioDescription.replace("{name}", name),
    path: `/studio/${slug}`,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const product = getProduct(slug);
  if (!product) notFound();
  return (
    <StudioLoader locale={locale} messages={getMessages(locale)} product={product} />
  );
}
