import Image from "next/image";
import { createTranslator, type Messages } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { CONTACT } from "@/lib/site";
import { whatsappUrl } from "@/lib/whatsapp";

export function AboutPage({ messages }: { messages: Messages }) {
  const t = createTranslator(messages);
  return (
    <article>
      <div className="relative h-[46vh] min-h-[280px] overflow-hidden">
        <Image
          src="/brand/storefront.jpg"
          alt={t("about.title")}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-black/40 to-black/20" />
        <h1 className="absolute inset-x-4 bottom-8 mx-auto max-w-4xl font-display text-5xl text-white sm:text-7xl">
          {t("about.title")}
        </h1>
      </div>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-xl text-white/80">{t("about.lead")}</p>
        <p className="mt-6 text-white/55">{t("about.p1")}</p>
        <p className="mt-4 text-white/55">{t("about.p2")}</p>
      </div>
    </article>
  );
}

export function ContactPage({ messages }: { messages: Messages }) {
  const t = createTranslator(messages);
  return (
    <article className="mx-auto max-w-3xl px-4 py-14">
      <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">{t("brand.tagline")}</p>
      <h1 className="mt-3 font-display text-6xl text-white">{t("contact.title")}</h1>
      <p className="mt-4 text-white/60">{t("contact.lead")}</p>
      <a
        className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-emerald-500 px-7 text-sm font-bold text-white"
        href={whatsappUrl("Bonjour FARHAT PRINT")}
      >
        {t("contact.whatsapp")} · {CONTACT.phoneDisplay}
      </a>
      <ul className="mt-10 space-y-4 text-white/75">
        <li>
          <a className="inline-flex min-h-11 items-center" href={`tel:${CONTACT.phoneTel}`}>
            {t("contact.phone")}: {CONTACT.phoneDisplay}
          </a>
        </li>
        <li>
          <a className="inline-flex min-h-11 items-center" href={`mailto:${CONTACT.email}`}>
            {t("contact.email")}: {CONTACT.email}
          </a>
        </li>
        <li>
          {t("contact.social")}:{" "}
          <a className="text-cyan-300 underline" href={CONTACT.instagramUrl}>
            Instagram
          </a>{" "}
          ·{" "}
          <a className="text-cyan-300 underline" href={CONTACT.facebookUrl}>
            Facebook
          </a>
        </li>
      </ul>
    </article>
  );
}

export function LegalPage({
  messages,
  kind,
}: {
  locale: Locale;
  messages: Messages;
  kind: "privacy" | "terms";
}) {
  const t = createTranslator(messages);
  return (
    <article className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="font-display text-6xl text-white">
        {kind === "privacy" ? t("legal.privacyTitle") : t("legal.termsTitle")}
      </h1>
      <p className="mt-6 leading-relaxed text-white/60">
        {kind === "privacy" ? t("legal.privacyBody") : t("legal.termsBody")}
      </p>
    </article>
  );
}
