import Link from "next/link";
import { INSTAGRAM_URL, TIKTOK_URL } from "@/lib/social";

export default function HomePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 py-16">
      <p className="reveal mb-10 text-[11px] tracking-[0.32em] text-cream/65">
        BATUMI · GEORGIA
      </p>
      <h1 className="reveal reveal-delay text-center text-4xl font-medium tracking-[0.1em] sm:text-5xl">
        eyes.on.batumi
      </h1>
      <p className="reveal reveal-delay-2 mt-6 max-w-xs text-center font-serif text-lg leading-relaxed text-cream/80">
        ქუჩის პორტრეტები ბათუმში
      </p>
      <div className="reveal reveal-delay-3 mt-14 flex items-center gap-4">
        <Link
          href={INSTAGRAM_URL}
          className="rounded-full border border-cream/20 px-5 py-2.5 text-sm text-cream/80 transition-all hover:border-terracotta hover:text-terracotta"
          target="_blank"
          rel="noreferrer"
        >
          Instagram
        </Link>
        <Link
          href={TIKTOK_URL}
          className="rounded-full border border-cream/20 px-5 py-2.5 text-sm text-cream/80 transition-all hover:border-terracotta hover:text-terracotta"
          target="_blank"
          rel="noreferrer"
        >
          TikTok
        </Link>
      </div>
    </main>
  );
}
