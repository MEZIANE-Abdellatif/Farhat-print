import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="font-display text-7xl text-white">404</h1>
      <p className="mt-3 text-white/60">FARHAT PRINT</p>
      <Link
        href="/fr"
        className="mt-6 inline-flex min-h-11 items-center rounded-full bg-cyan-300 px-5 font-semibold text-ink"
      >
        Accueil
      </Link>
    </main>
  );
}
