import Link from "next/link";
import { listPublicPhotos, type Photo } from "@/lib/photos";
import { INSTAGRAM_URL, TIKTOK_URL } from "@/lib/social";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let photos: Photo[] = [];
  try {
    photos = await listPublicPhotos();
  } catch {
    photos = [];
  }

  return (
    <main className="flex min-h-dvh flex-col">
      <section className="flex min-h-dvh flex-col items-center justify-center px-6 py-16">
        <p className="reveal mb-10 text-[11px] tracking-[0.32em] text-cream/65">
          BATUMI · GEORGIA
        </p>
        <h1 className="reveal reveal-delay text-center text-4xl font-medium tracking-[0.1em] sm:text-5xl">
          eyes.on.batumi
        </h1>
        <p className="reveal reveal-delay-2 mt-6 max-w-xs text-center font-serif text-lg leading-relaxed text-cream/80">
          ქუჩის პორტრეტები ბათუმში
        </p>
        <div className="reveal reveal-delay-3 mt-14 flex flex-wrap items-center justify-center gap-4">
          {photos.length > 0 ? (
            <a
              href="#gallery"
              className="rounded-full bg-terracotta px-5 py-2.5 text-sm font-medium text-navy transition-opacity hover:opacity-90"
            >
              გალერეა
            </a>
          ) : null}
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
      </section>

      {photos.length > 0 ? (
        <section id="gallery" className="mx-auto w-full max-w-5xl px-5 pb-20 sm:px-8">
          <h2 className="mb-8 text-center font-serif text-2xl">არჩეული კადრები</h2>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
            {photos.map((photo) => (
              <li key={photo.id}>
                <Link
                  href={`/p/${photo.id}`}
                  className="group block overflow-hidden rounded-2xl border border-cream/10 bg-black/20"
                >
                  <div className="aspect-[4/5]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/api/photos/${photo.id}/preview`}
                      alt={photo.caption || "eyes.on.batumi"}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  {photo.caption ? (
                    <p className="line-clamp-2 px-3 py-3 text-xs text-cream/70 sm:text-sm">
                      {photo.caption}
                    </p>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
