import type { Metadata } from "next";
import Link from "next/link";
import { AnalyticsBeacon } from "@/components/AnalyticsBeacon";
import { getAccessibleAlbumWithPhotos } from "@/lib/albums";
import { getDictionary, getLocaleFromCookies } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "თქვენი კადრები — eyes.on.batumi",
    robots: { index: false, follow: false, nocache: true },
  };
}

export default async function AlbumPage({ params }: PageProps) {
  const { id } = await params;
  const locale = await getLocaleFromCookies();
  const dict = getDictionary(locale);
  const data = await getAccessibleAlbumWithPhotos(id);

  if (!data) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center px-6 py-16">
        <p className="mb-12 text-[11px] tracking-[0.28em] text-cream/55">eyes.on.batumi</p>
        <p className="max-w-sm text-center font-serif text-xl leading-relaxed text-cream/90">
          {dict.albumInvalid}
        </p>
      </main>
    );
  }

  const { album, photos } = data;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-4xl flex-col px-5 py-10 sm:px-8 sm:py-14">
      <AnalyticsBeacon event="album_view" targetId={album.id} />
      <header className="mb-10 text-center">
        <Link
          href="/"
          className="text-[11px] tracking-[0.28em] text-cream/55 transition-colors hover:text-cream"
        >
          eyes.on.batumi
        </Link>
        <h1 className="mt-8 font-serif text-3xl">{album.title || dict.albumTitle}</h1>
        <p className="mt-3 text-sm text-cream/60">
          {photos.length} {dict.albumFrames}
        </p>
      </header>

      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {photos.map((photo) => (
          <li key={photo.id} className="overflow-hidden rounded-2xl border border-cream/10">
            <Link href={`/p/${photo.id}`} className="block">
              <div className="aspect-[4/5] bg-black/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/photos/${photo.id}/preview`}
                  alt=""
                  className="size-full object-cover"
                />
              </div>
            </Link>
            <a
              href={`/api/photos/${photo.id}/download`}
              className="block px-3 py-3 text-center text-sm text-terracotta hover:underline"
            >
              {dict.albumDownload}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
