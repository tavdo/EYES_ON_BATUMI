"use client";

import Link from "next/link";
import { AnalyticsBeacon } from "@/components/AnalyticsBeacon";
import { BookingForm } from "@/components/BookingForm";
import { ContactLinks } from "@/components/ContactLinks";
import { GalleryLightbox } from "@/components/GalleryLightbox";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { WHATSAPP_URL } from "@/lib/contact";
import type { Dictionary, Locale } from "@/lib/i18n";
import { localizedField } from "@/lib/i18n";
import type { Photo } from "@/lib/photos";
import {
  HOW_IT_WORKS,
  LOCATIONS,
  PRICING,
  TESTIMONIALS,
} from "@/lib/site-content";
import { INSTAGRAM_URL, TIKTOK_URL } from "@/lib/social";

type Props = {
  locale: Locale;
  dict: Dictionary;
  photos: Photo[];
  seasonPhotos: Photo[];
};

export function HomeView({ locale, dict, photos, seasonPhotos }: Props) {
  return (
    <main className="flex min-h-dvh flex-col">
      <AnalyticsBeacon event="home_view" />
      <LanguageSwitcher locale={locale} />

      <section className="flex min-h-dvh flex-col items-center justify-center px-6 py-16">
        <p className="reveal mb-10 text-[11px] tracking-[0.32em] text-cream/65">
          {dict.tagline}
        </p>
        <h1 className="reveal reveal-delay text-center text-4xl font-medium tracking-[0.1em] sm:text-5xl">
          eyes.on.batumi
        </h1>
        <p className="reveal reveal-delay-2 mt-6 max-w-xs text-center font-serif text-lg leading-relaxed text-cream/80">
          {dict.heroSubtitle}
        </p>
        <div className="reveal reveal-delay-3 mt-14 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#book"
            className="rounded-full bg-terracotta px-5 py-2.5 text-sm font-medium text-navy transition-opacity hover:opacity-90"
          >
            {dict.book}
          </a>
          {photos.length > 0 ? (
            <a
              href="#gallery"
              className="rounded-full border border-cream/20 px-5 py-2.5 text-sm text-cream/80 transition-all hover:border-terracotta hover:text-terracotta"
            >
              {dict.gallery}
            </a>
          ) : null}
          <Link
            href={WHATSAPP_URL}
            className="rounded-full border border-cream/20 px-5 py-2.5 text-sm text-cream/80 transition-all hover:border-terracotta hover:text-terracotta"
            target="_blank"
            rel="noreferrer"
          >
            {dict.whatsapp}
          </Link>
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

      <section className="mx-auto w-full max-w-4xl px-5 pb-16 sm:px-8">
        <h2 className="mb-8 text-center font-serif text-2xl">{dict.howItWorksTitle}</h2>
        <ol className="grid gap-4 sm:grid-cols-3">
          {HOW_IT_WORKS.map((step, index) => (
            <li
              key={step.titleKa}
              className="rounded-2xl border border-cream/10 px-5 py-6"
            >
              <p className="mb-2 text-xs tracking-wide text-terracotta">0{index + 1}</p>
              <p className="font-medium">
                {localizedField(locale, {
                  ka: step.titleKa,
                  en: step.titleEn,
                  ru: step.titleRu,
                })}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-cream/65">
                {localizedField(locale, {
                  ka: step.bodyKa,
                  en: step.bodyEn,
                  ru: step.bodyRu,
                })}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto w-full max-w-xl px-5 pb-16 text-center sm:px-8">
        <h2 className="mb-4 font-serif text-2xl">{dict.pricingTitle}</h2>
        <p className="font-serif text-4xl text-terracotta">
          {dict.pricingFrom} {PRICING.fromGel} ₾
        </p>
        <p className="mt-4 text-sm leading-relaxed text-cream/65">{dict.pricingNote}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {LOCATIONS.map((place) => (
            <span
              key={place}
              className="rounded-full border border-cream/15 px-4 py-2 text-xs text-cream/70"
            >
              {place}
            </span>
          ))}
        </div>
        <p className="mt-6 text-xs tracking-wide text-cream/45">{dict.locationsTitle}</p>
      </section>

      {seasonPhotos.length > 0 ? (
        <section id="season" className="mx-auto w-full max-w-5xl px-5 pb-16 sm:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="font-serif text-2xl">{dict.seasonalTitle}</h2>
            {photos.length > seasonPhotos.length ? (
              <a href="#gallery" className="text-sm text-cream/60 hover:text-terracotta">
                {dict.seasonalMore} →
              </a>
            ) : null}
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
            {seasonPhotos.map((photo) => (
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
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mx-auto w-full max-w-4xl px-5 pb-16 sm:px-8">
        <h2 className="mb-8 text-center font-serif text-2xl">{dict.testimonialsTitle}</h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <li
              key={item.author}
              className="rounded-2xl border border-cream/10 px-5 py-6"
            >
              <p className="text-sm leading-relaxed text-cream/75">
                “
                {localizedField(locale, {
                  ka: item.quoteKa,
                  en: item.quoteEn,
                  ru: item.quoteRu,
                })}
                ”
              </p>
              <p className="mt-4 text-xs text-cream/45">— {item.author}</p>
            </li>
          ))}
        </ul>
      </section>

      {photos.length > 0 ? (
        <section id="gallery" className="mx-auto w-full max-w-5xl scroll-mt-24 px-5 pb-20 sm:px-8">
          <h2 className="mb-8 text-center font-serif text-2xl">{dict.galleryTitle}</h2>
          <GalleryLightbox photos={photos} title={dict.galleryTitle} />
        </section>
      ) : null}

      <section id="book" className="mx-auto w-full max-w-xl scroll-mt-24 px-5 pb-20 sm:px-8">
        <h2 className="mb-3 text-center font-serif text-2xl">{dict.bookTitle}</h2>
        <p className="mx-auto mb-8 max-w-sm text-center text-sm leading-relaxed text-cream/65">
          {dict.bookBlurb}
        </p>
        <BookingForm />
        <ContactLinks label={dict.contactDirect} />
      </section>
    </main>
  );
}
