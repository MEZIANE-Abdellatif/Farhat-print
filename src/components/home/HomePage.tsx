import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ui/ProductCard";
import { createTranslator, type Messages } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { PRODUCTS } from "@/lib/products";

export function HomePage({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  const t = createTranslator(messages);
  const featured = PRODUCTS.filter((product) => product.featured);

  return (
    <div>
      <section className="relative min-h-[86vh] overflow-hidden">
        <Image
          src="/brand/storefront.jpg"
          alt={t("brand.name")}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-black/40" />
        <div className="relative z-10 mx-auto flex min-h-[86vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-300">
            {t("home.kicker")} · {t("home.imagine")}
          </p>
          <h1 className="neon-text mt-4 max-w-3xl font-display text-[2.7rem] leading-[0.92] text-white sm:text-8xl">
            {t("home.title")}
          </h1>
          <p className="mt-5 max-w-lg text-base text-white/75 sm:text-lg">
            {t("home.subtitle")}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/${locale}/studio/t-shirt`}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-cyan-300 px-7 text-sm font-bold text-ink"
            >
              {t("home.ctaStudio")}
            </Link>
            <Link
              href={`/${locale}/products`}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 px-7 text-sm font-bold text-white backdrop-blur-md"
            >
              {t("home.ctaCatalog")}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden border-y border-white/10 bg-white/5 sm:grid-cols-4">
        {[
          t("home.trustQuality"),
          t("home.trustDesigns"),
          t("home.trustPrint"),
          t("home.trustSpeed"),
        ].map((label) => (
          <p
            key={label}
            className="px-4 py-6 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80"
          >
            {label}
          </p>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-5xl text-white sm:text-6xl">
            {t("home.categoriesTitle")}
          </h2>
          <Link
            href={`/${locale}/products`}
            className="hidden min-h-11 items-center text-sm font-semibold text-cyan-300 sm:inline-flex"
          >
            {t("home.ctaCatalog")}
          </Link>
        </div>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {featured.map((product, index) => (
            <ProductCard
              key={product.slug}
              product={product}
              locale={locale}
              messages={messages}
              featured={index === 0}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8">
        <h2 className="font-display text-5xl text-white">{t("home.howTitle")}</h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((step) => (
            <li key={step} className="relative border-t border-cyan-300/40 pt-6">
              <p className="font-display text-6xl text-white/15">0{step}</p>
              <h3 className="mt-2 text-lg font-semibold text-white">
                {t(`home.step${step}Title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {t(`home.step${step}Text`)}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10 grid md:grid-cols-2">
        <Link href={`/${locale}/studio/mug`} className="group relative min-h-[420px] overflow-hidden">
          <Image
            src="/brand/mugs.jpg"
            alt={t("categories.mug")}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-x-0 bottom-0 p-8">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">
              {t("home.giftsTitle")}
            </p>
            <h2 className="mt-2 font-display text-5xl text-white">{t("categories.mug")}</h2>
          </div>
        </Link>
        <Link href={`/${locale}/studio/tote-bag`} className="group relative min-h-[420px] overflow-hidden">
          <Image
            src="/brand/tote.jpg"
            alt={t("categories.bag")}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-x-0 bottom-0 p-8">
            <p className="text-xs uppercase tracking-[0.24em] text-rose-300">
              {t("home.passion")}
            </p>
            <h2 className="mt-2 font-display text-5xl text-white">{t("categories.bag")}</h2>
          </div>
        </Link>
      </section>

      <section className="relative overflow-hidden">
        <Image
          src="/brand/banner-tshirt.png"
          alt={t("home.title")}
          width={1600}
          height={640}
          className="h-[280px] w-full object-cover sm:h-[380px]"
        />
        <div className="absolute inset-0 bg-ink/40" />
        <p className="absolute inset-x-0 bottom-8 text-center text-sm font-semibold uppercase tracking-[0.22em] text-white">
          {t("home.delivery")}
        </p>
      </section>
    </div>
  );
}
