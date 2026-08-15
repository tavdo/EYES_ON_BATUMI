"use client";

import { useMemo, useRef, useState } from "react";
import { uploadPhotoToBlob } from "@/lib/client-upload";
import type { Photo } from "@/lib/photos";

type Props = {
  initialPhotos: Photo[];
  useBlob: boolean;
  onVercel: boolean;
};

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat("ka-GE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(timestamp));
}

export function AdminDashboard({ initialPhotos, useBlob, onVercel }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState(initialPhotos);
  const [caption, setCaption] = useState("");
  const [expire, setExpire] = useState(true);
  const [makePublic, setMakePublic] = useState(false);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const photoCountLabel = useMemo(() => {
    if (photos.length === 0) return "ფოტოები ჯერ არ არის";
    return `${photos.length} ფოტო`;
  }, [photos.length]);

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
        }
        if (errors.length) setMessage(errors.join(" · "));
        return;
      }

      const formData = new FormData();
      for (const file of files) formData.append("files", file);
      if (caption.trim()) formData.append("caption", caption.trim());
      formData.append("expire", expire ? "1" : "0");
      formData.append("isPublic", makePublic ? "1" : "0");

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
          <p className="text-[11px] tracking-[0.28em] text-cream/55">eyes.on.batumi</p>
          <h1 className="mt-3 font-serif text-2xl">ადმინი</h1>
        </div>
        <form action="/api/admin/logout" method="post">
          <button type="submit" className="text-sm text-cream/60 transition-colors hover:text-cream">
            გასვლა
          </button>
        </form>
      </header>

      <section className="mb-14">
        <h2 className="mb-5 text-sm tracking-wide text-cream/80">ახალი ფოტოს ატვირთვა</h2>
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
            dragging ? "border-terracotta bg-terracotta/10" : "border-cream/25"
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
          <span className="text-sm text-cream/80">
            {uploading ? "იტვირთება..." : "ჩააგდე ფოტოები ან შეეხე ასარჩევად"}
          </span>
          <span className="mt-2 text-xs text-cream/45">JPEG, PNG, WebP, HEIC · max 50MB</span>
        </label>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
          <input
            type="text"
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            placeholder="Short caption (optional)"
            maxLength={280}
            className="h-11 flex-1 rounded-full border border-cream/20 bg-transparent px-5 text-sm outline-none transition-colors placeholder:text-cream/35 focus:border-terracotta"
          />
          <label className="flex items-center gap-2 text-sm text-cream/70">
            <input
              type="checkbox"
              checked={expire}
              onChange={(event) => setExpire(event.target.checked)}
              className="size-4 accent-terracotta"
            />
            30 დღეში გაითიშოს
          </label>
          <label className="flex items-center gap-2 text-sm text-cream/70">
            <input
              type="checkbox"
              checked={makePublic}
              onChange={(event) => setMakePublic(event.target.checked)}
              className="size-4 accent-terracotta"
            />
            გალერეაში გამოჩნდეს
          </label>
        </div>

        {message ? <p className="mt-4 text-sm text-terracotta">{message}</p> : null}
      </section>

      <section>
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-sm tracking-wide text-cream/80">ატვირთული ფოტოები</h2>
          <p className="text-xs text-cream/45">{photoCountLabel}</p>
        </div>

        {photos.length === 0 ? (
          <p className="text-sm text-cream/50">The list is empty.</p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <li key={photo.id} className="overflow-hidden rounded-2xl border border-cream/10">
                <div className="aspect-[4/5] bg-black/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/api/photos/${photo.id}/preview`}
                    alt=""
                    className="size-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-3 p-4">
                  <div className="flex items-start justify-between gap-3 text-xs text-cream/55">
                    <span>{formatDate(photo.created_at)}</span>
                    <span>{photo.view_count} views</span>
                  </div>
                  <p className="text-xs text-cream/45">
                    {photo.is_public === 1 ? "გალერეაშია" : "პირადი ბმული"}
                  </p>
                  {photo.caption ? (
                    <p className="line-clamp-2 text-sm text-cream/80">{photo.caption}</p>
                  ) : null}
                  {photo.expires_at ? (
                    <p className="text-xs text-cream/40">
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
                        {copiedId === photo.id ? "კოპირებულია" : "ბმულის კოპირება"}
                      </button>
                      <button
                        type="button"
                        onClick={() => void removePhoto(photo.id)}
                        disabled={deletingId === photo.id}
                        className="h-10 rounded-full border border-cream/20 px-4 text-sm text-cream/70 transition-colors hover:border-terracotta hover:text-terracotta disabled:opacity-50"
                      >
                        წაშლა
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => void togglePublic(photo)}
                      disabled={publishingId === photo.id}
                      className="h-10 rounded-full border border-cream/20 text-sm text-cream/80 transition-colors hover:border-terracotta hover:text-terracotta disabled:opacity-50"
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
