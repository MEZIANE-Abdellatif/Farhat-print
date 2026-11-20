"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ui/ProductCard";
import type { Messages } from "@/lib/i18n";
import { createTranslator } from "@/lib/translate";
import type { Locale } from "@/lib/locales";
import {
  CATEGORIES,
  PRODUCTS,
  type ProductCategory,
} from "@/lib/products";

export function ProductCatalog({
  locale,
  messages,
  initialCategory,
}: {
  locale: Locale;
  messages: Messages;
  initialCategory?: string;
}) {
  const t = createTranslator(messages);
  const validInitial = CATEGORIES.includes(initialCategory as ProductCategory)
    ? (initialCategory as ProductCategory)
    : "all";
  const [category, setCategory] = useState<ProductCategory | "all">(validInitial);

  const list = useMemo(
    () =>
      category === "all"
        ? PRODUCTS
        : PRODUCTS.filter((product) => product.category === category),
    [category],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">{t("brand.tagline")}</p>
      <h1 className="mt-3 font-display text-6xl text-white sm:text-7xl">
        {t("products.title")}
      </h1>
      <p className="mt-3 max-w-xl text-pretty text-white/60">{t("products.subtitle")}</p>
      <div
        className="mt-8 flex flex-wrap gap-2"
        role="group"
        aria-label={t("products.filterAria")}
      >
        <FilterChip
          active={category === "all"}
          onClick={() => setCategory("all")}
          label={t("products.filterAll")}
        />
        {CATEGORIES.map((item) => (
          <FilterChip
            key={item}
            active={category === item}
            onClick={() => setCategory(item)}
            label={t(`categories.${item}`)}
          />
        ))}
      </div>
      {list.length === 0 ? (
        <p className="mt-8 text-white/60">{t("products.empty")}</p>
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {list.map((product, index) => (
            <ProductCard
              key={product.slug}
              product={product}
              locale={locale}
              messages={messages}
              featured={index === 0 && category === "all"}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold ${
        active ? "bg-cyan-300 text-ink" : "bg-white/10 text-white"
      }`}
    >
      {label}
    </button>
  );
}
