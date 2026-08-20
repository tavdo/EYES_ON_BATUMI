"use client";

import { useEffect, useState } from "react";
import type { Photo } from "@/lib/photos";

type Props = {
  photos: Photo[];
  title: string;
};

export function GalleryLightbox({ photos, title }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const openIndex = openId ? photos.findIndex((photo) => photo.id === openId) : -1;
  const current = openIndex >= 0 ? photos[openIndex] : null;

  useEffect(() => {
    if (!openId) return;
    void fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "gallery_open", targetId: openId }),
    });
  }, [openId]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (!openId) return;
      if (event.key === "Escape") setOpenId(null);
      if (event.key === "ArrowRight" && openIndex < photos.length - 1) {
        setOpenId(photos[openIndex + 1].id);
      }
      if (event.key === "ArrowLeft" && openIndex > 0) {
        setOpenId(photos[openIndex - 1].id);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openId, openIndex, photos]);

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
        {photos.map((photo) => (
          <li key={photo.id}>
            <button
              type="button"
              onClick={() => setOpenId(photo.id)}
              className="group block w-full overflow-hidden rounded-2xl border border-cream/10 bg-black/20 text-left"
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
            </button>
          </li>
        ))}
      </ul>

      {current ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setOpenId(null)}
        >
          <div
            className="relative max-h-[90dvh] w-full max-w-4xl"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="mb-4 text-center text-sm text-cream/60">{title}</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/photos/${current.id}/preview`}
              alt={current.caption || "eyes.on.batumi"}
              className="mx-auto max-h-[78dvh] w-full object-contain"
            />
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                disabled={openIndex <= 0}
                onClick={() => setOpenId(photos[openIndex - 1].id)}
                className="rounded-full border border-cream/20 px-4 py-2 text-sm disabled:opacity-40"
              >
                ←
              </button>
              <a
                href={`/p/${current.id}`}
                className="rounded-full bg-terracotta px-5 py-2 text-sm font-medium text-navy"
              >
                {title}
              </a>
              <button
                type="button"
                disabled={openIndex >= photos.length - 1}
                onClick={() => setOpenId(photos[openIndex + 1].id)}
                className="rounded-full border border-cream/20 px-4 py-2 text-sm disabled:opacity-40"
              >
                →
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
