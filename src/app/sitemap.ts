import type { MetadataRoute } from "next";
import { LOCALES } from "@/lib/locales";
import { PRODUCTS } from "@/lib/products";
import { SITE_URL } from "@/lib/site";

const STATIC_PATHS = ["", "/products", "/about", "/contact", "/cart", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [];
  for (const locale of LOCALES) {
    for (const path of STATIC_PATHS) {
      pages.push({
        url: `${SITE_URL}/${locale}${path}`,
        changeFrequency: "weekly",
        priority: path === "" ? 1 : 0.7,
      });
    }
    for (const product of PRODUCTS) {
      pages.push({
        url: `${SITE_URL}/${locale}/products/${product.slug}`,
        changeFrequency: "weekly",
        priority: 0.8,
      });
      pages.push({
        url: `${SITE_URL}/${locale}/studio/${product.slug}`,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }
  return pages;
}
