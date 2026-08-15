import type { Metadata } from "next";
import Link from "next/link";
import { getPhotoById, incrementViewCount, isPhotoAccessible } from "@/lib/photos";
import { INSTAGRAM_URL, SOCIAL_HANDLE } from "@/lib/social";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "თქვენი ფოტო — eyes.on.batumi",
    robots: { index: false, follow: false, nocache: true },
  };
}

function InvalidLink() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 py-16">
      <p className="reveal mb-12 text-[11px] tracking-[0.28em] text-cream/55">
        eyes.on.batumi
      </p>
      <p className="reveal reveal-delay max-w-sm text-center font-serif text-xl leading-relaxed text-cream/90">
        ეს ბმული არასწორია ან ვადაგასულია
      </p>
    </main>
  );
}

export default async function PhotoPage({ params }: PageProps) {
  const { id } = await params;
  const photo = await getPhotoById(id);

  if (!photo || !isPhotoAccessible(photo)) {
    return <InvalidLink />;
  }

  await incrementViewCount(photo.id);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-5 py-10 sm:px-8 sm:py-14">
      <header className="mb-12 text-center">
        <Link
          href="/"
          className="reveal text-[11px] tracking-[0.28em] text-cream/55 transition-colors hover:text-cream"
        >
          eyes.on.batumi
        </Link>
        <h1 className="reveal reveal-delay mt-8 font-serif text-[1.65rem] leading-snug tracking-wide sm:text-3xl">
          თქვენი კადრი ბათუმის ქუჩებიდან
        </h1>
        {photo.caption ? (
          <p className="reveal reveal-delay-2 mt-4 text-sm leading-relaxed text-cream/70">
            {photo.caption}
          </p>
        ) : null}
      </header>

      <div className="reveal reveal-delay-2 flex flex-1 flex-col items-center">
        <div className="photo-plate w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/photos/${photo.id}/preview`}
            alt="თქვენი კადრი ბათუმის ქუჩებიდან"
            className="max-h-[72dvh] w-full object-contain"
          />
        </div>

        <a
          href={`/api/photos/${photo.id}/download`}
          className="btn-lift mt-10 inline-flex min-h-12 w-full max-w-sm items-center justify-center rounded-full bg-terracotta px-6 text-center text-[15px] font-medium text-navy"
        >
          ჩამოტვირთე მაღალი ხარისხით
        </a>
      </div>

      <footer className="reveal reveal-delay-3 mt-16 pb-4 text-center text-[13px] leading-relaxed text-cream/55">
        გადაღებულია{" "}
        <Link
          href={INSTAGRAM_URL}
          className="text-cream/80 underline decoration-cream/25 underline-offset-4 hover:text-terracotta"
          target="_blank"
          rel="noreferrer"
        >
          {SOCIAL_HANDLE}
        </Link>
        -ს მიერ. თუ გააზიარებ, მონიშნე ჩვენი ექაუნთი 🙏
      </footer>
    </main>
  );
}
