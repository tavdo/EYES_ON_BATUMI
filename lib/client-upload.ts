"use client";

import { upload } from "@vercel/blob/client";
import { nanoid } from "nanoid";

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif",
};

async function makeThumb(file: File) {
  try {
    const bitmap = await createImageBitmap(file);
    const max = 1400;
    const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas");
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", 0.82);
    });
    if (!blob) throw new Error("thumb");
    return blob;
  } catch {
    return null;
  }
}

export async function uploadPhotoToBlob(file: File) {
  const id = nanoid(21);
  const ext = MIME_TO_EXT[file.type] ?? "jpg";

  const original = await upload(`photos/${id}/original.${ext}`, file, {
    access: "private",
    handleUploadUrl: "/api/admin/blob",
    multipart: true,
  });

  const thumbInput = (await makeThumb(file)) ?? file;
  const thumb = await upload(`photos/${id}/thumb.jpg`, thumbInput, {
    access: "private",
    handleUploadUrl: "/api/admin/blob",
    multipart: true,
    contentType: thumbInput === file ? file.type : "image/jpeg",
  });

  return {
    id,
    originalUrl: original.url,
    thumbUrl: thumb.url,
  };
}
