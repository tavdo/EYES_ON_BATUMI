import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 py-16">
      <p className="mb-10 text-[11px] tracking-[0.28em] text-cream/70">
        BATUMI · GEORGIA
      </p>
      <h1 className="text-center text-3xl font-medium tracking-[0.08em] sm:text-4xl">
        eyes.on.batumi
      </h1>
      <p className="mt-6 max-w-xs text-center font-serif text-lg leading-relaxed text-cream/80">
        ქუჩის პორტრეტები ბათუმში
      </p>
      <div className="mt-14 flex items-center gap-8 text-sm text-cream/70">
        <Link
          href="https://instagram.com/eyes.on.batumi"
          className="transition-colors hover:text-terracotta"
          target="_blank"
          rel="noreferrer"
        >
          Instagram
        </Link>
        <Link
          href="https://www.tiktok.com/@eyes.on.batumi"
          className="transition-colors hover:text-terracotta"
          target="_blank"
          rel="noreferrer"
        >
          TikTok
        </Link>
      </div>
    </main>
  );
}
