"use client";

import Link from "next/link";
import { useState } from "react";
import { ProductMockup } from "@/components/ui/ProductMockup";
import { createTranslator, type Messages } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { formatMad, type Product } from "@/lib/products";

export function ProductDetail({
  locale,
  messages,
  product,
}: {
  locale: Locale;
  messages: Messages;
  product: Product;
}) {
  const t = createTranslator(messages);
  const name = t(`productNames.${product.slug}`);
  const [colorId, setColorId] = useState(product.colors[0]?.id ?? "white");

  return (
    <article className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-10 lg:grid-cols-2">
      <div className="overflow-hidden rounded-[2rem] bg-[#121722]">
        <div className="relative aspect-[4/5]">
          <ProductMockup
            product={product}
            colorId={colorId}
            title={name}
            priority
            className="absolute inset-0"
          />
        </div>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">
          {t(`categories.${product.category}`)}
        </p>
        <h1 className="mt-3 font-display text-6xl text-white">{name}</h1>
        <p className="mt-4 max-w-md text-white/65">{t(`productBlurb.${product.slug}`)}</p>
        <p className="mt-6 font-display text-5xl text-white">
          {formatMad(product.priceMad, locale)}
        </p>
        <fieldset className="mt-8">
          <legend className="text-sm font-semibold text-white">{t("products.color")}</legend>
          <div className="mt-3 flex flex-wrap gap-3">
            {product.colors.map((color) => (
              <button
                key={color.id}
                type="button"
                onClick={() => setColorId(color.id)}
                aria-pressed={color.id === colorId}
                aria-label={t(`colors.${color.id}`)}
                className={`h-11 w-11 rounded-full border-2 ${
                  color.id === colorId ? "border-cyan-300" : "border-white/20"
                }`}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        </fieldset>
        {product.sizes.length > 0 ? (
          <p className="mt-5 text-sm text-white/70">
            <span className="font-semibold text-white">{t("products.size")}: </span>
            {product.sizes.join(" · ")}
          </p>
        ) : null}
        <p className="mt-2 text-sm text-white/70">
          <span className="font-semibold text-white">{t("products.sides")}: </span>
          {product.sides.map((side) => t(`products.${side}`)).join(" · ")}
        </p>
        <Link
          href={`/${locale}/studio/${product.slug}`}
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-cyan-300 px-8 text-sm font-bold text-ink"
        >
          {t("products.customize")}
        </Link>
      </div>
    </article>
  );
}
