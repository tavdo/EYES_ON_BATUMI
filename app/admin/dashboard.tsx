"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { uploadPhotoToBlob } from "@/lib/client-upload";
import type { AdminAlbum } from "@/lib/albums";
import type { Booking } from "@/lib/bookings";
import type { Photo } from "@/lib/photos";
import { QrButton } from "@/components/QrButton";
import { AdminAnalyticsPanel } from "./analytics-panel";
import { BookingsPanel } from "./bookings-panel";

type Props = {
  initialPhotos: Photo[];
  initialBookings: Booking[];
  initialAlbums: AdminAlbum[];
  useBlob: boolean;
  onVercel: boolean;
  botUsername: string;
};

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat("ka-GE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(timestamp));
}

export function AdminDashboard({
  initialPhotos,
  initialBookings,
  initialAlbums,
  useBlob,
  onVercel,
  botUsername,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [origin, setOrigin] = useState("");
  const [photos, setPhotos] = useState(initialPhotos);
  const [caption, setCaption] = useState("");
  const [expire, setExpire] = useState(true);
  const [makePublic, setMakePublic] = useState(false);
  const [watermark, setWatermark] = useState(false);
  const [season, setSeason] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "public" | "private" | "expiring">("all");
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [albums, setAlbums] = useState(initialAlbums);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const photoCountLabel = useMemo(() => {
    if (photos.length === 0) return "ფოტოები ჯერ არ არის";
    return `${photos.length} ფოტო`;
  }, [photos.length]);

  const filteredPhotos = useMemo(() => {
    const query = search.trim().toLowerCase();
    const week = Date.now() + 7 * 24 * 60 * 60 * 1000;
    return photos.filter((photo) => {
      if (filter === "public" && photo.is_public !== 1) return false;
      if (filter === "private" && photo.is_public === 1) return false;
      if (
        filter === "expiring" &&
        (photo.expires_at == null || photo.expires_at > week || photo.expires_at <= Date.now())
      ) {
        return false;
      }
      if (!query) return true;
      return (
        photo.id.toLowerCase().includes(query) ||
        (photo.caption ?? "").toLowerCase().includes(query) ||
        photo.original_filename.toLowerCase().includes(query)
      );
    });
  }, [photos, search, filter]);

  async function copyTelegramLink(code: string) {
    const link = `https://t.me/${botUsername}?start=${code}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopiedCode(code);
      window.setTimeout(
        () => setCopiedCode((current) => (current === code ? null : current)),
        1600,
      );
    } catch {
      window.prompt("Telegram:", link);
    }
  }

  async function createAlbumFromPhotos(photoIds: string[]) {
    if (photoIds.length === 0) return;
    const response = await fetch("/api/admin/albums", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photoIds, expire }),
    });
    const data = (await response.json()) as {
      albumId?: string;
      telegramCode?: string;
      telegramLink?: string;
      photoCount?: number;
      error?: string;
    };
    if (data.albumId && data.telegramCode) {
      const albumId = data.albumId;
      const telegramCode = data.telegramCode;
      const webUrl = `${window.location.origin}/a/${albumId}`;
      const telegramLink =
        data.telegramLink ?? `https://t.me/${botUsername}?start=${telegramCode}`;
      setMessage(
        `📁 ფოლდერი · ${data.photoCount ?? photoIds.length} ფოტო\nTelegram კოდი: ${telegramCode}\n${telegramLink}\nსაიტი: ${webUrl}`,
      );
      setAlbums((current) => [
        {
          id: albumId,
          title: null,
          created_at: Date.now(),
          expires_at: expire ? Date.now() + 30 * 24 * 60 * 60 * 1000 : null,
          active: 1,
          telegram_code: telegramCode,
          photo_count: data.photoCount ?? photoIds.length,
        },
        ...current,
      ]);
      try {
        await navigator.clipboard.writeText(telegramLink);
      } catch {
        // ignore
      }
    } else if (data.error) {
      setMessage(data.error);
    }
  }

  async function uploadFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList).filter((file) => file.size > 0);
    if (files.length === 0) return;

    setUploading(true);
    setMessage("");

    try {
      if (useBlob) {
        const uploaded: Photo[] = [];
        const errors: string[] = [];

        for (const file of files) {
          try {
            const stored = await uploadPhotoToBlob(file);
            const response = await fetch("/api/admin/complete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: stored.id,
                originalUrl: stored.originalUrl,
                thumbUrl: stored.thumbUrl,
                originalFilename: file.name,
                mimeType: file.type,
                caption: caption.trim() || null,
                expire,
                isPublic: makePublic,
                watermark,
                season: season || null,
              }),
            });
            const data = (await response.json()) as { photo?: Photo; error?: string };
            if (!response.ok || !data.photo) {
              errors.push(file.name);
              continue;
            }
            uploaded.push(data.photo);
          } catch {
            errors.push(file.name);
          }
        }

        if (uploaded.length) {
          setPhotos((current) => [...uploaded, ...current]);
          setCaption("");
          setMakePublic(false);
          void createAlbumFromPhotos(uploaded.map((photo) => photo.id));
        }
        if (errors.length) setMessage(errors.join(" · "));
        return;
      }

      const formData = new FormData();
      for (const file of files) formData.append("files", file);
      if (caption.trim()) formData.append("caption", caption.trim());
      formData.append("expire", expire ? "1" : "0");
      formData.append("isPublic", makePublic ? "1" : "0");
      formData.append("watermark", watermark ? "1" : "0");
      if (season) formData.append("season", season);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as {
        photos?: Photo[];
        errors?: { filename: string; error: string }[];
        error?: string;
      };

      if (!response.ok) {
        setMessage(data.error ?? "upload failed");
        return;
      }

      if (data.photos?.length) {
        setPhotos((current) => [...(data.photos ?? []), ...current]);
        setCaption("");
        setMakePublic(false);
        void createAlbumFromPhotos((data.photos ?? []).map((photo) => photo.id));
      }

      if (data.errors?.length) {
        setMessage(data.errors.map((item) => item.filename).join(" · "));
      }
    } catch {
      setMessage("upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function copyLink(id: string) {
    const url = `${window.location.origin}/p/${id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 1600);
    } catch {
      window.prompt("link:", url);
    }
  }

  async function togglePublic(photo: Photo) {
    const next = photo.is_public !== 1;
    setPublishingId(photo.id);
    try {
      const response = await fetch(`/api/admin/photos/${photo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: next }),
      });
      if (!response.ok) {
        setMessage("gallery update failed");
        return;
      }
      setPhotos((current) =>
        current.map((item) =>
          item.id === photo.id ? { ...item, is_public: next ? 1 : 0 } : item,
        ),
      );
    } catch {
      setMessage("gallery update failed");
    } finally {
      setPublishingId(null);
    }
  }

  async function toggleWatermark(photo: Photo) {
    const next = photo.watermark !== 1;
    setPublishingId(photo.id);
    try {
      const response = await fetch(`/api/admin/photos/${photo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ watermark: next }),
      });
      if (!response.ok) {
        setMessage("watermark update failed");
        return;
      }
      setPhotos((current) =>
        current.map((item) =>
          item.id === photo.id ? { ...item, watermark: next ? 1 : 0 } : item,
        ),
      );
    } finally {
      setPublishingId(null);
    }
  }

  async function removePhoto(id: string) {
    if (!window.confirm("Deactivate this link?")) return;
    setDeletingId(id);
    try {
      const response = await fetch(`/api/admin/photos/${id}`, { method: "DELETE" });
      if (!response.ok) {
        setMessage("delete failed");
        return;
      }
      setPhotos((current) => current.filter((photo) => photo.id !== id));
    } catch {
      setMessage("delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-12">
      <header className="mb-12 flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.28em] text-navy/50">eyes.on.batumi</p>
          <h1 className="mt-3 font-serif text-2xl">ადმინი</h1>
        </div>
        <form action="/api/admin/logout" method="post">
          <button type="submit" className="text-sm text-navy/55 transition-colors hover:text-navy">
            გასვლა
          </button>
        </form>
      </header>

      <BookingsPanel initialBookings={initialBookings} />

      <AdminAnalyticsPanel />

      <section className="mb-14">
        <h2 className="mb-5 text-sm tracking-wide text-navy/75">ახალი ფოტოს ატვირთვა</h2>
        {onVercel && !useBlob ? (
          <p className="mb-4 text-sm text-terracotta">
            Vercel Blob is not connected.
          </p>
        ) : null}

        <label
          onDragEnter={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            if (event.dataTransfer.files.length) {
              void uploadFiles(event.dataTransfer.files);
            }
          }}
          className={`flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-6 text-center transition-colors ${
            dragging ? "border-terracotta bg-terracotta/10" : "border-navy/25"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
            multiple
            className="sr-only"
            onChange={(event) => {
              if (event.target.files?.length) void uploadFiles(event.target.files);
            }}
          />
          <span className="text-sm text-navy/75">
            {uploading ? "იტვირთება..." : "ჩააგდე ფოტოები ან შეეხე ასარჩევად"}
          </span>
          <span className="mt-2 text-xs text-navy/40">
            JPEG, PNG, WebP, HEIC · max 50MB · ერთ ატვირთვაზე 50 ფოტო · ფოლდერს Telegram კოდი მიენიჭება
          </span>
        </label>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
          <input
            type="text"
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            placeholder="Short caption (optional)"
            maxLength={280}
            className="h-11 flex-1 rounded-full border border-navy/20 bg-transparent px-5 text-sm outline-none transition-colors placeholder:text-navy/30 focus:border-terracotta"
          />
          <label className="flex items-center gap-2 text-sm text-navy/65">
            <input
              type="checkbox"
              checked={expire}
              onChange={(event) => setExpire(event.target.checked)}
              className="size-4 accent-terracotta"
            />
            30 დღეში გაითიშოს
          </label>
          <label className="flex items-center gap-2 text-sm text-navy/65">
            <input
              type="checkbox"
              checked={makePublic}
              onChange={(event) => setMakePublic(event.target.checked)}
              className="size-4 accent-terracotta"
            />
            გალერეაში გამოჩნდეს
          </label>
          <label className="flex items-center gap-2 text-sm text-navy/65">
            <input
              type="checkbox"
              checked={watermark}
              onChange={(event) => setWatermark(event.target.checked)}
              className="size-4 accent-terracotta"
            />
            წარწერა preview-ზე
          </label>
          <select
            value={season}
            onChange={(event) => setSeason(event.target.value)}
            className="h-11 rounded-full border border-navy/20 bg-transparent px-4 text-sm outline-none focus:border-terracotta"
          >
            <option value="">სეზონი</option>
            <option value="summer">ზაფხული</option>
            <option value="autumn">შემოდგომა</option>
            <option value="winter">ზამა</option>
            <option value="spring">გაზაფხული</option>
          </select>
        </div>

        {message ? (
          <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-terracotta">{message}</p>
        ) : null}
      </section>

      <section className="mb-14">
        <h2 className="mb-5 text-sm tracking-wide text-navy/75">ფოლდერები · Telegram კოდები</h2>
        {albums.length === 0 ? (
          <p className="text-sm text-navy/45">
            ატვირთე ფოტოები — ავტომატურად შეიქმნება ფოლდერი და Telegram კოდი.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {albums.map((album) => {
              const code = album.telegram_code;
              const webUrl = `${origin}/a/${album.id}`;
              const telegramLink = code ? `https://t.me/${botUsername}?start=${code}` : null;
              return (
                <li
                  key={album.id}
                  className="rounded-2xl border border-navy/10 px-5 py-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">
                        {album.title || "ფოლდერი"} · {album.photo_count} ფოტო
                      </p>
                      <p className="mt-1 text-xs text-navy/40">{formatDate(album.created_at)}</p>
                    </div>
                    {code ? (
                      <span className="rounded-full bg-terracotta/15 px-3 py-1 font-mono text-sm text-terracotta">
                        {code}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-4 flex flex-col gap-2">
                    {telegramLink ? (
                      <button
                        type="button"
                        onClick={() => void copyTelegramLink(code!)}
                        className="h-10 rounded-full bg-terracotta text-sm font-medium text-navy"
                      >
                        {copiedCode === code ? "კოპირებულია" : "Telegram ბმული"}
                      </button>
                    ) : null}
                    <a
                      href={webUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="h-10 rounded-full border border-navy/20 text-center text-sm leading-10 text-navy/75 hover:border-terracotta hover:text-terracotta"
                    >
                      საიტზე ნახვა
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-sm tracking-wide text-navy/75">ატვირთული ფოტოები</h2>
            <p className="mt-1 text-xs text-navy/40">{photoCountLabel}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["all", "public", "private", "expiring"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`h-9 rounded-full px-3 text-xs ${
                  filter === item
                    ? "bg-terracotta text-navy"
                    : "border border-navy/20 text-navy/65"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="ძებნა..."
          className="mb-6 h-11 w-full rounded-full border border-navy/20 bg-transparent px-5 text-sm outline-none focus:border-terracotta"
        />

        {filteredPhotos.length === 0 ? (
          <p className="text-sm text-navy/45">The list is empty.</p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPhotos.map((photo) => (
              <li key={photo.id} className="overflow-hidden rounded-2xl border border-navy/10">
                <div className="aspect-[4/5] bg-black/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/api/photos/${photo.id}/preview`}
                    alt=""
                    className="size-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-3 p-4">
                  <div className="flex items-start justify-between gap-3 text-xs text-navy/50">
                    <span>{formatDate(photo.created_at)}</span>
                    <span>{photo.view_count} views</span>
                  </div>
                  <p className="text-xs text-navy/40">
                    {photo.is_public === 1 ? "გალერეაშია" : "პირადი ბმული"}
                    {photo.watermark === 1 ? " · watermark" : ""}
                    {photo.season ? ` · ${photo.season}` : ""}
                  </p>
                  {photo.caption ? (
                    <p className="line-clamp-2 text-sm text-navy/75">{photo.caption}</p>
                  ) : null}
                  {photo.expires_at ? (
                    <p className="text-xs text-navy/35">
                      {photo.expires_at <= Date.now()
                        ? "Expired"
                        : `Until ${formatDate(photo.expires_at)}`}
                    </p>
                  ) : null}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => void copyLink(photo.id)}
                        className="h-10 flex-1 rounded-full bg-terracotta text-sm font-medium text-navy transition-opacity hover:opacity-90"
                      >
                        {copiedId === photo.id ? "კოპირებულია" : "ბმული"}
                      </button>
                      <QrButton url={`${origin}/p/${photo.id}`} label="QR" />
                      <button
                        type="button"
                        onClick={() => void removePhoto(photo.id)}
                        disabled={deletingId === photo.id}
                        className="h-10 rounded-full border border-navy/20 px-4 text-sm text-navy/65 transition-colors hover:border-terracotta hover:text-terracotta disabled:opacity-50"
                      >
                        წაშლა
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => void toggleWatermark(photo)}
                      disabled={publishingId === photo.id}
                      className="h-10 rounded-full border border-navy/20 text-sm text-navy/75 transition-colors hover:border-terracotta hover:text-terracotta disabled:opacity-50"
                    >
                      {photo.watermark === 1 ? "Watermark OFF" : "Watermark ON"}
                    </button>
                    <button
                      type="button"
                      onClick={() => void togglePublic(photo)}
                      disabled={publishingId === photo.id}
                      className="h-10 rounded-full border border-navy/20 text-sm text-navy/75 transition-colors hover:border-terracotta hover:text-terracotta disabled:opacity-50"
                    >
                      {photo.is_public === 1 ? "გალერეიდან მოხსნა" : "გალერეაში დამატება"}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
