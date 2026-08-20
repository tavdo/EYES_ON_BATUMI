import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { createPhotoId, insertPhoto } from "@/lib/photos";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_FILE_BYTES,
  saveOriginalAndThumb,
} from "@/lib/storage";

export const runtime = "nodejs";
export const maxDuration = 60;

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "შესვლა საჭიროა" }, { status: 401 });
  }

  const formData = await request.formData();
  const files = formData
    .getAll("files")
    .filter((value): value is File => value instanceof File && value.size > 0);

  if (files.length === 0) {
    return NextResponse.json({ error: "ფაილი არ არის არჩეული" }, { status: 400 });
  }

  if (files.length > 20) {
    return NextResponse.json(
      { error: "ერთდროულად მაქსიმუმ 20 ფოტო" },
      { status: 400 },
    );
  }

  const captionRaw = formData.get("caption");
  const caption =
    typeof captionRaw === "string" && captionRaw.trim()
      ? captionRaw.trim().slice(0, 280)
      : null;

  const expire = formData.get("expire") !== "0";
  const expiresAt = expire ? Date.now() + THIRTY_DAYS_MS : null;
  const isPublic = formData.get("isPublic") === "1";
  const watermark = formData.get("watermark") === "1";
  const seasonRaw = formData.get("season");
  const season =
    typeof seasonRaw === "string" &&
    ["summer", "autumn", "winter", "spring"].includes(seasonRaw)
      ? (seasonRaw as "summer" | "autumn" | "winter" | "spring")
      : null;

  const photos = [];
  const errors: { filename: string; error: string }[] = [];

  for (const file of files) {
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      errors.push({
        filename: file.name,
        error: "დასაშვებია მხოლოდ JPEG, PNG, WebP ან HEIC",
      });
      continue;
    }

    if (file.size > MAX_FILE_BYTES) {
      errors.push({
        filename: file.name,
        error: "ფაილი 50MB-ზე დიდია",
      });
      continue;
    }

    try {
      const id = createPhotoId();
      const stored = await saveOriginalAndThumb(id, file);
      const photo = await insertPhoto({
        id,
        originalFilename: file.name || `photo.${stored.mimeType.split("/")[1] ?? "jpg"}`,
        mimeType: stored.mimeType,
        originalPath: stored.originalPath,
        thumbPath: stored.thumbPath,
        caption,
        expiresAt,
        isPublic,
        watermark,
        season,
      });

      if (photo) photos.push(photo);
    } catch {
      errors.push({
        filename: file.name,
        error: "ატვირთვა ვერ მოხერხდა",
      });
    }
  }

  return NextResponse.json({ photos, errors });
}
