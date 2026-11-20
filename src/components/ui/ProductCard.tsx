import Link from "next/link";
import { ProductMockup } from "@/components/ui/ProductMockup";
import { createTranslator, type Messages } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { formatMad, type Product } from "@/lib/products";

export function ProductCard({
  product,
  locale,
  messages,
  featured = false,
}: {
  product: Product;
  locale: Locale;
  messages: Messages;
  featured?: boolean;
}) {
  const t = createTranslator(messages);
  const name = t(`productNames.${product.slug}`);

  return (
    <article className={featured ? "md:col-span-2" : ""}>
      <Link
        href={`/${locale}/studio/${product.slug}`}
        className="look-card group block min-h-11 bg-[#161b26]"
      >
        <div className={`relative bg-[#0c1018] ${featured ? "aspect-[4/5] md:aspect-[4/3]" : "aspect-[4/5]"}`}>
          <ProductMockup
            product={product}
            title={name}
            className="absolute inset-0 p-8"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-300">
              {t(`categories.${product.category}`)}
            </p>
            <h2 className="mt-1 font-display text-3xl text-white md:text-4xl">{name}</h2>
            <p className="mt-1 max-w-sm text-sm text-white/70">
              {t(`productBlurb.${product.slug}`)}
            </p>
            <p className="mt-3 text-sm font-semibold text-white">
              {t("products.from", { price: formatMad(product.priceMad, locale) })}
            </p>
          </div>
        </div>
      </Link>
      <div className="mt-3 flex gap-2">
        <Link
          href={`/${locale}/products/${product.slug}`}
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-white/15 text-sm font-semibold text-paper"
        >
          {t("products.view")}
        </Link>
        <Link
          href={`/${locale}/studio/${product.slug}`}
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-cyan-300 text-sm font-semibold text-ink"
        >
          {t("products.customize")}
        </Link>
      </div>
    </article>
  );
}
