"use client";

import dynamic from "next/dynamic";
import type { Messages } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import type { Product } from "@/lib/products";
import { createTranslator } from "@/lib/translate";

const DesignStudio = dynamic(
  () => import("@/components/studio/DesignStudio").then((mod) => mod.DesignStudio),
  { ssr: false },
);

export function StudioLoader({
  locale,
  messages,
  product,
}: {
  locale: Locale;
  messages: Messages;
  product: Product;
}) {
  const t = createTranslator(messages);
  return (
    <>
      <noscript>
        <p className="px-4 py-8">{t("studio.loading")}</p>
      </noscript>
      <DesignStudio locale={locale} messages={messages} product={product} />
    </>
  );
}
