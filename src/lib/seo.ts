import type { Metadata } from "next";
import { LOCALES, type Locale } from "@/lib/locales";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export function buildMetadata({
  locale,
  title,
  description,
  path,
}: {
  locale: Locale;
  title: string;
  description: string;
  path: string;
}): Metadata {
  const canonical = `${SITE_URL}/${locale}${path}`;
  const languages: Record<string, string> = {};
  for (const loc of LOCALES) {
    languages[loc === "ma" ? "ar-MA" : loc] = `${SITE_URL}/${loc}${path}`;
  }
  languages["x-default"] = `${SITE_URL}/fr${path}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      url: canonical,
      locale: locale === "ma" ? "ar_MA" : locale === "fr" ? "fr_FR" : "en_US",
      images: [{ url: `${SITE_URL}/brand/logo.jpg`, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/brand/logo.jpg`],
    },
  };
}
