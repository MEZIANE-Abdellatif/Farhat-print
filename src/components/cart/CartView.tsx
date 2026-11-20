"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import type { Messages } from "@/lib/i18n";
import { createTranslator } from "@/lib/translate";
import type { Locale } from "@/lib/locales";
import { formatMad } from "@/lib/products";
import { buildOrderMessage, whatsappUrl } from "@/lib/whatsapp";

export function CartView({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  const t = createTranslator(messages);
  const { items, removeItem, updateQuantity, totalMad } = useCart();

  function orderOnWhatsApp() {
    items.forEach((item, index) => {
      const link = document.createElement("a");
      link.href = item.previewDataUrl;
      link.download = `farhat-preview-${index + 1}.jpg`;
      link.click();
    });
    window.open(
      whatsappUrl(buildOrderMessage(items, formatMad(totalMad, locale), locale)),
      "_blank",
      "noopener,noreferrer",
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="font-display text-6xl text-white">{t("cart.title")}</h1>
        <p className="mt-4 text-white/60">{t("cart.empty")}</p>
        <Link
          href={`/${locale}/products`}
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-cyan-300 px-6 text-sm font-bold text-ink"
        >
          {t("cart.browse")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-6xl text-white">{t("cart.title")}</h1>
      <ul className="mt-8 space-y-4">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-[#121722] p-4 sm:flex-row"
          >
            <Image
              src={item.previewDataUrl}
              alt={item.productName}
              width={140}
              height={180}
              unoptimized
              className="h-40 w-32 rounded-2xl object-cover"
            />
            <div className="flex-1">
              <p className="font-display text-2xl text-white">{item.productName}</p>
              <p className="text-sm text-white/55">
                {item.colorName}
                {item.size ? ` · ${item.size}` : ""} · {item.side}
              </p>
              <p className="mt-2 font-semibold text-cyan-300">
                {formatMad(item.priceMad * item.quantity, locale)}
              </p>
              <label className="mt-3 flex items-center gap-2 text-sm text-white/80">
                {t("cart.qty")}
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(event) =>
                    updateQuantity(item.id, Number(event.target.value))
                  }
                  className="min-h-11 w-20 rounded-lg border border-white/15 bg-black/40 px-2 text-white"
                />
              </label>
            </div>
            <button
              type="button"
              className="min-h-11 rounded-full px-4 text-sm font-semibold text-rose-300"
              onClick={() => removeItem(item.id)}
            >
              {t("cart.remove")}
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-8 font-display text-4xl text-white">
        {t("cart.total")}: {formatMad(totalMad, locale)}
      </p>
      <p className="mt-3 text-sm text-white/50">{t("cart.whatsappHint")}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={orderOnWhatsApp}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-emerald-500 px-6 text-sm font-bold text-white"
        >
          {t("cart.order")}
        </button>
        <Link
          href={`/${locale}/products`}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-semibold text-white"
        >
          {t("cart.continue")}
        </Link>
      </div>
    </div>
  );
}
