"use client";

import Link from "next/link";
import { AnalyticsBeacon } from "@/components/AnalyticsBeacon";
import { BookingForm } from "@/components/BookingForm";
import { ContactLinks } from "@/components/ContactLinks";
import { GalleryLightbox } from "@/components/GalleryLightbox";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { WHATSAPP_URL } from "@/lib/contact";
import type { Dictionary, Locale } from "@/lib/i18n";
import { getPricingLine, localizedField } from "@/lib/i18n";
import type { Photo } from "@/lib/photos";
import { HOW_IT_WORKS, LOCATIONS, TESTIMONIALS } from "@/lib/site-content";
import { INSTAGRAM_URL, TELEGRAM_BOT_URL, TIKTOK_URL } from "@/lib/social";

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
        <div className="relative z-10 flex max-w-xl flex-col items-center text-center">
          <p className="text-glow reveal mb-10 text-[11px] font-medium tracking-[0.32em] text-navy/80">
            {dict.tagline}
          </p>
          <h1 className="font-display text-glow reveal reveal-delay text-center text-5xl font-normal tracking-[0.06em] text-navy sm:text-6xl">
            eyes.on.batumi
          </h1>
          <p className="text-glow reveal reveal-delay-2 mt-6 max-w-xs text-center font-serif text-lg leading-relaxed text-navy">
            {dict.heroSubtitle}
          </p>
          <div className="reveal reveal-delay-3 mt-14 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#book"
              className="rounded-full bg-terracotta px-5 py-2.5 text-sm font-semibold text-navy transition-opacity hover:opacity-90"
            >
              {dict.book}
            </a>
            {photos.length > 0 ? (
              <a
                href="#gallery"
                className="rounded-full border border-navy/25 bg-white/85 px-5 py-2.5 text-sm font-medium text-navy shadow-sm backdrop-blur-sm transition-all hover:border-terracotta hover:text-terracotta"
              >
                {dict.gallery}
              </a>
            ) : null}
            <Link
              href={TELEGRAM_BOT_URL}
              className="rounded-full border border-navy/25 bg-white/85 px-5 py-2.5 text-sm font-medium text-navy shadow-sm backdrop-blur-sm transition-all hover:border-terracotta hover:text-terracotta"
              target="_blank"
              rel="noreferrer"
            >
              {dict.telegram}
            </Link>
            <Link
              href={WHATSAPP_URL}
              className="rounded-full border border-navy/25 bg-white/85 px-5 py-2.5 text-sm font-medium text-navy shadow-sm backdrop-blur-sm transition-all hover:border-terracotta hover:text-terracotta"
              target="_blank"
              rel="noreferrer"
            >
              {dict.whatsapp}
            </Link>
            <Link
              href={INSTAGRAM_URL}
              className="rounded-full border border-navy/25 bg-white/85 px-5 py-2.5 text-sm font-medium text-navy shadow-sm backdrop-blur-sm transition-all hover:border-terracotta hover:text-terracotta"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </Link>
            <Link
              href={TIKTOK_URL}
              className="rounded-full border border-navy/25 bg-white/85 px-5 py-2.5 text-sm font-medium text-navy shadow-sm backdrop-blur-sm transition-all hover:border-terracotta hover:text-terracotta"
              target="_blank"
              rel="noreferrer"
            >
              TikTok
            </Link>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-4xl px-5 pb-16 sm:px-8">
        <h2 className="text-glow mb-8 text-center font-serif text-2xl font-semibold text-navy">
          {dict.howItWorksTitle}
        </h2>
        <ol className="grid gap-4 sm:grid-cols-3">
          {HOW_IT_WORKS.map((step, index) => (
            <li key={step.titleKa} className="surface rounded-2xl px-5 py-6">
              <p className="mb-2 text-xs font-medium tracking-wide text-terracotta">
                0{index + 1}
              </p>
              <p className="font-semibold text-navy">
                {localizedField(locale, {
                  ka: step.titleKa,
                  en: step.titleEn,
                  ru: step.titleRu,
                })}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-navy/80">
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

      <section className="relative z-10 mx-auto w-full max-w-xl px-5 pb-16 text-center sm:px-8">
        <div className="surface rounded-[2rem] px-6 py-8">
          <h2 className="mb-4 font-serif text-2xl font-semibold text-navy">{dict.pricingTitle}</h2>
          <p className="font-serif text-4xl font-medium text-terracotta">{getPricingLine(locale)}</p>
          <p className="mt-4 text-sm leading-relaxed text-navy/80">{dict.pricingNote}</p>
          <h3 className="mt-10 mb-4 text-xs font-medium tracking-wide text-navy/70">
            {dict.locationsTitle}
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {LOCATIONS[locale].map((place) => (
              <span
                key={place}
                className="rounded-full border border-navy/20 bg-white/90 px-4 py-2 text-xs font-medium text-navy"
              >
                {place}
              </span>
            ))}
          </div>
        </div>
      </section>

      {seasonPhotos.length > 0 ? (
        <section id="season" className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-16 sm:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="text-glow font-serif text-2xl font-semibold text-navy">
              {dict.seasonalTitle}
            </h2>
            {photos.length > seasonPhotos.length ? (
              <a
                href="#gallery"
                className="rounded-full bg-white/85 px-3 py-1 text-sm font-medium text-navy shadow-sm hover:text-terracotta"
              >
                {dict.seasonalMore} →
              </a>
            ) : null}
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
            {seasonPhotos.map((photo) => (
              <li key={photo.id}>
                <Link
                  href={`/p/${photo.id}`}
                  className="group block overflow-hidden rounded-2xl border border-navy/15 bg-white shadow-sm"
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

      <section className="relative z-10 mx-auto w-full max-w-4xl px-5 pb-16 sm:px-8">
        <h2 className="text-glow mb-8 text-center font-serif text-2xl font-semibold text-navy">
          {dict.testimonialsTitle}
        </h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <li key={item.author} className="surface rounded-2xl px-5 py-6">
              <p className="text-sm leading-relaxed text-navy/90">
                “
                {localizedField(locale, {
                  ka: item.quoteKa,
                  en: item.quoteEn,
                  ru: item.quoteRu,
                })}
                ”
              </p>
              <p className="mt-4 text-xs font-medium text-navy/70">— {item.author}</p>
            </li>
          ))}
        </ul>
      </section>

      {photos.length > 0 ? (
        <section
          id="gallery"
          className="relative z-10 mx-auto w-full max-w-5xl scroll-mt-24 px-5 pb-20 sm:px-8"
        >
          <h2 className="text-glow mb-8 text-center font-serif text-2xl font-semibold text-navy">
            {dict.galleryTitle}
          </h2>
          <GalleryLightbox
            photos={photos}
            title={dict.galleryTitle}
            openLabel={dict.galleryOpen}
          />
        </section>
      ) : null}

      <section id="book" className="relative z-20 mx-auto w-full max-w-xl scroll-mt-24 px-5 pb-20 sm:px-8">
        <div className="rounded-[2rem] border border-navy/10 bg-white/95 px-5 py-8 shadow-sm backdrop-blur-md sm:px-8 sm:py-10">
          <h2 className="mb-3 text-center font-serif text-2xl font-semibold text-navy">
            {dict.bookTitle}
          </h2>
          <p className="mx-auto mb-8 max-w-sm text-center text-sm leading-relaxed text-navy/80">
            {dict.bookBlurb}
          </p>
          <BookingForm dict={dict} />
          <ContactLinks label={dict.contactDirect} telegramLabel={dict.telegram} />
        </div>
      </section>
    </main>
  );
}
